import { NextResponse } from 'next/server';
import { D1InterviewStore } from '@/lib/d1InterviewStore';
import { memoryInterviewStore } from '@/lib/mockDatabase';

// GET /api/interviews/categories - 获取所有分类
export async function GET() {
  try {
    const env = process.env as any;

    if (env.INTERVIEW_DB) {
      // Production: Use INTERVIEW_DB
      const store = new D1InterviewStore(env.INTERVIEW_DB);
      const categories = await store.getAllCategories();
      return NextResponse.json(categories);
    } else {
      // Development: Use mock data
      const categories = await memoryInterviewStore.getAllCategories();
      return NextResponse.json(categories);
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
