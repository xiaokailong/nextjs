import { Class, CreateClassInput, UpdateClassInput } from '@/types/class';

export class D1ClassStore {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  async getAll(): Promise<Class[]> {
    const result = await this.db
      .prepare('SELECT * FROM classes ORDER BY grade, name')
      .all<Class>();
    return result.results || [];
  }

  async getById(id: number): Promise<Class | null> {
    const result = await this.db
      .prepare('SELECT * FROM classes WHERE id = ?')
      .bind(id)
      .first<Class>();
    return result;
  }

  async create(input: CreateClassInput): Promise<Class> {
    const now = new Date().toISOString();
    const result = await this.db
      .prepare(
        'INSERT INTO classes (name, grade, teacher_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?) RETURNING *'
      )
      .bind(input.name, input.grade, input.teacherName, now, now)
      .first<Class>();
    
    if (!result) {
      throw new Error('Failed to create class');
    }
    return result;
  }

  async update(id: number, input: UpdateClassInput): Promise<Class | null> {
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
    if (input.grade !== undefined) {
      updates.push('grade = ?');
      values.push(input.grade);
    }
    if (input.teacherName !== undefined) {
      updates.push('teacher_name = ?');
      values.push(input.teacherName);
    }
    
    updates.push('updated_at = ?');
    values.push(now);
    values.push(id);

    const result = await this.db
      .prepare(
        `UPDATE classes SET ${updates.join(', ')} WHERE id = ? RETURNING *`
      )
      .bind(...values)
      .first<Class>();

    return result;
  }

  async delete(id: number): Promise<Class | null> {
    const classData = await this.getById(id);
    if (!classData) {
      return null;
    }

    await this.db
      .prepare('DELETE FROM classes WHERE id = ?')
      .bind(id)
      .run();

    return classData;
  }
}
