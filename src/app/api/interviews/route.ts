import { NextRequest, NextResponse } from 'next/server';
import { D1InterviewStore } from '@/lib/d1InterviewStore';
import { memoryInterviewStore } from '@/lib/mockDatabase';
import { setCorsHeaders, handleOptionsRequest } from '@/lib/cors';

/**
 * 本地开发环境：
 * - 因为使用 edge runtime，无法访问 fs 模块
 * - 会使用 interviewQuestions.ts 中的静态数据（15条，只读）
 * - 如需本地测试增删改功能，请临时注释掉下面的 runtime 配置
 * 
 * 生产环境（Cloudflare）：
 * - 检测到 INTERVIEW_DB 环境变量
 * - 使用真实的 D1 数据库
 * - 支持完整的增删改查
 */

export const runtime = 'edge';

// 处理 OPTIONS 预检请求
export async function OPTIONS(request: NextRequest) {
  return handleOptionsRequest(request.headers.get('origin'));
}

// GET /api/interviews - 获取所有面试题或按分类/搜索过滤
export async function GET(
  request: NextRequest,
  context?: { cloudflare?: { env?: any } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    // 从 Cloudflare context 中获取 INTERVIEW_DB
    const env = context?.cloudflare?.env || process.env as any;
    const INTERVIEW_DB = env?.INTERVIEW_DB;
    
    console.log('[Interview API] INTERVIEW_DB available:', !!INTERVIEW_DB);
    
    let questions;
    
    if (INTERVIEW_DB) {
      // Production: Use INTERVIEW_DB
      const store = new D1InterviewStore(INTERVIEW_DB);
      
      if (search) {
        questions = await store.searchQuestions(search);
      } else if (category && category !== 'all') {
        questions = await store.getQuestionsByCategory(category);
      } else {
        questions = await store.getAllQuestions();
      }
    } else {
      // Development: Use mock data
      if (search) {
        questions = await memoryInterviewStore.searchQuestions(search);
      } else if (category && category !== 'all') {
        questions = await memoryInterviewStore.getQuestionsByCategory(category);
      } else {
        questions = await memoryInterviewStore.getAllQuestions();
      }
    }
    
    const response = NextResponse.json(questions);
    return setCorsHeaders(response, request.headers.get('origin'));
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    const response = NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
    return setCorsHeaders(response, request.headers.get('origin'));
  }
}

// POST /api/interviews - 创建新面试题
export async function POST(
  request: NextRequest,
  context?: { cloudflare?: { env?: any } }
) {
  try {
    const body = await request.json() as any;
    const { title, category, difficulty, tags, content, answer } = body;
    
    // Validation
    if (!title || !category || !difficulty || !tags || !content || !answer) {
      const response = NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
      return setCorsHeaders(response, request.headers.get('origin'));
    }
    
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      const response = NextResponse.json(
        { error: 'Invalid difficulty level' },
        { status: 400 }
      );
      return setCorsHeaders(response, request.headers.get('origin'));
    }
    
    if (!Array.isArray(tags)) {
      const response = NextResponse.json(
        { error: 'Tags must be an array' },
        { status: 400 }
      );
      return setCorsHeaders(response, request.headers.get('origin'));
    }
    
    // 从 Cloudflare context 中获取 INTERVIEW_DB
    const env = context?.cloudflare?.env || process.env as any;
    const INTERVIEW_DB = env?.INTERVIEW_DB;
    
    console.log('[Interview API POST] INTERVIEW_DB available:', !!INTERVIEW_DB);
    
    let question;
    
    if (INTERVIEW_DB) {
      // Production: Use INTERVIEW_DB
      const store = new D1InterviewStore(INTERVIEW_DB);
      question = await store.createQuestion({
        title,
        category,
        difficulty,
        tags,
        content,
        answer,
      });
    } else {
      // Development: Use mock data
      question = await memoryInterviewStore.createQuestion({
        title,
        category,
        difficulty,
        tags,
        content,
        answer,
      });
    }
    
    const response = NextResponse.json(question, { status: 201 });
    return setCorsHeaders(response, request.headers.get('origin'));
  } catch (error) {
    console.error('Failed to create question:', error);
    const response = NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
    return setCorsHeaders(response, request.headers.get('origin'));
  }
}
