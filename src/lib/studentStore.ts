import { Student } from '@/types/student';

// 内存数据存储（开发调试用，重启后数据会丢失）
// 生产环境应替换为数据库（如 Prisma + SQLite/PostgreSQL）
class StudentStore {
  private students: Student[] = [
    {
      id: 1,
      name: '张三',
      age: 18,
      grade: '高一',
      email: 'zhangsan@example.com',
      createdAt: new Date('2024-01-15'),
    },
    {
      id: 2,
      name: '李四',
      age: 17,
      grade: '高一',
      email: 'lisi@example.com',
      createdAt: new Date('2024-02-20'),
    },
    {
      id: 3,
      name: '王五',
      age: 19,
      grade: '高二',
      createdAt: new Date('2024-03-10'),
    },
  ];

  private nextId = 4;

  getAll(): Student[] {
    return this.students;
  }

  getById(id: number): Student | undefined {
    return this.students.find((s) => s.id === id);
  }

  create(data: Omit<Student, 'id' | 'createdAt'>): Student {
    const newStudent: Student = {
      id: this.nextId++,
      ...data,
      createdAt: new Date(),
    };
    this.students.push(newStudent);
    return newStudent;
  }

  update(id: number, data: Partial<Omit<Student, 'id' | 'createdAt'>>): Student | null {
    const idx = this.students.findIndex((s) => s.id === id);
    if (idx === -1) return null;

    this.students[idx] = {
      ...this.students[idx],
      ...data,
    };
    return this.students[idx];
  }

  delete(id: number): Student | null {
    const idx = this.students.findIndex((s) => s.id === id);
    if (idx === -1) return null;

    const deleted = this.students.splice(idx, 1)[0];
    return deleted;
  }

  count(): number {
    return this.students.length;
  }
}

// 单例模式，确保整个应用共享同一份数据
export const studentStore = new StudentStore();
