// Interview API 客户端
// 支持本地 mock 数据和远程生产 API 切换

import { getAPIPath } from '@/config/api.config';

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
  count: number;
}

export const interviewAPI = {
  // 获取所有分类
  async getCategories(): Promise<InterviewCategory[]> {
    const response = await fetch(getAPIPath('/api/interviews/categories'));
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  // 获取所有面试题
  async getQuestions(params?: { category?: string; search?: string }): Promise<InterviewQuestion[]> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.set('category', params.category);
    if (params?.search) queryParams.set('search', params.search);
    
    const url = getAPIPath(`/api/interviews${queryParams.toString() ? '?' + queryParams.toString() : ''}`);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch questions');
    return response.json();
  },

  // 获取单个面试题
  async getQuestion(id: string): Promise<InterviewQuestion> {
    const response = await fetch(getAPIPath(`/api/interviews/${id}`));
    if (!response.ok) throw new Error('Failed to fetch question');
    return response.json();
  },

  // 创建面试题
  async createQuestion(data: Omit<InterviewQuestion, 'id'>): Promise<InterviewQuestion> {
    const response = await fetch(getAPIPath('/api/interviews'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create question');
    return response.json();
  },

  // 更新面试题
  async updateQuestion(id: string, data: Partial<Omit<InterviewQuestion, 'id'>>): Promise<InterviewQuestion> {
    const response = await fetch(getAPIPath(`/api/interviews/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update question');
    return response.json();
  },

  // 删除面试题
  async deleteQuestion(id: string): Promise<void> {
    const response = await fetch(getAPIPath(`/api/interviews/${id}`), {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete question');
  },
};
