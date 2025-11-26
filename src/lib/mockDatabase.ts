// 数据库工具 - 本地开发和生产环境适配
import { Student } from '@/types/student';
import { Class } from '@/types/class';
import { jsonStore } from './jsonStore';

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
    return jsonStore.getAllStudents();
  }

  async getById(id: number): Promise<Student | null> {
    return jsonStore.getStudentById(id);
  }

  async create(data: any): Promise<Student> {
    return jsonStore.createStudent(data);
  }

  async update(id: number, data: any): Promise<Student | null> {
    return jsonStore.updateStudent(id, data);
  }

  async delete(id: number): Promise<Student | null> {
    return jsonStore.deleteStudent(id);
  }

  async count(): Promise<number> {
    return jsonStore.countStudents();
  }
}

class MemoryClassStore {
  // 使用 JSON 文件存储，所有方法都委托给 jsonStore

  async getAll(): Promise<Class[]> {
    return jsonStore.getAllClasses();
  }

  async getById(id: number): Promise<Class | null> {
    return jsonStore.getClassById(id);
  }

  async create(data: any): Promise<Class> {
    return jsonStore.createClass(data);
  }

  async update(id: number, data: any): Promise<Class | null> {
    return jsonStore.updateClass(id, data);
  }

  async delete(id: number): Promise<Class | null> {
    return jsonStore.deleteClass(id);
  }

  async count(): Promise<number> {
    return jsonStore.countClasses();
  }
}

class MemoryInterviewStore {
  // 使用 JSON 文件存储，所有方法都委托给 jsonStore
  
  async getAllCategories(): Promise<any[]> {
    return jsonStore.getAllCategories();
  }

  async getAllQuestions(): Promise<any[]> {
    return jsonStore.getAllQuestions();
  }

  async getQuestionsByCategory(category: string): Promise<any[]> {
    return jsonStore.getQuestionsByCategory(category);
  }

  async getQuestionById(id: number): Promise<any | null> {
    return jsonStore.getQuestionById(id);
  }

  async createQuestion(data: any): Promise<any> {
    return jsonStore.createQuestion(data);
  }

  async updateQuestion(id: number, data: any): Promise<any | null> {
    return jsonStore.updateQuestion(id, data);
  }

  async deleteQuestion(id: number): Promise<any | null> {
    return jsonStore.deleteQuestion(id);
  }

  async countQuestions(): Promise<number> {
    return jsonStore.countQuestions();
  }

  async searchQuestions(query: string): Promise<any[]> {
    return jsonStore.searchQuestions(query);
  }
}

// 单例
export const memoryStudentStore = new MemoryStudentStore();
export const memoryClassStore = new MemoryClassStore();
export const memoryInterviewStore = new MemoryInterviewStore();
