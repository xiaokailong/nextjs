import { InterviewQuestion, InterviewCategory } from '@/types/interview';

export interface CreateInterviewQuestionInput {
  title: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  content: string;
  answer: string;
}

export interface UpdateInterviewQuestionInput {
  title?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  content?: string;
  answer?: string;
}

export class D1InterviewStore {
  private db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  // ========== Categories ==========
  
  async getAllCategories(): Promise<InterviewCategory[]> {
    const result = await this.db
      .prepare('SELECT * FROM interview_categories ORDER BY id')
      .all<InterviewCategory>();
    return result.results || [];
  }

  async getCategoryById(id: string): Promise<InterviewCategory | null> {
    const result = await this.db
      .prepare('SELECT * FROM interview_categories WHERE id = ?')
      .bind(id)
      .first<InterviewCategory>();
    return result;
  }

  async updateCategoryCount(categoryId: string): Promise<void> {
    await this.db
      .prepare(`
        UPDATE interview_categories 
        SET count = (
          SELECT COUNT(*) FROM interview_questions WHERE category = ?
        ),
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
      .bind(categoryId, categoryId)
      .run();
  }

  // ========== Questions ==========

  async getAllQuestions(): Promise<InterviewQuestion[]> {
    const result = await this.db
      .prepare('SELECT * FROM interview_questions ORDER BY id DESC')
      .all();

    return (result.results || []).map(this.mapDbToQuestion);
  }

  async getQuestionsByCategory(category: string): Promise<InterviewQuestion[]> {
    const result = await this.db
      .prepare('SELECT * FROM interview_questions WHERE category = ? ORDER BY id DESC')
      .bind(category)
      .all();

    return (result.results || []).map(this.mapDbToQuestion);
  }

  async getQuestionById(id: number): Promise<InterviewQuestion | null> {
    const result = await this.db
      .prepare('SELECT * FROM interview_questions WHERE id = ?')
      .bind(id)
      .first();

    return result ? this.mapDbToQuestion(result) : null;
  }

  async createQuestion(input: CreateInterviewQuestionInput): Promise<InterviewQuestion> {
    const tagsJson = JSON.stringify(input.tags);
    
    const result = await this.db
      .prepare(`
        INSERT INTO interview_questions 
        (title, category, difficulty, tags, content, answer, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
        RETURNING *
      `)
      .bind(
        input.title,
        input.category,
        input.difficulty,
        tagsJson,
        input.content,
        input.answer
      )
      .first();

    if (!result) {
      throw new Error('Failed to create interview question');
    }

    // Update category count
    await this.updateCategoryCount(input.category);

    return this.mapDbToQuestion(result);
  }

  async updateQuestion(
    id: number,
    input: UpdateInterviewQuestionInput
  ): Promise<InterviewQuestion | null> {
    // Check if question exists
    const existing = await this.getQuestionById(id);
    if (!existing) {
      return null;
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (input.title !== undefined) {
      updates.push('title = ?');
      values.push(input.title);
    }
    if (input.category !== undefined) {
      updates.push('category = ?');
      values.push(input.category);
    }
    if (input.difficulty !== undefined) {
      updates.push('difficulty = ?');
      values.push(input.difficulty);
    }
    if (input.tags !== undefined) {
      updates.push('tags = ?');
      values.push(JSON.stringify(input.tags));
    }
    if (input.content !== undefined) {
      updates.push('content = ?');
      values.push(input.content);
    }
    if (input.answer !== undefined) {
      updates.push('answer = ?');
      values.push(input.answer);
    }

    if (updates.length === 0) {
      return existing;
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = await this.db
      .prepare(`UPDATE interview_questions SET ${updates.join(', ')} WHERE id = ? RETURNING *`)
      .bind(...values)
      .first();

    if (!result) {
      return null;
    }

    // Update category counts if category changed
    if (input.category && input.category !== existing.category) {
      await this.updateCategoryCount(existing.category);
      await this.updateCategoryCount(input.category);
    }

    return this.mapDbToQuestion(result);
  }

  async deleteQuestion(id: number): Promise<InterviewQuestion | null> {
    const question = await this.getQuestionById(id);
    if (!question) {
      return null;
    }

    await this.db
      .prepare('DELETE FROM interview_questions WHERE id = ?')
      .bind(id)
      .run();

    // Update category count
    await this.updateCategoryCount(question.category);

    return question;
  }

  async countQuestions(): Promise<number> {
    const result = await this.db
      .prepare('SELECT COUNT(*) as count FROM interview_questions')
      .first<{ count: number }>();
    return result?.count || 0;
  }

  async searchQuestions(query: string): Promise<InterviewQuestion[]> {
    const searchPattern = `%${query}%`;
    const result = await this.db
      .prepare(`
        SELECT * FROM interview_questions 
        WHERE title LIKE ? OR content LIKE ? OR tags LIKE ?
        ORDER BY id DESC
      `)
      .bind(searchPattern, searchPattern, searchPattern)
      .all();

    return (result.results || []).map(this.mapDbToQuestion);
  }

  // Helper method to convert DB record to InterviewQuestion
  private mapDbToQuestion(record: any): InterviewQuestion {
    return {
      id: String(record.id),
      title: record.title,
      category: record.category,
      difficulty: record.difficulty,
      tags: JSON.parse(record.tags),
      content: record.content,
      answer: record.answer,
    };
  }
}
