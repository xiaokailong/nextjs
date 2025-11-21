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
 * BFF API: 获取所有班级及其统计信息
 * 演示：数据聚合和计算
 */
export async function GET(req: NextRequest) {
  try {
    const db = getDB(req);
    const bff = new BFFService(db);
    
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
