// API 配置
// 自动识别环境：
// - 本地开发环境 (localhost) → 使用生产 API
// - 生产环境 (Cloudflare Pages) → 使用本地 API 路径

const isProduction = process.env.NODE_ENV === 'production';
const isClient = typeof window !== 'undefined';

// 生产 API 地址
const PRODUCTION_API_URL = 'https://velen-nextjs.pages.dev';

export const API_CONFIG = {
  // 开发环境使用生产 API，生产环境使用本地路径
  baseURL: !isProduction ? PRODUCTION_API_URL : '',
  
  // 是否使用远程 API
  useRemoteAPI: !isProduction,
};

// API 路径构建函数
export function getAPIPath(path: string): string {
  // 开发环境：返回完整的生产 API URL
  if (API_CONFIG.useRemoteAPI) {
    return `${API_CONFIG.baseURL}${path}`;
  }
  // 生产环境：返回本地 API 路径
  return path;
}

// 使用示例：
// 开发环境: fetch(getAPIPath('/api/interviews')) → 'https://velen-nextjs.pages.dev/api/interviews'
// 生产环境: fetch(getAPIPath('/api/interviews')) → '/api/interviews'
