import { NextRequest, NextResponse } from 'next/server';
import { D1InterviewStore } from '@/lib/d1InterviewStore';
import { memoryInterviewStore } from '@/lib/mockDatabase';

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

// GET /api/interviews - 获取所有面试题或按分类/搜索过滤
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    // Cloudflare 绑定访问：尝试多种方式
    // @ts-ignore
    let INTERVIEW_DB = null;
    
    // 方式1: 直接从 process.env
    if (process.env.INTERVIEW_DB) {
      INTERVIEW_DB = process.env.INTERVIEW_DB;
      console.log('[Interview API] ✅ Found INTERVIEW_DB via process.env');
    }
    
    // 方式2: 从 globalThis
    // @ts-ignore
    if (!INTERVIEW_DB && typeof globalThis !== 'undefined' && globalThis.INTERVIEW_DB) {
      // @ts-ignore
      INTERVIEW_DB = globalThis.INTERVIEW_DB;
      console.log('[Interview API] ✅ Found INTERVIEW_DB via globalThis');
    }
    
    console.log('[Interview API] INTERVIEW_DB type:', typeof INTERVIEW_DB);
    console.log('[Interview API] INTERVIEW_DB available:', !!INTERVIEW_DB);
    console.log('[Interview API] NODE_ENV:', process.env.NODE_ENV);
    
    if (INTERVIEW_DB) {
      // Production: Use INTERVIEW_DB
      const store = new D1InterviewStore(INTERVIEW_DB);
      
      if (search) {
        const questions = await store.searchQuestions(search);
        return NextResponse.json(questions);
      } else if (category && category !== 'all') {
        const questions = await store.getQuestionsByCategory(category);
        return NextResponse.json(questions);
      } else {
        const questions = await store.getAllQuestions();
        return NextResponse.json(questions);
      }
    } else {
      // Development: Use mock data
      if (search) {
        const questions = await memoryInterviewStore.searchQuestions(search);
        return NextResponse.json(questions);
      } else if (category && category !== 'all') {
        const questions = await memoryInterviewStore.getQuestionsByCategory(category);
        return NextResponse.json(questions);
      } else {
        const questions = await memoryInterviewStore.getAllQuestions();
        return NextResponse.json(questions);
      }
    }
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

// POST /api/interviews - 创建新面试题
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as any;
    const { title, category, difficulty, tags, content, answer } = body;
    
    // Validation
    if (!title || !category || !difficulty || !tags || !content || !answer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return NextResponse.json(
        { error: 'Invalid difficulty level' },
        { status: 400 }
      );
    }
    
    if (!Array.isArray(tags)) {
      return NextResponse.json(
        { error: 'Tags must be an array' },
        { status: 400 }
      );
    }
    
    // @ts-ignore
    let INTERVIEW_DB = null;
    
    if (process.env.INTERVIEW_DB) {
      INTERVIEW_DB = process.env.INTERVIEW_DB;
      console.log('[Interview API POST] ✅ Found INTERVIEW_DB via process.env');
    }
    
    // @ts-ignore
    if (!INTERVIEW_DB && typeof globalThis !== 'undefined' && globalThis.INTERVIEW_DB) {
      // @ts-ignore
      INTERVIEW_DB = globalThis.INTERVIEW_DB;
      console.log('[Interview API POST] ✅ Found INTERVIEW_DB via globalThis');
    }
    
    console.log('[Interview API POST] INTERVIEW_DB available:', !!INTERVIEW_DB);
    
    if (INTERVIEW_DB) {
      // Production: Use INTERVIEW_DB
      const store = new D1InterviewStore(INTERVIEW_DB);
      const question = await store.createQuestion({
        title,
        category,
        difficulty,
        tags,
        content,
        answer,
      });
      return NextResponse.json(question, { status: 201 });
    } else {
      // Development: Use mock data
      const question = await memoryInterviewStore.createQuestion({
        title,
        category,
        difficulty,
        tags,
        content,
        answer,
      });
      return NextResponse.json(question, { status: 201 });
    }
  } catch (error) {
    console.error('Failed to create question:', error);
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
