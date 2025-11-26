import { NextRequest, NextResponse } from 'next/server';
import { BFFServiceV2 } from '@/lib/bffServiceV2';
import { setCorsHeaders } from '@/lib/cors';

/**
 * BFF API: 获取所有班级及其统计信息
 * 🔥 新架构：BFF 通过 HTTP 调用微服务 API
 * 演示：数据聚合和计算
 */
export async function GET(req: NextRequest) {
  try {
    const bff = new BFFServiceV2(req.url);
    
    const classesWithStats = await bff.getAllClassesWithStats();
    
    const response = NextResponse.json({
      success: true,
      data: classesWithStats,
    });
    return setCorsHeaders(response, req.headers.get('origin'));
  } catch (error) {
    console.error('Classes stats error:', error);
    const response = NextResponse.json(
      { success: false, error: '获取班级统计失败' },
      { status: 500 }
    );
    return setCorsHeaders(response, req.headers.get('origin'));
  }
}
