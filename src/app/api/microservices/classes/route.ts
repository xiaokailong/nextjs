/**
 * 模拟的班级微服务 API
 * 在真实项目中，这会是独立部署的后端服务
 */

import { NextResponse } from 'next/server';
import { D1ClassStore } from '@/lib/d1ClassStore';
import { memoryClassStore } from '@/lib/mockDatabase';

export const runtime = 'edge';

/**
 * GET /api/microservices/classes
 * 获取所有班级列表
 */
export async function GET() {
  try {
    const env = process.env as any;
    const hasD1 = env.DB !== undefined;
    
    let classes;
    if (hasD1) {
      const store = new D1ClassStore(env.DB);
      classes = await store.getAll();
    } else {
      classes = await memoryClassStore.getAll();
    }

    // 模拟微服务返回的标准格式
    return NextResponse.json({
      success: true,
      data: classes,
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
        error: 'Failed to fetch classes',
        metadata: {
          service: 'class-service',
          version: '1.0.0',
        },
      },
      { status: 500 }
    );
  }
}
