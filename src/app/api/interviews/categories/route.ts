import { NextRequest, NextResponse } from 'next/server';
import { D1InterviewStore } from '@/lib/d1InterviewStore';
import { memoryInterviewStore } from '@/lib/mockDatabase';
import { setCorsHeaders, handleOptionsRequest } from '@/lib/cors';

export const runtime = 'edge';

// 处理 OPTIONS 预检请求
export async function OPTIONS(request: NextRequest) {
  return handleOptionsRequest(request.headers.get('origin'));
}

// GET /api/interviews/categories - 获取所有分类
export async function GET(
  request: NextRequest,
  context?: { cloudflare?: { env?: any } }
) {
  try {
    // 从 Cloudflare context 中获取 INTERVIEW_DB
    const env = context?.cloudflare?.env || process.env as any;
    const INTERVIEW_DB = env?.INTERVIEW_DB;

    console.log('[Categories API] INTERVIEW_DB available:', !!INTERVIEW_DB);

    let categories;

    if (INTERVIEW_DB) {
      // Production: Use INTERVIEW_DB
      const store = new D1InterviewStore(INTERVIEW_DB);
      categories = await store.getAllCategories();
    } else {
      // Development: Use mock data
      categories = await memoryInterviewStore.getAllCategories();
    }

    const response = NextResponse.json(categories);
    return setCorsHeaders(response, request.headers.get('origin'));
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    const response = NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
    return setCorsHeaders(response, request.headers.get('origin'));
  }
}
