/**
 * 新版 BFF 服务层 - 通过 HTTP 调用微服务 API
 * 这是真实企业项目中的 BFF 架构
 */

import { ServicesConfig, HttpClientConfig } from '@/config/services.config';
import { ClassWithStats } from '@/types/class';
import { Student } from '@/types/student';

/**
 * HTTP 客户端封装
 */
class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    // 自动检测运行环境，获取正确的 base URL
    this.baseUrl = baseUrl || this.getBaseUrl();
  }

  /**
   * 获取 base URL（兼容本地开发和生产环境）
   */
  private getBaseUrl(): string {
    // 1. 浏览器环境
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    
    // 2. Edge Runtime（Cloudflare Workers/Next.js Edge）
    // 从 Request 对象获取（通过全局注入）
    if (typeof globalThis !== 'undefined' && (globalThis as any).__NEXT_REQUEST_URL__) {
      return (globalThis as any).__NEXT_REQUEST_URL__;
    }
    
    // 3. 本地开发环境
    if (process.env.NODE_ENV === 'development') {
      return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    }
    
    // 4. 生产环境（Cloudflare）
    return process.env.NEXT_PUBLIC_APP_URL || '';
  }

  async get<T>(url: string, requestUrl?: string): Promise<T> {
    // 如果传入了 requestUrl（从 Request 对象获取），使用它来构建完整 URL
    let fullUrl: string;
    
    if (url.startsWith('http')) {
      fullUrl = url;
    } else if (requestUrl) {
      // 从 Request URL 中提取 origin
      const origin = new URL(requestUrl).origin;
      fullUrl = `${origin}${url}`;
    } else if (this.baseUrl) {
      fullUrl = `${this.baseUrl}${url}`;
    } else {
      throw new Error(`Cannot construct full URL from: ${url}`);
    }
    
    console.log(`[BFF HTTP] GET ${url}`);
    const startTime = Date.now();
    
    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: HttpClientConfig.defaultHeaders,
        signal: AbortSignal.timeout(HttpClientConfig.defaultTimeout),
      });

      const duration = Date.now() - startTime;
      console.log(`[BFF HTTP] GET ${url} - ${response.status} (${duration}ms)`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json() as any;
      
      // 微服务返回格式：{ success: true, data: {...}, metadata: {...} }
      if (data.success) {
        return data.data;
      }
      
      throw new Error(data.error || 'Unknown error');
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[BFF HTTP] GET ${url} - Error (${duration}ms):`, error);
      throw error;
    }
  }
}

/**
 * BFF 服务 - 聚合多个微服务的数据
 */
export class BFFServiceV2 {
  private httpClient: HttpClient;
  private requestUrl?: string;

  constructor(requestUrl?: string) {
    this.httpClient = new HttpClient();
    this.requestUrl = requestUrl;
  }

  /**
   * 调用学生微服务 - 获取所有学生
   */
  private async fetchStudents(): Promise<Student[]> {
    // 关键：这里调用的是微服务 API，不是直接查数据库
    return this.httpClient.get<Student[]>('/api/microservices/students', this.requestUrl);
  }

  /**
   * 调用学生微服务 - 获取单个学生
   */
  private async fetchStudent(id: number): Promise<Student> {
    return this.httpClient.get<Student>(`/api/microservices/students/${id}`, this.requestUrl);
  }

  /**
   * 调用班级微服务 - 获取所有班级
   */
  private async fetchClasses() {
    return this.httpClient.get('/api/microservices/classes', this.requestUrl);
  }

  /**
   * 调用班级微服务 - 获取单个班级
   */
  private async fetchClass(id: number) {
    return this.httpClient.get(`/api/microservices/classes/${id}`, this.requestUrl);
  }

  /**
   * BFF 聚合：获取班级详情（带统计信息）
   * 这里展示了 BFF 的核心价值：调用多个微服务，聚合数据
   */
  async getClassWithStats(classId: number): Promise<ClassWithStats | null> {
    try {
      console.log(`[BFF] 开始聚合班级 ${classId} 的数据...`);
      const startTime = Date.now();

      // 并行调用多个微服务（这是 BFF 的精髓！）
      const [classData, allStudents] = await Promise.all([
        this.fetchClass(classId),           // 调用班级微服务
        this.fetchStudents(),                // 调用学生微服务
      ]);

      // 在本地过滤学生（真实场景中，学生微服务可能提供过滤接口）
      const classStudents = allStudents.filter((s: any) => s.class_id === classId);

      // BFF 层计算统计信息
      const studentCount = classStudents.length;
      const averageAge = studentCount > 0
        ? classStudents.reduce((sum: number, s: any) => sum + s.age, 0) / studentCount
        : 0;

      const result = {
        id: (classData as any).id,
        name: (classData as any).name,
        grade: (classData as any).grade,
        teacherName: (classData as any).teacher_name,
        studentCount,
        averageAge: Math.round(averageAge * 10) / 10,
        students: classStudents.map((s: any) => ({
          id: s.id,
          name: s.name,
          age: s.age,
          email: s.email,
        })),
      };

      const duration = Date.now() - startTime;
      console.log(`[BFF] 班级 ${classId} 数据聚合完成，耗时 ${duration}ms`);
      console.log(`[BFF] 并行调用了 2 个微服务 API，返回了聚合后的数据`);

      return result;
    } catch (error) {
      console.error('[BFF] 聚合班级数据失败:', error);
      return null;
    }
  }

  /**
   * BFF 聚合：获取所有班级的统计信息
   */
  async getAllClassesWithStats(): Promise<ClassWithStats[]> {
    try {
      console.log('[BFF] 开始聚合所有班级数据...');
      const startTime = Date.now();

      const classes = await this.fetchClasses();
      
      // 并行获取每个班级的统计信息
      const classesWithStats = await Promise.all(
        (classes as any[]).map((classData) => this.getClassWithStats(classData.id))
      );

      const duration = Date.now() - startTime;
      console.log(`[BFF] 所有班级数据聚合完成，耗时 ${duration}ms`);

      return classesWithStats.filter((c): c is ClassWithStats => c !== null);
    } catch (error) {
      console.error('[BFF] 聚合所有班级数据失败:', error);
      return [];
    }
  }

  /**
   * BFF 数据转换：按年龄分组学生
   */
  async getStudentsByAgeGroup() {
    try {
      console.log('[BFF] 按年龄分组学生...');
      const startTime = Date.now();

      // 调用学生微服务
      const allStudents = await this.fetchStudents();
      
      // BFF 层进行数据转换，适配前端需求
      const result = {
        teenagers: (allStudents as any[]).filter(s => s.age >= 13 && s.age <= 15),
        youngAdults: (allStudents as any[]).filter(s => s.age >= 16 && s.age <= 18),
        adults: (allStudents as any[]).filter(s => s.age >= 19),
      };

      const duration = Date.now() - startTime;
      console.log(`[BFF] 年龄分组完成，耗时 ${duration}ms`);

      return result;
    } catch (error) {
      console.error('[BFF] 年龄分组失败:', error);
      throw error;
    }
  }

  /**
   * 🔥 BFF 核心场景：仪表板数据聚合
   * 这里展示了 BFF 最大的价值：
   * 1. 前端只需要 1 次请求
   * 2. BFF 并行调用多个微服务（内网，快速）
   * 3. BFF 聚合、计算、转换数据
   * 4. 返回前端需要的精简格式
   */
  async getDashboardData() {
    try {
      console.log('');
      console.log('='.repeat(60));
      console.log('[BFF] 🚀 开始聚合仪表板数据...');
      console.log('[BFF] 这是 BFF 架构的核心价值演示：');
      console.log('[BFF] - 前端只发起 1 次请求');
      console.log('[BFF] - BFF 并行调用多个微服务 API（模拟内网调用）');
      console.log('[BFF] - BFF 聚合、计算、转换数据');
      console.log('='.repeat(60));
      
      const startTime = Date.now();

      // 🔥 关键：并行调用多个微服务（在真实场景中这些是内网调用，非常快）
      console.log('[BFF] 并行调用 3 个微服务 API...');
      const [allStudents, allClasses, ageGroups] = await Promise.all([
        this.fetchStudents(),           // 微服务 1: 学生服务
        this.fetchClasses(),            // 微服务 2: 班级服务
        this.getStudentsByAgeGroup(),   // 微服务 1 再次调用（可缓存优化）
      ]);

      console.log('[BFF] 所有微服务调用完成，开始数据聚合和计算...');

      // BFF 层进行数据聚合和计算
      const studentCount = (allStudents as any[]).length;
      const classCount = (allClasses as any[]).length;
      const averageAge = studentCount > 0
        ? (allStudents as any[]).reduce((sum, s) => sum + s.age, 0) / studentCount
        : 0;

      const result = {
        summary: {
          totalStudents: studentCount,
          totalClasses: classCount,
          averageAge: Math.round(averageAge * 10) / 10,
        },
        ageDistribution: {
          teenagers: ageGroups.teenagers.length,
          youngAdults: ageGroups.youngAdults.length,
          adults: ageGroups.adults.length,
        },
        recentStudents: (allStudents as any[]).slice(0, 5).map(s => ({
          id: s.id,
          name: s.name,
          age: s.age,
          grade: s.grade,
        })),
        // ✅ 修复：将 teacher_name 映射为 teacherName
        classes: (allClasses as any[]).map(c => ({
          id: c.id,
          name: c.name,
          grade: c.grade,
          teacherName: c.teacher_name || c.teacherName, // 兼容两种命名
        })),
      };

      const duration = Date.now() - startTime;
      
      console.log('='.repeat(60));
      console.log(`[BFF] ✅ 仪表板数据聚合完成！`);
      console.log(`[BFF] 总耗时: ${duration}ms`);
      console.log(`[BFF] 调用了 3 个微服务 API（并行执行）`);
      console.log(`[BFF] 前端只需要 1 次请求就获取了所有需要的数据`);
      console.log(`[BFF] 在真实的微服务架构中，这些调用发生在数据中心内网`);
      console.log(`[BFF] 内网延迟通常只有 1-5ms，而公网可能需要 50-100ms`);
      console.log('='.repeat(60));
      console.log('');

      return result;
    } catch (error) {
      console.error('[BFF] 仪表板数据聚合失败:', error);
      throw error;
    }
  }
}
