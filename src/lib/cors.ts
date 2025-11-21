import { NextResponse } from 'next/server';

// CORS 配置
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173', // Vite 默认端口
  'http://localhost:5174',
  'http://localhost:8080',
  // 添加你的生产域名
  // 'https://yourapp.com',
];

// 设置 CORS 响应头
export function setCorsHeaders(response: NextResponse, origin?: string | null): NextResponse {
  // 允许所有来源（开发阶段）
  // 生产环境建议限制为特定域名
  const allowedOrigin = origin && (ALLOWED_ORIGINS.includes(origin) || process.env.NODE_ENV === 'development')
    ? origin
    : ALLOWED_ORIGINS[0];

  response.headers.set('Access-Control-Allow-Origin', allowedOrigin || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24小时

  return response;
}

// 处理 OPTIONS 预检请求
export function handleOptionsRequest(origin?: string | null): NextResponse {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response, origin);
}
