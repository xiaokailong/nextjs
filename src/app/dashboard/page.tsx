'use client';

import { useState, useEffect } from 'react';
import { ApiResponse } from '@/types/api';
import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Spinner,
  Divider,
  Progress,
} from '@heroui/react';

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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label="加载中..." />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="max-w-md">
          <CardBody className="text-center">
            <p className="text-lg text-danger">加载失败，请刷新重试</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  const totalStudents = data.summary.totalStudents;
  const teenagersPercent = totalStudents ? (data.ageDistribution.teenagers / totalStudents) * 100 : 0;
  const youngAdultsPercent = totalStudents ? (data.ageDistribution.youngAdults / totalStudents) * 100 : 0;
  const adultsPercent = totalStudents ? (data.ageDistribution.adults / totalStudents) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">📊 数据仪表板</h1>
        <Chip color="success" variant="flat" size="lg">
          BFF 聚合演示
        </Chip>
      </div>

      {/* BFF 说明 */}
      <Card className="bg-primary-50 border-primary-200">
        <CardBody>
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-semibold text-primary-900 mb-1">BFF 层演示</h3>
              <p className="text-sm text-primary-800">
                这个页面通过 <code className="bg-primary-100 px-2 py-1 rounded">/api/bff/dashboard</code> 一次请求获取所有数据，
                演示了 BFF（Backend For Frontend）的数据聚合能力。
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardBody className="text-center">
            <p className="text-sm text-default-600 mb-2">学生总数</p>
            <p className="text-4xl font-bold text-primary">
              {data.summary.totalStudents}
            </p>
            <p className="text-xs text-default-500 mt-1">名在校学生</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center">
            <p className="text-sm text-default-600 mb-2">班级总数</p>
            <p className="text-4xl font-bold text-success">
              {data.summary.totalClasses}
            </p>
            <p className="text-xs text-default-500 mt-1">个班级</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center">
            <p className="text-sm text-default-600 mb-2">平均年龄</p>
            <p className="text-4xl font-bold text-secondary">
              {data.summary.averageAge}
            </p>
            <p className="text-xs text-default-500 mt-1">岁</p>
          </CardBody>
        </Card>
      </div>

      {/* 年龄分布 */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">年龄分布</h2>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">13-15岁（青少年）</span>
                <Chip color="primary" variant="flat" size="sm">
                  {data.ageDistribution.teenagers} 人
                </Chip>
              </div>
              <Progress 
                value={teenagersPercent} 
                color="primary" 
                size="sm"
                className="max-w-full"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">16-18岁（青年）</span>
                <Chip color="success" variant="flat" size="sm">
                  {data.ageDistribution.youngAdults} 人
                </Chip>
              </div>
              <Progress 
                value={youngAdultsPercent} 
                color="success" 
                size="sm"
                className="max-w-full"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">19岁以上（成年）</span>
                <Chip color="secondary" variant="flat" size="sm">
                  {data.ageDistribution.adults} 人
                </Chip>
              </div>
              <Progress 
                value={adultsPercent} 
                color="secondary" 
                size="sm"
                className="max-w-full"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 最近学生 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">最近学生</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-2">
              {data.recentStudents.map((student) => (
                <div 
                  key={student.id} 
                  className="flex justify-between items-center p-3 hover:bg-default-100 rounded-lg transition-colors"
                >
                  <div>
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm text-default-500">
                      <Chip color="default" variant="flat" size="sm">
                        {student.grade}
                      </Chip>
                    </div>
                  </div>
                  <Chip color="primary" variant="dot" size="sm">
                    {student.age}岁
                  </Chip>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* 班级列表 */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">班级列表</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-2">
              {data.classes.map((cls) => (
                <div 
                  key={cls.id} 
                  className="p-3 hover:bg-default-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{cls.grade} {cls.name}</span>
                    <Chip color="success" variant="flat" size="sm">
                      ID: {cls.id}
                    </Chip>
                  </div>
                  <div className="text-sm text-default-500">
                    班主任: {cls.teacherName}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* API 说明 */}
      <Card className="bg-default-50">
        <CardHeader>
          <h3 className="font-semibold flex items-center gap-2">
            <span>🔧</span>
            <span>可用的 BFF API 端点</span>
          </h3>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex items-center gap-2">
              <Chip color="success" variant="dot" size="sm">GET</Chip>
              <code className="bg-default-100 px-3 py-1 rounded">/api/bff/dashboard</code>
              <span className="text-default-500 text-xs">仪表板数据聚合</span>
            </div>
            <div className="flex items-center gap-2">
              <Chip color="success" variant="dot" size="sm">GET</Chip>
              <code className="bg-default-100 px-3 py-1 rounded">/api/bff/classes</code>
              <span className="text-default-500 text-xs">班级统计列表</span>
            </div>
            <div className="flex items-center gap-2">
              <Chip color="success" variant="dot" size="sm">GET</Chip>
              <code className="bg-default-100 px-3 py-1 rounded">/api/bff/classes/[id]</code>
              <span className="text-default-500 text-xs">班级详情（含学生）</span>
            </div>
            <div className="flex items-center gap-2">
              <Chip color="success" variant="dot" size="sm">GET</Chip>
              <code className="bg-default-100 px-3 py-1 rounded">/api/bff/students/age-groups</code>
              <span className="text-default-500 text-xs">学生年龄分组</span>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
