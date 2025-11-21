/**
 * 模拟的学生微服务 API
 * 在真实项目中，这会是独立部署的后端服务
 * 这里为了演示 BFF 架构，我们在同一个项目中模拟
 */

import { NextResponse } from 'next/server';
import { D1StudentStore } from '@/lib/d1StudentStore';

export const runtime = 'edge';

/**
 * GET /api/microservices/students
 * 获取所有学生列表
 */
export async function GET(request: Request) {
  try {
    const env = process.env as any;
    const store = new D1StudentStore(env.DB);
    
    const students = await store.getAll();

    // 模拟微服务返回的标准格式
    return NextResponse.json({
      success: true,
      data: students,
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
        error: 'Failed to fetch students',
        metadata: {
          service: 'student-service',
          version: '1.0.0',
        },
      },
      { status: 500 }
    );
  }
}
