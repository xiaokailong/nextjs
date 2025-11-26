// 数据库工具 - 本地开发和生产环境适配
import { Student } from '@/types/student';
import { Class } from '@/types/class';
import { interviewQuestions, interviewCategories } from '@/data/interviewQuestions';

// 在服务器端导入 jsonStore
// 注意：Edge Runtime 中无法使用 fs 模块，所以会降级到 interviewQuestions
let jsonStore: any = null;
if (typeof window === 'undefined') {
  try {
    // 检测是否在 Edge Runtime 中（没有 process.version）
    // @ts-ignore
    if (typeof process !== 'undefined' && process.version) {
      // Node.js runtime - 可以使用 fs
      jsonStore = require('./jsonStore').jsonStore;
      console.log('[MockDatabase] jsonStore loaded successfully (Node.js runtime)');
    } else {
      console.log('[MockDatabase] Edge runtime detected, using in-memory data');
    }
  } catch (e) {
    console.warn('[MockDatabase] Failed to load jsonStore:', e);
    console.warn('[MockDatabase] Will use in-memory data as fallback');
  }
}

// 检查是否在 Edge Runtime 环境且有 D1 绑定
export function hasD1Database(): boolean {
  if (typeof process === 'undefined') return false;
  const env = process.env as any;
  return env.DB !== undefined && env.DB !== null;
}

// 内存存储（本地开发用）
class MemoryStudentStore {
  // 使用 JSON 文件存储，所有方法都委托给 jsonStore

  async getAll(): Promise<Student[]> {
    if (!jsonStore) return [];
    return jsonStore.getAllStudents();
  }

  async getById(id: number): Promise<Student | null> {
    if (!jsonStore) return null;
    return jsonStore.getStudentById(id);
  }

  async create(data: any): Promise<Student> {
    if (!jsonStore) throw new Error('JSON store not available');
    return jsonStore.createStudent(data);
  }

  async update(id: number, data: any): Promise<Student | null> {
    if (!jsonStore) return null;
    return jsonStore.updateStudent(id, data);
  }

  async delete(id: number): Promise<Student | null> {
    if (!jsonStore) return null;
    return jsonStore.deleteStudent(id);
  }

  async count(): Promise<number> {
    if (!jsonStore) return 0;
    return jsonStore.countStudents();
  }
}

class MemoryClassStore {
  // 使用 JSON 文件存储，所有方法都委托给 jsonStore

  async getAll(): Promise<Class[]> {
    if (!jsonStore) return [];
    return jsonStore.getAllClasses();
  }

  async getById(id: number): Promise<Class | null> {
    if (!jsonStore) return null;
    return jsonStore.getClassById(id);
  }

  async create(data: any): Promise<Class> {
    if (!jsonStore) throw new Error('JSON store not available');
    return jsonStore.createClass(data);
  }

  async update(id: number, data: any): Promise<Class | null> {
    if (!jsonStore) return null;
    return jsonStore.updateClass(id, data);
  }

  async delete(id: number): Promise<Class | null> {
    if (!jsonStore) return null;
    return jsonStore.deleteClass(id);
  }

  async count(): Promise<number> {
    if (!jsonStore) return 0;
    return jsonStore.countClasses();
  }
}

class MemoryInterviewStore {
  // 使用 JSON 文件存储，所有方法都委托给 jsonStore
  // 如果 jsonStore 不可用，使用内存中的 interviewQuestions 数据
  
  async getAllCategories(): Promise<any[]> {
    if (!jsonStore) {
      console.log('[MemoryInterviewStore] Using in-memory categories');
      return interviewCategories;
    }
    return jsonStore.getAllCategories();
  }

  async getAllQuestions(): Promise<any[]> {
    if (!jsonStore) {
      console.log('[MemoryInterviewStore] Using in-memory questions');
      return interviewQuestions;
    }
    return jsonStore.getAllQuestions();
  }

  async getQuestionsByCategory(category: string): Promise<any[]> {
    if (!jsonStore) {
      if (category === 'all') return interviewQuestions;
      return interviewQuestions.filter(q => q.category === category);
    }
    return jsonStore.getQuestionsByCategory(category);
  }

  async getQuestionById(id: number): Promise<any | null> {
    if (!jsonStore) {
      return interviewQuestions.find(q => q.id === String(id)) || null;
    }
    return jsonStore.getQuestionById(id);
  }

  async createQuestion(data: any): Promise<any> {
    if (!jsonStore) throw new Error('JSON store not available - cannot create in read-only mode');
    return jsonStore.createQuestion(data);
  }

  async updateQuestion(id: number, data: any): Promise<any | null> {
    if (!jsonStore) throw new Error('JSON store not available - cannot update in read-only mode');
    return jsonStore.updateQuestion(id, data);
  }

  async deleteQuestion(id: number): Promise<any | null> {
    if (!jsonStore) throw new Error('JSON store not available - cannot delete in read-only mode');
    return jsonStore.deleteQuestion(id);
  }

  async countQuestions(): Promise<number> {
    if (!jsonStore) return interviewQuestions.length;
    return jsonStore.countQuestions();
  }

  async searchQuestions(query: string): Promise<any[]> {
    if (!jsonStore) {
      const lowerQuery = query.toLowerCase();
      return interviewQuestions.filter(q =>
        q.title.toLowerCase().includes(lowerQuery) ||
        q.content.toLowerCase().includes(lowerQuery) ||
        q.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }
    return jsonStore.searchQuestions(query);
  }
}

// 单例
export const memoryStudentStore = new MemoryStudentStore();
export const memoryClassStore = new MemoryClassStore();
export const memoryInterviewStore = new MemoryInterviewStore();
