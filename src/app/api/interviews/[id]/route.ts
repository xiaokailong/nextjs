import { NextRequest, NextResponse } from 'next/server';
import { D1InterviewStore } from '@/lib/d1InterviewStore';
import { memoryInterviewStore } from '@/lib/mockDatabase';

// GET /api/interviews/[id] - 获取单个面试题
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await context.params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid question ID' },
        { status: 400 }
      );
    }
    
    // @ts-ignore
    const env = process.env as any;
    const INTERVIEW_DB = env.INTERVIEW_DB;
    
    if (INTERVIEW_DB) {
      // Production: Use INTERVIEW_DB
      const store = new D1InterviewStore(INTERVIEW_DB);
      const question = await store.getQuestionById(id);
      
      if (!question) {
        return NextResponse.json(
          { error: 'Question not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(question);
    } else {
      // Development: Use mock data
      const question = await memoryInterviewStore.getQuestionById(id);
      
      if (!question) {
        return NextResponse.json(
          { error: 'Question not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(question);
    }
  } catch (error) {
    console.error('Failed to fetch question:', error);
    return NextResponse.json(
      { error: 'Failed to fetch question' },
      { status: 500 }
    );
  }
}

// PUT /api/interviews/[id] - 更新面试题
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await context.params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid question ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json() as any;
    const { title, category, difficulty, tags, content, answer } = body;
    
    // Validate difficulty if provided
    if (difficulty && !['easy', 'medium', 'hard'].includes(difficulty)) {
      return NextResponse.json(
        { error: 'Invalid difficulty level' },
        { status: 400 }
      );
    }
    
    // Validate tags if provided
    if (tags && !Array.isArray(tags)) {
      return NextResponse.json(
        { error: 'Tags must be an array' },
        { status: 400 }
      );
    }
    
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (tags !== undefined) updateData.tags = tags;
    if (content !== undefined) updateData.content = content;
    if (answer !== undefined) updateData.answer = answer;
    
    // @ts-ignore
    const env = process.env as any;
    const INTERVIEW_DB = env.INTERVIEW_DB;
    
    if (INTERVIEW_DB) {
      // Production: Use INTERVIEW_DB
      const store = new D1InterviewStore(INTERVIEW_DB);
      const question = await store.updateQuestion(id, updateData);
      
      if (!question) {
        return NextResponse.json(
          { error: 'Question not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(question);
    } else {
      // Development: Use mock data
      const question = await memoryInterviewStore.updateQuestion(id, updateData);
      
      if (!question) {
        return NextResponse.json(
          { error: 'Question not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(question);
    }
  } catch (error) {
    console.error('Failed to update question:', error);
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    );
  }
}

// DELETE /api/interviews/[id] - 删除面试题
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await context.params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid question ID' },
        { status: 400 }
      );
    }
    
    // @ts-ignore
    const env = process.env as any;
    const INTERVIEW_DB = env.INTERVIEW_DB;
    
    if (INTERVIEW_DB) {
      // Production: Use INTERVIEW_DB
      const store = new D1InterviewStore(INTERVIEW_DB);
      const question = await store.deleteQuestion(id);
      
      if (!question) {
        return NextResponse.json(
          { error: 'Question not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Question deleted successfully',
        question 
      });
    } else {
      // Development: Use mock data
      const question = await memoryInterviewStore.deleteQuestion(id);
      
      if (!question) {
        return NextResponse.json(
          { error: 'Question not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Question deleted successfully',
        question 
      });
    }
  } catch (error) {
    console.error('Failed to delete question:', error);
    return NextResponse.json(
      { error: 'Failed to delete question' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
