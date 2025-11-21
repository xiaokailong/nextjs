import { Student } from './student';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  total?: number;
}

export interface StudentsListResponse extends ApiResponse<Student[]> {
  total: number;
}
