import { NextRequest, NextResponse } from 'next/server';
import { BFFService } from '@/lib/bffService';
import { setCorsHeaders } from '@/lib/cors';
import { hasD1Database } from '@/lib/mockDatabase';

export const runtime = 'edge';

function getDB(req: NextRequest): D1Database | undefined {
  if (!hasD1Database()) return undefined;
  const env = process.env as any;
  return env.DB;
}

/**
 * BFF API: 获取仪表板数据
 * 演示：一次请求聚合多个数据源
 */
export async function GET(req: NextRequest) {
  try {
    const db = getDB(req);
    const bff = new BFFService(db);
    
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
