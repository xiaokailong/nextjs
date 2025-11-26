import { NextRequest, NextResponse } from 'next/server';
import { BFFServiceV2 } from '@/lib/bffServiceV2';
import { setCorsHeaders } from '@/lib/cors';

/**
 * BFF API: 获取仪表板数据
 * 🔥 新架构：BFF 通过 HTTP 调用微服务 API，而不是直接查询数据库
 * 演示：前端 1 次请求 → BFF 并行调用多个微服务 → 聚合返回
 */
export async function GET(req: NextRequest) {
  try {
    // 使用新的 BFFServiceV2（通过 HTTP 调用微服务）
    // 传入 request URL 以支持 Edge Runtime
    const bff = new BFFServiceV2(req.url);
    
    const dashboardData = await bff.getDashboardData();
    
    const response = NextResponse.json({
      success: true,
      data: dashboardData,
    });
    return setCorsHeaders(response, req.headers.get('origin'));
  } catch (error) {
    console.error('Dashboard error:', error);
    const response = NextResponse.json(
      { success: false, error: '获取仪表板数据失败' },
      { status: 500 }
    );
    return setCorsHeaders(response, req.headers.get('origin'));
  }
}
