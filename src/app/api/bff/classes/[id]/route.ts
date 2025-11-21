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
 * BFF API: 获取单个班级的详细信息
 * 演示：数据聚合（班级 + 学生列表 + 统计）
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const db = getDB(req);
    const bff = new BFFService(db);
    
    const classWithStats = await bff.getClassWithStats(id);
    
    if (!classWithStats) {
      const response = NextResponse.json(
        { success: false, error: '班级不存在' },
        { status: 404 }
      );
      return setCorsHeaders(response, req.headers.get('origin'));
    }
    
    const response = NextResponse.json({
      success: true,
      data: classWithStats,
    });
    return setCorsHeaders(response, req.headers.get('origin'));
  } catch (error) {
    console.error('Class stats error:', error);
    const response = NextResponse.json(
      { success: false, error: '获取班级详情失败' },
      { status: 500 }
    );
    return setCorsHeaders(response, req.headers.get('origin'));
  }
}
