/**
 * 模拟的学生微服务 API - 详情接口
 */

import { NextResponse } from 'next/server';
import { D1StudentStore } from '@/lib/d1StudentStore';
import { memoryStudentStore } from '@/lib/mockDatabase';

/**
 * GET /api/microservices/students/[id]
 * 获取单个学生详情
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const env = process.env as any;
    const hasD1 = env.DB !== undefined;
    
    let student;
    if (hasD1) {
      const store = new D1StudentStore(env.DB);
      student = await store.getById(parseInt(id));
    } else {
      student = await memoryStudentStore.getById(parseInt(id));
    }

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
