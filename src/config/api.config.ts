// API 配置
// 根据环境变量决定使用本地 API 还是远程生产 API

export const API_CONFIG = {
  // 如果设置了 NEXT_PUBLIC_API_BASE_URL，使用远程 API，否则使用本地 API
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  
  // 是否使用远程 API
  useRemoteAPI: !!process.env.NEXT_PUBLIC_API_BASE_URL,
};

// API 路径构建函数
export function getAPIPath(path: string): string {
  // 如果使用远程 API，返回完整 URL
  if (API_CONFIG.useRemoteAPI) {
    return `${API_CONFIG.baseURL}${path}`;
  }
  // 否则返回本地 API 路径
  return path;
}

// 使用示例：
// const response = await fetch(getAPIPath('/api/interviews'));
