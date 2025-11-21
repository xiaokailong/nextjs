export interface Student {
  id: number;
  name: string;
  age: number;
  grade: string;
  email?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export type CreateStudentInput = Omit<Student, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateStudentInput = Partial<CreateStudentInput>;
