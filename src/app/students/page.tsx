'use client';

import { useState, useEffect } from 'react';
import { Student } from '@/types/student';
import { ApiResponse } from '@/types/api';

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
      const res = await fetch('/api/students');
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
        const res = await fetch(`/api/students/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data: ApiResponse<Student> = await res.json();
        if (data.success) {
          alert('更新成功！');
          setEditingId(null);
        }
      } else {
        // 创建
        const res = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data: ApiResponse<Student> = await res.json();
        if (data.success) {
          alert('创建成功！');
        }
      }
      
      setFormData({ name: '', age: '', grade: '', email: '' });
      fetchStudents();
    } catch (error) {
      console.error('操作失败:', error);
      alert('操作失败，请重试');
    }
  };

  // 删除学生
  const handleDelete = async (id: number) => {
    if (!confirm('确定删除该学生吗？')) return;

    try {
      const res = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
      });
      const data: ApiResponse<Student> = await res.json();
      if (data.success) {
        alert('删除成功！');
        fetchStudents();
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
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
    return <div className="p-8">加载中...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">学生管理系统</h1>

      {/* 表单 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? '编辑学生' : '添加学生'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                年龄 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                max="100"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                年级 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">邮箱</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editingId ? '更新' : '添加'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: '', age: '', grade: '', email: '' });
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              >
                取消
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 学生列表 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b">
          学生列表 ({students.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">姓名</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">年龄</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">年级</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">邮箱</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">创建时间</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{student.id}</td>
                  <td className="px-6 py-4 text-sm font-medium">{student.name}</td>
                  <td className="px-6 py-4 text-sm">{student.age}</td>
                  <td className="px-6 py-4 text-sm">{student.grade}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {student.email || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(student.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(student)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && (
            <div className="text-center py-8 text-gray-500">暂无学生数据</div>
          )}
        </div>
      </div>
    </div>
  );
}
