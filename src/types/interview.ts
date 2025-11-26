// 面试题类型定义
export interface InterviewQuestion {
  id: string;
  title: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  content: string;
  answer: string;
}

export interface InterviewCategory {
  id: string;
  name: string;
  icon?: string;
  count: number;
}
