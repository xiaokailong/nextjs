// 班级类型定义
export interface Class {
  id: number;
  name: string;
  grade: string;
  teacherName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassInput {
  name: string;
  grade: string;
  teacherName: string;
}

export interface UpdateClassInput {
  name?: string;
  grade?: string;
  teacherName?: string;
}

// BFF 聚合数据类型
export interface ClassWithStats {
  id: number;
  name: string;
  grade: string;
  teacherName: string;
  studentCount: number;
  averageAge: number;
  students: Array<{
    id: number;
    name: string;
    age: number;
    email?: string;
  }>;
}
