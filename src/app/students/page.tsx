'use client';

import { useState, useEffect } from 'react';
import { Student } from '@/types/student';
import { ApiResponse } from '@/types/api';
import { getAPIPath } from '@/config/api.config';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Spinner,
  Divider,
} from '@heroui/react';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    email: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  // 获取学生列表
  const fetchStudents = async () => {
    try {
      const res = await fetch(getAPIPath('/api/students'));
      const data: ApiResponse<Student[]> = await res.json();
      if (data.success && data.data) {
        setStudents(data.data);
      }
    } catch (error) {
      console.error('获取学生列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 创建或更新学生
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name,
      age: parseInt(formData.age),
      grade: formData.grade,
      email: formData.email || undefined,
    };

    try {
      if (editingId) {
        // 更新
        const res = await fetch(getAPIPath(`/api/students/${editingId}`), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data: ApiResponse<Student> = await res.json();
        if (data.success) {
          setEditingId(null);
        }
      } else {
        // 创建
        await fetch(getAPIPath('/api/students'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      
      setFormData({ name: '', age: '', grade: '', email: '' });
      fetchStudents();
    } catch (error) {
      console.error('操作失败:', error);
    }
  };

  // 删除学生
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(getAPIPath(`/api/students/${id}`), {
        method: 'DELETE',
      });
      const data: ApiResponse<Student> = await res.json();
      if (data.success) {
        fetchStudents();
      }
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  // 编辑学生
  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setFormData({
      name: student.name,
      age: student.age.toString(),
      grade: student.grade,
      email: student.email || '',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label="加载中..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">学生管理系统</h1>
        <Chip color="primary" variant="flat" size="lg">
          共 {students.length} 人
        </Chip>
      </div>

      {/* 表单 */}
      <Card>
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-xl font-semibold">
              {editingId ? '编辑学生' : '添加学生'}
            </p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                label="姓名"
                placeholder="请输入姓名"
                isRequired
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                variant="bordered"
              />
              <Input
                type="number"
                label="年龄"
                placeholder="请输入年龄"
                isRequired
                min={1}
                max={100}
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                variant="bordered"
              />
              <Input
                type="text"
                label="年级"
                placeholder="请输入年级"
                isRequired
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                variant="bordered"
              />
              <Input
                type="email"
                label="邮箱"
                placeholder="请输入邮箱（可选）"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                variant="bordered"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                color="primary"
                variant="solid"
              >
                {editingId ? '更新学生' : '添加学生'}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  color="default"
                  variant="flat"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: '', age: '', grade: '', email: '' });
                  }}
                >
                  取消编辑
                </Button>
              )}
            </div>
          </form>
        </CardBody>
      </Card>

      {/* 学生列表 */}
      <Card>
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-xl font-semibold">学生列表</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <Table
            aria-label="学生列表表格"
            classNames={{
              wrapper: "min-h-[400px]",
            }}
          >
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>姓名</TableColumn>
              <TableColumn>年龄</TableColumn>
              <TableColumn>年级</TableColumn>
              <TableColumn>邮箱</TableColumn>
              <TableColumn>创建时间</TableColumn>
              <TableColumn>操作</TableColumn>
            </TableHeader>
            <TableBody emptyContent="暂无学生数据">
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>
                    <span className="font-semibold">{student.name}</span>
                  </TableCell>
                  <TableCell>{student.age}</TableCell>
                  <TableCell>
                    <Chip color="secondary" variant="flat" size="sm">
                      {student.grade}
                    </Chip>
                  </TableCell>
                  <TableCell>{student.email || '-'}</TableCell>
                  <TableCell>
                    {student.createdAt 
                      ? new Date(student.createdAt).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })
                      : '-'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onClick={() => handleEdit(student)}
                      >
                        编辑
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        onClick={() => handleDelete(student.id)}
                      >
                        删除
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
