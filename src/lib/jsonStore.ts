// JSON 文件持久化存储
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

// 确保在服务器端运行
const isServer = typeof window === 'undefined';

interface DatabaseData {
  interviews: {
    questions: any[];
    categories: any[];
    nextId: number;
  };
  students: any[];
  classes: any[];
}

class JsonStore {
  private data: DatabaseData | null = null;
  private saveTimeout: NodeJS.Timeout | null = null;

  // 读取 JSON 文件
  private readData(): DatabaseData {
    if (!isServer) {
      throw new Error('JsonStore can only be used on the server side');
    }

    try {
      const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error('Failed to read database file:', error);
      // 返回默认数据结构
      return {
        interviews: {
          questions: [],
          categories: [],
          nextId: 1,
        },
        students: [],
        classes: [],
      };
    }
  }

  // 写入 JSON 文件（带防抖）
  private writeData(data: DatabaseData): void {
    if (!isServer) return;

    // 清除之前的保存任务
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    // 延迟保存，避免频繁写入
    this.saveTimeout = setTimeout(() => {
      try {
        const jsonContent = JSON.stringify(data, null, 2);
        fs.writeFileSync(DB_PATH, jsonContent, 'utf-8');
        console.log('[JsonStore] Data saved to', DB_PATH);
      } catch (error) {
        console.error('[JsonStore] Failed to write database file:', error);
      }
    }, 100); // 100ms 防抖
  }

  // 获取数据（带缓存）
  private getData(): DatabaseData {
    if (!this.data) {
      this.data = this.readData();
    }
    return this.data;
  }

  // 更新数据并保存
  private updateData(updater: (data: DatabaseData) => void): void {
    const data = this.getData();
    updater(data);
    this.data = data;
    this.writeData(data);
  }

  // ========== Interview Questions ==========

  getAllCategories(): any[] {
    return this.getData().interviews.categories;
  }

  getAllQuestions(): any[] {
    return this.getData().interviews.questions.map(q => ({
      ...q,
      id: String(q.id),
    }));
  }

  getQuestionsByCategory(category: string): any[] {
    return this.getData()
      .interviews.questions.filter(q => q.category === category)
      .map(q => ({ ...q, id: String(q.id) }));
  }

  getQuestionById(id: number): any | null {
    const question = this.getData().interviews.questions.find(q => q.id === id);
    return question ? { ...question, id: String(question.id) } : null;
  }

  createQuestion(data: any): any {
    let newQuestion: any = null;

    this.updateData(db => {
      const now = new Date().toISOString();
      newQuestion = {
        id: db.interviews.nextId++,
        title: data.title,
        category: data.category,
        difficulty: data.difficulty,
        tags: Array.isArray(data.tags) ? data.tags : [],
        content: data.content,
        answer: data.answer,
        createdAt: now,
        updatedAt: now,
      };
      db.interviews.questions.push(newQuestion);

      // Update category count
      const category = db.interviews.categories.find(c => c.id === data.category);
      if (category) {
        category.count++;
      }
    });

    return { ...newQuestion!, id: String(newQuestion!.id) };
  }

  updateQuestion(id: number, data: any): any | null {
    let updatedQuestion: any = null;

    this.updateData(db => {
      const idx = db.interviews.questions.findIndex(q => q.id === id);
      if (idx === -1) {
        return;
      }

      const oldCategory = db.interviews.questions[idx].category;
      const now = new Date().toISOString();

      // Ensure tags is always an array
      const updateData = { ...data };
      if (updateData.tags !== undefined) {
        updateData.tags = Array.isArray(updateData.tags) ? updateData.tags : [];
      }

      db.interviews.questions[idx] = {
        ...db.interviews.questions[idx],
        ...updateData,
        id: db.interviews.questions[idx].id, // Preserve the numeric id
        updatedAt: now,
      };

      updatedQuestion = db.interviews.questions[idx];

      // Update category counts if category changed
      if (data.category && data.category !== oldCategory) {
        const oldCat = db.interviews.categories.find(c => c.id === oldCategory);
        const newCat = db.interviews.categories.find(c => c.id === data.category);
        if (oldCat) oldCat.count--;
        if (newCat) newCat.count++;
      }
    });

    return updatedQuestion ? { ...updatedQuestion, id: String(updatedQuestion.id) } : null;
  }

  deleteQuestion(id: number): any | null {
    let deletedQuestion: any = null;

    this.updateData(db => {
      const idx = db.interviews.questions.findIndex(q => q.id === id);
      if (idx === -1) {
        return;
      }

      deletedQuestion = db.interviews.questions.splice(idx, 1)[0];

      // Update category count
      const category = db.interviews.categories.find(c => c.id === deletedQuestion.category);
      if (category) {
        category.count--;
      }
    });

    return deletedQuestion ? { ...deletedQuestion, id: String(deletedQuestion.id) } : null;
  }

  countQuestions(): number {
    return this.getData().interviews.questions.length;
  }

  searchQuestions(query: string): any[] {
    const lowerQuery = query.toLowerCase();
    return this.getData()
      .interviews.questions.filter(q =>
        q.title.toLowerCase().includes(lowerQuery) ||
        q.content.toLowerCase().includes(lowerQuery) ||
        q.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
      )
      .map(q => ({ ...q, id: String(q.id) }));
  }

  // ========== Students ==========

  getAllStudents(): any[] {
    return this.getData().students;
  }

  getStudentById(id: number): any | null {
    return this.getData().students.find(s => s.id === id) || null;
  }

  createStudent(data: any): any {
    let newStudent: any = null;

    this.updateData(db => {
      const now = new Date().toISOString();
      const nextId = db.students.length > 0 
        ? Math.max(...db.students.map(s => s.id)) + 1 
        : 1;
      
      newStudent = {
        id: nextId,
        name: data.name,
        age: data.age,
        grade: data.grade,
        email: data.email,
        createdAt: now,
        updatedAt: now,
      };
      db.students.push(newStudent);
    });

    return newStudent;
  }

  updateStudent(id: number, data: any): any | null {
    let updatedStudent: any = null;

    this.updateData(db => {
      const idx = db.students.findIndex(s => s.id === id);
      if (idx === -1) {
        return;
      }

      const now = new Date().toISOString();
      db.students[idx] = {
        ...db.students[idx],
        ...data,
        id: db.students[idx].id,
        updatedAt: now,
      };

      updatedStudent = db.students[idx];
    });

    return updatedStudent;
  }

  deleteStudent(id: number): any | null {
    let deletedStudent: any = null;

    this.updateData(db => {
      const idx = db.students.findIndex(s => s.id === id);
      if (idx === -1) {
        return;
      }

      deletedStudent = db.students.splice(idx, 1)[0];
    });

    return deletedStudent;
  }

  countStudents(): number {
    return this.getData().students.length;
  }

  // ========== Classes ==========

  getAllClasses(): any[] {
    return this.getData().classes;
  }

  getClassById(id: number): any | null {
    return this.getData().classes.find(c => c.id === id) || null;
  }

  createClass(data: any): any {
    let newClass: any = null;

    this.updateData(db => {
      const now = new Date().toISOString();
      const nextId = db.classes.length > 0 
        ? Math.max(...db.classes.map(c => c.id)) + 1 
        : 1;
      
      newClass = {
        id: nextId,
        name: data.name,
        grade: data.grade,
        teacherName: data.teacherName,
        createdAt: now,
        updatedAt: now,
      };
      db.classes.push(newClass);
    });

    return newClass;
  }

  updateClass(id: number, data: any): any | null {
    let updatedClass: any = null;

    this.updateData(db => {
      const idx = db.classes.findIndex(c => c.id === id);
      if (idx === -1) {
        return;
      }

      const now = new Date().toISOString();
      db.classes[idx] = {
        ...db.classes[idx],
        ...data,
        id: db.classes[idx].id,
        updatedAt: now,
      };

      updatedClass = db.classes[idx];
    });

    return updatedClass;
  }

  deleteClass(id: number): any | null {
    let deletedClass: any = null;

    this.updateData(db => {
      const idx = db.classes.findIndex(c => c.id === id);
      if (idx === -1) {
        return;
      }

      deletedClass = db.classes.splice(idx, 1)[0];
    });

    return deletedClass;
  }

  countClasses(): number {
    return this.getData().classes.length;
  }
}

// 单例
export const jsonStore = new JsonStore();
