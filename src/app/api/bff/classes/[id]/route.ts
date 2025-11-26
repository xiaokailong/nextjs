import { NextRequest, NextResponse } from 'next/server';
import { BFFServiceV2 } from '@/lib/bffServiceV2';
import { setCorsHeaders } from '@/lib/cors';

/**
 * BFF API: 获取单个班级的详细信息
 * 🔥 新架构：BFF 调用多个微服务并聚合数据
 * 演示：数据聚合（班级 + 学生列表 + 统计）
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const bff = new BFFServiceV2(req.url);
    
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
