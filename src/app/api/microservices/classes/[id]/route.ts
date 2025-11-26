/**
 * 模拟的班级微服务 API - 详情接口
 */

import { NextResponse } from 'next/server';
import { D1ClassStore } from '@/lib/d1ClassStore';
import { memoryClassStore } from '@/lib/mockDatabase';

/**
 * GET /api/microservices/classes/[id]
 * 获取单个班级详情（包含学生列表）
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const env = process.env as any;
    const hasD1 = env.DB !== undefined;
    
    let classData;
    if (hasD1) {
      const store = new D1ClassStore(env.DB);
      classData = await store.getById(parseInt(id));
    } else {
      classData = await memoryClassStore.getById(parseInt(id));
    }

    if (!classData) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Class not found',
          metadata: {
            service: 'class-service',
            version: '1.0.0',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: classData,
      metadata: {
        service: 'class-service',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Class microservice error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch class',
        metadata: {
          service: 'class-service',
          version: '1.0.0',
        },
      },
      { status: 500 }
    );
  }
}
