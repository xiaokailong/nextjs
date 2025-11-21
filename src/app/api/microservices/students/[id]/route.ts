/**
 * 模拟的学生微服务 API - 详情接口
 */

import { NextResponse } from 'next/server';
import { D1StudentStore } from '@/lib/d1StudentStore';

export const runtime = 'edge';

/**
 * GET /api/microservices/students/[id]
 * 获取单个学生详情
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const env = process.env as any;
    const store = new D1StudentStore(env.DB);
    
    const student = await store.getById(parseInt(params.id));

    if (!student) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Student not found',
          metadata: {
            service: 'student-service',
            version: '1.0.0',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: student,
      metadata: {
        service: 'student-service',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Student microservice error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch student',
        metadata: {
          service: 'student-service',
          version: '1.0.0',
        },
      },
      { status: 500 }
    );
  }
}
