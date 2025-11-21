export interface Student {
  id: number;
  name: string;
  age: number;
  grade: string;
  email?: string;
  createdAt: Date;
}

export type CreateStudentInput = Omit<Student, 'id' | 'createdAt'>;
export type UpdateStudentInput = Partial<CreateStudentInput>;
