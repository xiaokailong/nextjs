import { NextRequest, NextResponse } from 'next/server';
import { CreateStudentInput } from '@/types/student';
import { D1StudentStore } from '@/lib/d1StudentStore';
import { memoryStudentStore } from '@/lib/mockDatabase';
import { setCorsHeaders, handleOptionsRequest } from '@/lib/cors';

export const runtime = 'edge';

// 处理 OPTIONS 预检请求
export async function OPTIONS(req: NextRequest) {
  return handleOptionsRequest(req.headers.get('origin'));
}

// GET /api/students - 获取所有学生
export async function GET(req: NextRequest) {
  try {
    const env = process.env as any;
    const hasD1 = env.DB !== undefined;
    
    let students, total;
    
    if (hasD1) {
      // 生产环境：使用 D1 数据库
      const store = new D1StudentStore(env.DB);
      students = await store.getAll();
      total = await store.count();
    } else {
      // 本地开发：使用模拟数据
      students = await memoryStudentStore.getAll();
      total = await memoryStudentStore.count();
    }
    
    const response = NextResponse.json({
      success: true,
      data: students,
      total,
    });
    return setCorsHeaders(response, req.headers.get('origin'));
  } catch (error) {
    const response = NextResponse.json(
      { success: false, error: '获取数据失败' },
      { status: 500 }
    );
    return setCorsHeaders(response, req.headers.get('origin'));
  }
}

// POST /api/students - 创建新学生
export async function POST(req: NextRequest) {
  try {
    const body: CreateStudentInput = await req.json();

    // 简单校验
    if (!body.name || !body.age || !body.grade) {
      const response = NextResponse.json(
        { success: false, error: '姓名、年龄和年级为必填项' },
        { status: 400 }
      );
      return setCorsHeaders(response, req.headers.get('origin'));
    }

    if (body.age < 1 || body.age > 100) {
      const response = NextResponse.json(
        { success: false, error: '年龄必须在 1-100 之间' },
        { status: 400 }
      );
      return setCorsHeaders(response, req.headers.get('origin'));
    }

    const env = process.env as any;
    const hasD1 = env.DB !== undefined;
    
    let newStudent;
    
    if (hasD1) {
      const store = new D1StudentStore(env.DB);
      newStudent = await store.create({
        name: body.name,
        age: body.age,
        grade: body.grade,
        email: body.email,
      });
    } else {
      newStudent = await memoryStudentStore.create({
        name: body.name,
        age: body.age,
        grade: body.grade,
        email: body.email,
      });
    }

    const response = NextResponse.json(
      { success: true, data: newStudent },
      { status: 201 }
    );
    return setCorsHeaders(response, req.headers.get('origin'));
  } catch (error) {
    const response = NextResponse.json(
      { success: false, error: '请求格式错误' },
      { status: 400 }
    );
    return setCorsHeaders(response, req.headers.get('origin'));
  }
}
