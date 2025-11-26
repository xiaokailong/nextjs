import { NextRequest, NextResponse } from 'next/server';
import { D1InterviewStore } from '@/lib/d1InterviewStore';
import { memoryInterviewStore } from '@/lib/mockDatabase';

// GET /api/interviews/categories - 获取所有分类
export async function GET(request: NextRequest) {
  try {
    // @ts-ignore
    const env = request.env || process.env as any;

    if (env?.INTERVIEW_DB) {
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

// Note: 不使用 edge runtime，以便本地开发时可以使用 fs 模块读取 db.json
// 部署到 Cloudflare 时会自动使用 Workers 环境
