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
 * BFF API: 按年龄分组获取学生
 * 演示：数据转换和格式化
 */
export async function GET(req: NextRequest) {
  try {
    const db = getDB(req);
    const bff = new BFFService(db);
    
    const ageGroups = await bff.getStudentsByAgeGroup();
    
    const response = NextResponse.json({
      success: true,
      data: ageGroups,
    });
    return setCorsHeaders(response, req.headers.get('origin'));
  } catch (error) {
    console.error('Age groups error:', error);
    const response = NextResponse.json(
      { success: false, error: '获取年龄分组失败' },
      { status: 500 }
    );
    return setCorsHeaders(response, req.headers.get('origin'));
  }
}
