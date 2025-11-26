# Interview API 修复说明

## 修复的问题

### 1. Cloudflare 部署时 Interview API 无法访问 D1 数据库

**问题原因：**
- 在 Cloudflare Pages 的 Next.js 应用中，使用 Edge Runtime 时，D1 数据库绑定需要通过 `context.cloudflare.env` 访问，而不是 `process.env`
- 之前的代码尝试从 `process.env.INTERVIEW_DB` 和 `globalThis.INTERVIEW_DB` 获取，这在 Cloudflare 环境中不起作用

**修复方案：**
- 更新所有 interview 相关的 API 路由，使其接受 `context` 参数并从 `context.cloudflare.env` 获取 D1 绑定
- 保持向后兼容，如果 `context.cloudflare.env` 不存在，回退到 `process.env`（用于本地开发）

**修改的文件：**
- `src/app/api/interviews/route.ts` - GET 和 POST 方法
- `src/app/api/interviews/[id]/route.ts` - GET、PUT 和 DELETE 方法
- `src/app/api/interviews/categories/route.ts` - GET 方法

### 2. 本地访问生产环境 API 时的跨域问题

**问题原因：**
- Interview API 路由没有设置 CORS 响应头
- 缺少 OPTIONS 预检请求处理

**修复方案：**
- 为所有 interview API 路由添加 CORS 支持
- 导入并使用现有的 `setCorsHeaders` 和 `handleOptionsRequest` 函数
- 为每个路由文件添加 OPTIONS 方法处理预检请求
- 优化 CORS 配置，在开发环境允许所有来源，生产环境可根据需要配置白名单

**修改的文件：**
- `src/app/api/interviews/route.ts` - 添加 OPTIONS 处理和 CORS 头
- `src/app/api/interviews/[id]/route.ts` - 添加 OPTIONS 处理和 CORS 头
- `src/app/api/interviews/categories/route.ts` - 添加 OPTIONS 处理和 CORS 头
- `src/lib/cors.ts` - 优化 CORS 配置逻辑

## 技术细节

### D1 数据库访问模式

```typescript
// 修改前（不工作）
const INTERVIEW_DB = process.env.INTERVIEW_DB;

// 修改后（正确）
export async function GET(
  request: NextRequest,
  context?: { cloudflare?: { env?: any } }
) {
  const env = context?.cloudflare?.env || process.env as any;
  const INTERVIEW_DB = env?.INTERVIEW_DB;
  // ...
}
```

### CORS 处理模式

```typescript
// 添加 OPTIONS 处理
export async function OPTIONS(request: NextRequest) {
  return handleOptionsRequest(request.headers.get('origin'));
}

// 为所有响应添加 CORS 头
const response = NextResponse.json(data);
return setCorsHeaders(response, request.headers.get('origin'));
```

## 部署说明

1. **wrangler.toml 配置保持不变**
   ```toml
   [[d1_databases]]
   binding = "INTERVIEW_DB"
   database_name = "interview-db"
   database_id = "1a80acab-e719-45aa-8b1c-b51287c64a87"
   ```

2. **本地开发**
   - 继续使用 mock 数据（`memoryInterviewStore`）
   - CORS 允许所有本地端口

3. **Cloudflare 生产环境**
   - 自动使用 D1 数据库
   - CORS 根据配置允许特定域名或所有来源

## 测试建议

1. **本地测试**
   ```bash
   npm run dev
   ```
   - 测试 CORS 是否工作（从不同端口访问）
   - 验证 mock 数据正常返回

2. **Cloudflare 部署测试**
   ```bash
   npm run deploy
   ```
   - 验证 D1 数据库连接成功
   - 检查浏览器控制台无 CORS 错误
   - 测试所有 CRUD 操作

## 相关参考

- [Cloudflare Pages Functions Context](https://developers.cloudflare.com/pages/functions/api-reference/)
- [Next.js Edge Runtime](https://nextjs.org/docs/app/api-reference/edge)
- [D1 Database Bindings](https://developers.cloudflare.com/d1/get-started/)
