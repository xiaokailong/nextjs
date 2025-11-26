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
  // 开发环境：允许所有来源
  // 生产环境：检查白名单或允许所有（根据需求调整）
  let allowedOrigin = '*';
  
  if (origin) {
    // 如果是白名单中的域名，使用该域名
    if (ALLOWED_ORIGINS.includes(origin)) {
      allowedOrigin = origin;
    } else if (process.env.NODE_ENV === 'development') {
      // 开发环境允许所有来源
      allowedOrigin = origin;
    }
    // 生产环境如果不在白名单中，使用通配符或第一个白名单域名
    // 注意：如果使用 credentials，不能使用 *
  }

  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24小时
  response.headers.set('Access-Control-Allow-Credentials', 'true'); // 如果需要携带凭证

  return response;
}

// 处理 OPTIONS 预检请求
export function handleOptionsRequest(origin?: string | null): NextResponse {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response, origin);
}
