// BFF 服务层 - 业务逻辑和数据聚合
import { D1StudentStore } from './d1StudentStore';
import { D1ClassStore } from './d1ClassStore';
import { memoryStudentStore, memoryClassStore, hasD1Database } from './mockDatabase';
import { ClassWithStats } from '@/types/class';
import { Student } from '@/types/student';

export class BFFService {
  private studentStore: D1StudentStore | typeof memoryStudentStore;
  private classStore: D1ClassStore | typeof memoryClassStore;
  private useD1: boolean;

  constructor(db?: D1Database) {
    this.useD1 = db !== undefined && hasD1Database();
    
    if (this.useD1 && db) {
      this.studentStore = new D1StudentStore(db);
      this.classStore = new D1ClassStore(db);
    } else {
      // 本地开发使用内存数据
      this.studentStore = memoryStudentStore;
      this.classStore = memoryClassStore;
    }
  }

  /**
   * 获取班级详细信息（包含学生统计）
   * 这是典型的 BFF 数据聚合场景
   */
  async getClassWithStats(classId: number): Promise<ClassWithStats | null> {
    const classData = await this.classStore.getById(classId);
    if (!classData) {
      return null;
    }

    // 获取该班级的所有学生
    const students = await this.getStudentsByClass(classId);

    // 计算统计信息
    const studentCount = students.length;
    const averageAge = studentCount > 0
      ? students.reduce((sum, s) => sum + s.age, 0) / studentCount
      : 0;

    return {
      id: classData.id,
      name: classData.name,
      grade: classData.grade,
      teacherName: classData.teacherName,
      studentCount,
      averageAge: Math.round(averageAge * 10) / 10,
      students: students.map(s => ({
        id: s.id,
        name: s.name,
        age: s.age,
        email: s.email,
      })),
    };
  }

  /**
   * 获取所有班级的统计概览
   * BFF 层聚合多个数据源
   */
  async getAllClassesWithStats(): Promise<ClassWithStats[]> {
    const classes = await this.classStore.getAll();
    
    const classesWithStats = await Promise.all(
      classes.map(async (classData) => {
        const stats = await this.getClassWithStats(classData.id);
        return stats!;
      })
    );

    return classesWithStats;
  }

  /**
   * 获取班级的学生列表
   */
  private async getStudentsByClass(classId: number): Promise<Student[]> {
    if (!this.useD1) {
      // 本地开发环境，模拟数据
      const allStudents = await this.studentStore.getAll();
      // 简单模拟：班级 1 有学生 1,3，班级 2 有学生 2
      if (classId === 1) {
        return allStudents.filter(s => s.id === 1 || s.id === 3);
      } else if (classId === 2) {
        return allStudents.filter(s => s.id === 2);
      }
      return [];
    }
    
    // 使用原始 SQL 查询（因为 studentStore 没有按班级查询的方法）
    const db = (this.studentStore as D1StudentStore)['db'];
    const result = await db
      .prepare('SELECT * FROM students WHERE class_id = ? ORDER BY name')
      .bind(classId)
      .all<Student>();
    
    return result.results || [];
  }

  /**
   * 数据转换示例：按年龄分组学生
   * BFF 层为前端优化数据格式
   */
  async getStudentsByAgeGroup(): Promise<{
    teenagers: Student[];    // 13-15岁
    youngAdults: Student[];  // 16-18岁
    adults: Student[];       // 19岁以上
  }> {
    const allStudents = await this.studentStore.getAll();
    
    return {
      teenagers: allStudents.filter(s => s.age >= 13 && s.age <= 15),
      youngAdults: allStudents.filter(s => s.age >= 16 && s.age <= 18),
      adults: allStudents.filter(s => s.age >= 19),
    };
  }

  /**
   * 仪表板数据聚合
   * BFF 层一次请求获取多个数据，减少前端请求次数
   */
  async getDashboardData() {
    const [allStudents, allClasses, ageGroups] = await Promise.all([
      this.studentStore.getAll(),
      this.classStore.getAll(),
      this.getStudentsByAgeGroup(),
    ]);

    const studentCount = await this.studentStore.count();
    const classCount = allClasses.length;
    const averageAge = allStudents.length > 0
      ? allStudents.reduce((sum, s) => sum + s.age, 0) / allStudents.length
      : 0;

    return {
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
      recentStudents: allStudents.slice(0, 5), // 最近5个学生
      classes: allClasses,
    };
  }
}
