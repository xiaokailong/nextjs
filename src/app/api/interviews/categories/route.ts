import { NextRequest, NextResponse } from 'next/server';
import { D1InterviewStore } from '@/lib/d1InterviewStore';
import { memoryInterviewStore } from '@/lib/mockDatabase';

// GET /api/interviews/categories - 获取所有分类
export async function GET(request: NextRequest) {
  try {
    // @ts-ignore - Cloudflare 特定属性
    const INTERVIEW_DB = process.env.INTERVIEW_DB || (typeof globalThis !== 'undefined' && (globalThis as any).INTERVIEW_DB);

    console.log('[Categories API] INTERVIEW_DB available:', !!INTERVIEW_DB);

    if (INTERVIEW_DB) {
      // Production: Use INTERVIEW_DB
      const store = new D1InterviewStore(INTERVIEW_DB);
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

export const runtime = 'edge';
