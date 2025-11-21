'use client';

import { useState, useEffect } from 'react';
import { ApiResponse } from '@/types/api';

interface DashboardData {
  summary: {
    totalStudents: number;
    totalClasses: number;
    averageAge: number;
  };
  ageDistribution: {
    teenagers: number;
    youngAdults: number;
    adults: number;
  };
  recentStudents: Array<{
    id: number;
    name: string;
    age: number;
    grade: string;
  }>;
  classes: Array<{
    id: number;
    name: string;
    grade: string;
    teacherName: string;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/bff/dashboard');
      const result: ApiResponse<DashboardData> = await res.json();
      if (result.success && result.data) {
        setData(result.data);
      }
    } catch (error) {
      console.error('获取仪表板数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">加载中...</div>;
  }

  if (!data) {
    return <div className="p-8">加载失败</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">📊 数据仪表板 (BFF 示例)</h1>
      
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">💡 BFF 层演示</h3>
        <p className="text-sm text-blue-800">
          这个页面通过 <code className="bg-blue-100 px-1 rounded">/api/bff/dashboard</code> 一次请求获取所有数据，
          演示了 BFF（Backend For Frontend）的数据聚合能力。
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm text-gray-600 mb-1">学生总数</div>
          <div className="text-3xl font-bold text-blue-600">
            {data.summary.totalStudents}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm text-gray-600 mb-1">班级总数</div>
          <div className="text-3xl font-bold text-green-600">
            {data.summary.totalClasses}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm text-gray-600 mb-1">平均年龄</div>
          <div className="text-3xl font-bold text-purple-600">
            {data.summary.averageAge}
          </div>
        </div>
      </div>

      {/* 年龄分布 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">年龄分布</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded">
            <div className="text-2xl font-bold text-blue-600">
              {data.ageDistribution.teenagers}
            </div>
            <div className="text-sm text-gray-600">13-15岁</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded">
            <div className="text-2xl font-bold text-green-600">
              {data.ageDistribution.youngAdults}
            </div>
            <div className="text-sm text-gray-600">16-18岁</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded">
            <div className="text-2xl font-bold text-purple-600">
              {data.ageDistribution.adults}
            </div>
            <div className="text-sm text-gray-600">19岁以上</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 最近学生 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">最近学生</h2>
          <div className="space-y-3">
            {data.recentStudents.map((student) => (
              <div key={student.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{student.name}</div>
                  <div className="text-sm text-gray-600">{student.grade}</div>
                </div>
                <div className="text-sm text-gray-600">{student.age}岁</div>
              </div>
            ))}
          </div>
        </div>

        {/* 班级列表 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">班级列表</h2>
          <div className="space-y-3">
            {data.classes.map((cls) => (
              <div key={cls.id} className="p-3 bg-gray-50 rounded">
                <div className="font-medium">{cls.grade} {cls.name}</div>
                <div className="text-sm text-gray-600">班主任: {cls.teacherName}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* API 说明 */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-3">🔧 可用的 BFF API 端点：</h3>
        <ul className="space-y-2 text-sm font-mono">
          <li>✅ <code className="bg-white px-2 py-1 rounded">/api/bff/dashboard</code> - 仪表板数据聚合</li>
          <li>✅ <code className="bg-white px-2 py-1 rounded">/api/bff/classes</code> - 班级统计列表</li>
          <li>✅ <code className="bg-white px-2 py-1 rounded">/api/bff/classes/[id]</code> - 班级详情（含学生）</li>
          <li>✅ <code className="bg-white px-2 py-1 rounded">/api/bff/students/age-groups</code> - 学生年龄分组</li>
        </ul>
      </div>
    </div>
  );
}
