import { NextRequest, NextResponse } from 'next/server';
import { D1InterviewStore } from '@/lib/d1InterviewStore';
import { memoryInterviewStore } from '@/lib/mockDatabase';
import { setCorsHeaders, handleOptionsRequest } from '@/lib/cors';

/**
 * 本地开发环境：
 * - 使用 Node.js runtime 时会读取 JSON 文件
 * - 使用 Edge runtime 时必须配置 D1 数据库
 * 
 * 生产环境（Cloudflare）：
 * - 必须在 Cloudflare Pages 控制台配置 INTERVIEW_DB 绑定
 * - 使用真实的 D1 数据库
 * - 支持完整的增删改查
 */

export const runtime = 'edge';

// 处理 OPTIONS 预检请求
export async function OPTIONS(request: NextRequest) {
  return handleOptionsRequest(request.headers.get('origin'));
}

// GET /api/interviews - 获取所有面试题或按分类/搜索过滤
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    const env = process.env as any;
    const hasD1 = env.INTERVIEW_DB !== undefined;
    
    let questions;
    
    if (hasD1) {
      // Production: Use INTERVIEW_DB
      const store = new D1InterviewStore(env.INTERVIEW_DB);
      
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
export async function POST(request: NextRequest) {
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
    
    const env = process.env as any;
    const hasD1 = env.INTERVIEW_DB !== undefined;
    
    let question;
    
    if (hasD1) {
      // Production: Use INTERVIEW_DB
      const store = new D1InterviewStore(env.INTERVIEW_DB);
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
