import { Student, CreateStudentInput, UpdateStudentInput } from '@/types/student';

export class D1StudentStore {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  async getAll(): Promise<Student[]> {
    const result = await this.db
      .prepare('SELECT * FROM students ORDER BY id DESC')
      .all<Student>();
    return result.results || [];
  }

  async getById(id: number): Promise<Student | null> {
    const result = await this.db
      .prepare('SELECT * FROM students WHERE id = ?')
      .bind(id)
      .first<Student>();
    return result;
  }

  async create(input: CreateStudentInput): Promise<Student> {
    const now = new Date().toISOString();
    const result = await this.db
      .prepare(
        'INSERT INTO students (name, age, grade, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?) RETURNING *'
      )
      .bind(input.name, input.age, input.grade, input.email || null, now, now)
      .first<Student>();
    
    if (!result) {
      throw new Error('Failed to create student');
    }
    return result;
  }

  async update(id: number, input: UpdateStudentInput): Promise<Student | null> {
    // 先检查学生是否存在
    const existing = await this.getById(id);
    if (!existing) {
      return null;
    }

    const now = new Date().toISOString();
    const updates: string[] = [];
    const values: any[] = [];

    if (input.name !== undefined) {
      updates.push('name = ?');
      values.push(input.name);
    }
    if (input.age !== undefined) {
      updates.push('age = ?');
      values.push(input.age);
    }
    if (input.grade !== undefined) {
      updates.push('grade = ?');
      values.push(input.grade);
    }
    if (input.email !== undefined) {
      updates.push('email = ?');
      values.push(input.email);
    }
    
    updates.push('updated_at = ?');
    values.push(now);
    values.push(id);

    const result = await this.db
      .prepare(
        `UPDATE students SET ${updates.join(', ')} WHERE id = ? RETURNING *`
      )
      .bind(...values)
      .first<Student>();

    return result;
  }

  async delete(id: number): Promise<Student | null> {
    // 先获取要删除的学生
    const student = await this.getById(id);
    if (!student) {
      return null;
    }

    await this.db
      .prepare('DELETE FROM students WHERE id = ?')
      .bind(id)
      .run();

    return student;
  }

  async count(): Promise<number> {
    const result = await this.db
      .prepare('SELECT COUNT(*) as count FROM students')
      .first<{ count: number }>();
    return result?.count || 0;
  }
}
