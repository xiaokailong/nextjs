import { NextRequest, NextResponse } from 'next/server';
import { BFFServiceV2 } from '@/lib/bffServiceV2';
import { setCorsHeaders } from '@/lib/cors';

/**
 * BFF API: 按年龄分组获取学生
 * 🔥 新架构：BFF 调用微服务，然后进行数据转换
 * 演示：数据转换和格式化
 */
export async function GET(req: NextRequest) {
  try {
    const bff = new BFFServiceV2(req.url);
    
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
