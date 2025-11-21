// 数据库工具 - 本地开发和生产环境适配
import { Student } from '@/types/student';
import { Class } from '@/types/class';

// 检查是否在 Edge Runtime 环境且有 D1 绑定
export function hasD1Database(): boolean {
  if (typeof process === 'undefined') return false;
  const env = process.env as any;
  return env.DB !== undefined && env.DB !== null;
}

// 内存存储（本地开发用）
class MemoryStudentStore {
  private students: Student[] = [
    {
      id: 1,
      name: '张三',
      age: 18,
      grade: '高三',
      email: 'zhangsan@example.com',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
    },
    {
      id: 2,
      name: '李四',
      age: 17,
      grade: '高二',
      email: 'lisi@example.com',
      createdAt: '2024-02-20',
      updatedAt: '2024-02-20',
    },
    {
      id: 3,
      name: '王五',
      age: 16,
      grade: '高一',
      email: 'wangwu@example.com',
      createdAt: '2024-03-10',
      updatedAt: '2024-03-10',
    },
  ];
  private nextId = 4;

  async getAll(): Promise<Student[]> {
    return this.students;
  }

  async getById(id: number): Promise<Student | null> {
    return this.students.find((s) => s.id === id) || null;
  }

  async create(data: any): Promise<Student> {
    const now = new Date().toISOString();
    const newStudent: Student = {
      id: this.nextId++,
      name: data.name,
      age: data.age,
      grade: data.grade,
      email: data.email,
      createdAt: now,
      updatedAt: now,
    };
    this.students.push(newStudent);
    return newStudent;
  }

  async update(id: number, data: any): Promise<Student | null> {
    const idx = this.students.findIndex((s) => s.id === id);
    if (idx === -1) return null;

    const now = new Date().toISOString();
    this.students[idx] = {
      ...this.students[idx],
      ...data,
      updatedAt: now,
    };
    return this.students[idx];
  }

  async delete(id: number): Promise<Student | null> {
    const idx = this.students.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    const deleted = this.students.splice(idx, 1)[0];
    return deleted;
  }

  async count(): Promise<number> {
    return this.students.length;
  }
}

class MemoryClassStore {
  private classes: Class[] = [
    {
      id: 1,
      name: '一班',
      grade: '高三',
      teacherName: '王老师',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: 2,
      name: '二班',
      grade: '高二',
      teacherName: '李老师',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ];
  private nextId = 3;

  async getAll(): Promise<Class[]> {
    return this.classes;
  }

  async getById(id: number): Promise<Class | null> {
    return this.classes.find((c) => c.id === id) || null;
  }

  async create(data: any): Promise<Class> {
    const now = new Date().toISOString();
    const newClass: Class = {
      id: this.nextId++,
      name: data.name,
      grade: data.grade,
      teacherName: data.teacherName,
      createdAt: now,
      updatedAt: now,
    };
    this.classes.push(newClass);
    return newClass;
  }

  async update(id: number, data: any): Promise<Class | null> {
    const idx = this.classes.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    const now = new Date().toISOString();
    this.classes[idx] = {
      ...this.classes[idx],
      ...data,
      updatedAt: now,
    };
    return this.classes[idx];
  }

  async delete(id: number): Promise<Class | null> {
    const idx = this.classes.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    const deleted = this.classes.splice(idx, 1)[0];
    return deleted;
  }
}

// 单例
export const memoryStudentStore = new MemoryStudentStore();
export const memoryClassStore = new MemoryClassStore();
