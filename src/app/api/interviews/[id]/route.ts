import { NextRequest, NextResponse } from 'next/server';
import { D1InterviewStore } from '@/lib/d1InterviewStore';
import { memoryInterviewStore } from '@/lib/mockDatabase';
import { setCorsHeaders, handleOptionsRequest } from '@/lib/cors';

export const runtime = 'edge';

// 处理 OPTIONS 预检请求
export async function OPTIONS(request: NextRequest) {
  return handleOptionsRequest(request.headers.get('origin'));
}

// GET /api/interviews/[id] - 获取单个面试题
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }>; cloudflare?: { env?: any } }
) {
  try {
    const { id: idParam } = await context.params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      const response = NextResponse.json(
        { error: 'Invalid question ID' },
        { status: 400 }
      );
      return setCorsHeaders(response, request.headers.get('origin'));
    }
    
    // 从 Cloudflare context 中获取 INTERVIEW_DB
    const env = context?.cloudflare?.env || process.env as any;
    const INTERVIEW_DB = env?.INTERVIEW_DB;
    
    let question;
    
    if (INTERVIEW_DB) {
      // Production: Use INTERVIEW_DB
      const store = new D1InterviewStore(INTERVIEW_DB);
      question = await store.getQuestionById(id);
    } else {
      // Development: Use mock data
      question = await memoryInterviewStore.getQuestionById(id);
    }
    
    if (!question) {
      const response = NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
      return setCorsHeaders(response, request.headers.get('origin'));
    }
    
    const response = NextResponse.json(question);
    return setCorsHeaders(response, request.headers.get('origin'));
  } catch (error) {
    console.error('Failed to fetch question:', error);
    const response = NextResponse.json(
      { error: 'Failed to fetch question' },
      { status: 500 }
    );
    return setCorsHeaders(response, request.headers.get('origin'));
  }
}

// PUT /api/interviews/[id] - 更新面试题
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }>; cloudflare?: { env?: any } }
) {
  try {
    const { id: idParam } = await context.params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      const response = NextResponse.json(
        { error: 'Invalid question ID' },
        { status: 400 }
      );
      return setCorsHeaders(response, request.headers.get('origin'));
    }
    
    const body = await request.json() as any;
    const { title, category, difficulty, tags, content, answer } = body;
    
    // Validate difficulty if provided
    if (difficulty && !['easy', 'medium', 'hard'].includes(difficulty)) {
      const response = NextResponse.json(
        { error: 'Invalid difficulty level' },
        { status: 400 }
      );
      return setCorsHeaders(response, request.headers.get('origin'));
    }
    
    // Validate tags if provided
    if (tags && !Array.isArray(tags)) {
      const response = NextResponse.json(
        { error: 'Tags must be an array' },
        { status: 400 }
      );
      return setCorsHeaders(response, request.headers.get('origin'));
    }
    
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (tags !== undefined) updateData.tags = tags;
    if (content !== undefined) updateData.content = content;
    if (answer !== undefined) updateData.answer = answer;
    
    // 从 Cloudflare context 中获取 INTERVIEW_DB
    const env = context?.cloudflare?.env || process.env as any;
    const INTERVIEW_DB = env?.INTERVIEW_DB;
    
    let question;
    
    if (INTERVIEW_DB) {
      // Production: Use INTERVIEW_DB
      const store = new D1InterviewStore(INTERVIEW_DB);
      question = await store.updateQuestion(id, updateData);
    } else {
      // Development: Use mock data
      question = await memoryInterviewStore.updateQuestion(id, updateData);
    }
    
    if (!question) {
      const response = NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
      return setCorsHeaders(response, request.headers.get('origin'));
    }
    
    const response = NextResponse.json(question);
    return setCorsHeaders(response, request.headers.get('origin'));
  } catch (error) {
    console.error('Failed to update question:', error);
    const response = NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    );
    return setCorsHeaders(response, request.headers.get('origin'));
  }
}

// DELETE /api/interviews/[id] - 删除面试题
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }>; cloudflare?: { env?: any } }
) {
  try {
    const { id: idParam } = await context.params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      const response = NextResponse.json(
        { error: 'Invalid question ID' },
        { status: 400 }
      );
      return setCorsHeaders(response, request.headers.get('origin'));
    }
    
    // 从 Cloudflare context 中获取 INTERVIEW_DB
    const env = context?.cloudflare?.env || process.env as any;
    const INTERVIEW_DB = env?.INTERVIEW_DB;
    
    let question;
    
    if (INTERVIEW_DB) {
      // Production: Use INTERVIEW_DB
      const store = new D1InterviewStore(INTERVIEW_DB);
      question = await store.deleteQuestion(id);
    } else {
      // Development: Use mock data
      question = await memoryInterviewStore.deleteQuestion(id);
    }
    
    if (!question) {
      const response = NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
      return setCorsHeaders(response, request.headers.get('origin'));
    }
    
    const response = NextResponse.json({ 
      success: true, 
      message: 'Question deleted successfully',
      question 
    });
    return setCorsHeaders(response, request.headers.get('origin'));
  } catch (error) {
    console.error('Failed to delete question:', error);
    const response = NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    );
    return setCorsHeaders(response, request.headers.get('origin'));
  }
}
