import { NextRequest, NextResponse } from 'next/server';
import { UpdateStudentInput } from '@/types/student';
import { D1StudentStore } from '@/lib/d1StudentStore';
import { setCorsHeaders, handleOptionsRequest } from '@/lib/cors';

export const runtime = 'edge';

// 获取 D1 数据库实例
function getDB(req: NextRequest): D1Database {
  const env = process.env as any;
  return env.DB;
}

// 处理 OPTIONS 预检请求
export async function OPTIONS(req: NextRequest) {
  return handleOptionsRequest(req.headers.get('origin'));
}

// GET /api/students/[id] - 获取单个学生
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const db = getDB(req);
    const store = new D1StudentStore(db);
    const student = await store.getById(id);

    if (!student) {
      const response = NextResponse.json(
        { success: false, error: '学生不存在' },
        { status: 404 }
      );
      return setCorsHeaders(response, req.headers.get('origin'));
    }

    const response = NextResponse.json({ success: true, data: student });
    return setCorsHeaders(response, req.headers.get('origin'));
  } catch (error) {
    const response = NextResponse.json(
      { success: false, error: '获取数据失败' },
      { status: 500 }
    );
    return setCorsHeaders(response, req.headers.get('origin'));
  }
}

// PUT /api/students/[id] - 更新学生信息
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const body: UpdateStudentInput = await req.json();

    // 校验
    if (body.age !== undefined && (body.age < 1 || body.age > 100)) {
      const response = NextResponse.json(
        { success: false, error: '年龄必须在 1-100 之间' },
        { status: 400 }
      );
      return setCorsHeaders(response, req.headers.get('origin'));
    }

    const db = getDB(req);
    const store = new D1StudentStore(db);
    const updatedStudent = await store.update(id, body);

    if (!updatedStudent) {
      const response = NextResponse.json(
        { success: false, error: '学生不存在' },
        { status: 404 }
      );
      return setCorsHeaders(response, req.headers.get('origin'));
    }

    const response = NextResponse.json({
      success: true,
      data: updatedStudent,
    });
    return setCorsHeaders(response, req.headers.get('origin'));
  } catch (error) {
    const response = NextResponse.json(
      { success: false, error: '请求格式错误' },
      { status: 400 }
    );
    return setCorsHeaders(response, req.headers.get('origin'));
  }
}

// DELETE /api/students/[id] - 删除学生
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const db = getDB(req);
    const store = new D1StudentStore(db);
    const deletedStudent = await store.delete(id);

    if (!deletedStudent) {
      const response = NextResponse.json(
        { success: false, error: '学生不存在' },
        { status: 404 }
      );
      return setCorsHeaders(response, req.headers.get('origin'));
    }

    const response = NextResponse.json({
      success: true,
      data: deletedStudent,
      message: '删除成功',
    });
    return setCorsHeaders(response, req.headers.get('origin'));
  } catch (error) {
    const response = NextResponse.json(
      { success: false, error: '删除失败' },
      { status: 500 }
    );
    return setCorsHeaders(response, req.headers.get('origin'));
  }
}
