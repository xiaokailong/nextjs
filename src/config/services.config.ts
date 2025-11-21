/**
 * 微服务配置
 * 在真实生产环境中，这些 URL 会指向内网服务名（如 Kubernetes Service）
 * 在 Cloudflare Workers 环境中，这些会是后端微服务的 URL
 */

export const ServicesConfig = {
  // 学生微服务
  studentService: {
    baseUrl: process.env.STUDENT_SERVICE_URL || 'http://localhost:3001',
    endpoints: {
      list: '/api/students',
      detail: (id: string) => `/api/students/${id}`,
      ageGroups: '/api/students/age-groups',
    },
    timeout: 5000,
  },

  // 班级微服务
  classService: {
    baseUrl: process.env.CLASS_SERVICE_URL || 'http://localhost:3002',
    endpoints: {
      list: '/api/classes',
      detail: (id: string) => `/api/classes/${id}`,
      students: (classId: string) => `/api/classes/${classId}/students`,
    },
    timeout: 5000,
  },

  // 用户微服务（示例）
  userService: {
    baseUrl: process.env.USER_SERVICE_URL || 'http://localhost:3003',
    endpoints: {
      profile: (id: string) => `/api/users/${id}`,
      preferences: (id: string) => `/api/users/${id}/preferences`,
    },
    timeout: 5000,
  },
} as const;

/**
 * HTTP 客户端配置
 */
export const HttpClientConfig = {
  // 默认超时时间
  defaultTimeout: 5000,
  
  // 重试配置
  retry: {
    maxRetries: 3,
    retryDelay: 1000,
  },
  
  // 请求头
  defaultHeaders: {
    'Content-Type': 'application/json',
    'User-Agent': 'NextJS-BFF/1.0',
  },
};
