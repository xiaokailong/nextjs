import { NextRequest, NextResponse } from 'next/server';
import { D1InterviewStore } from '@/lib/d1InterviewStore';
import { memoryInterviewStore } from '@/lib/mockDatabase';

// GET /api/interviews - 获取所有面试题或按分类/搜索过滤
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    // 在 Cloudflare Workers 中，环境变量通过 request 对象传递
    // @ts-ignore
    const env = request.env || process.env as any;
    
    if (env?.INTERVIEW_DB) {
      // Production: Use INTERVIEW_DB
      const store = new D1InterviewStore(env.INTERVIEW_DB);
      
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
    const env = request.env || process.env as any;
    
    if (env?.INTERVIEW_DB) {
      // Production: Use INTERVIEW_DB
      const store = new D1InterviewStore(env.INTERVIEW_DB);
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
