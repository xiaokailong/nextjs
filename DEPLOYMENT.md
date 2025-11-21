# 部署指南

## 📦 环境兼容性

项目已配置为自动适配多种部署环境：

| 环境 | 数据源 | URL 解析 | 说明 |
|------|-------|---------|------|
| **本地开发** | 内存模拟数据 | `http://localhost:3000` | 无需数据库 |
| **Cloudflare Pages** | D1 数据库 | 自动从 Request 提取 | 生产环境 |
| **Docker/K8s** | PostgreSQL/MySQL | 内网服务名 | 企业部署 |

## 🚀 部署到 Cloudflare Pages

### 1. 前提条件

- Cloudflare 账户
- 已创建 D1 数据库
- 已运行数据库迁移

### 2. 配置步骤

#### a. 绑定 D1 数据库

在 `wrangler.toml` 中确认配置：

```toml
[[d1_databases]]
binding = "DB"
database_name = "your-database-name"
database_id = "your-database-id"
```

#### b. 运行数据库迁移

```bash
# 本地迁移（用于测试）
npx wrangler d1 execute your-database-name --local --file=./migrations/0001_create_students.sql
npx wrangler d1 execute your-database-name --local --file=./migrations/0002_add_classes.sql

# 生产环境迁移
npx wrangler d1 execute your-database-name --remote --file=./migrations/0001_create_students.sql
npx wrangler d1 execute your-database-name --remote --file=./migrations/0002_add_classes.sql
```

#### c. 部署到 Cloudflare

```bash
# 方式 1: 使用 Cloudflare Pages
# 连接 GitHub 仓库，自动部署

# 方式 2: 使用 Wrangler CLI
pnpm run build
npx wrangler pages deploy .next
```

### 3. 环境变量配置

在 Cloudflare Pages 设置中添加：

```env
# 可选：如果需要自定义 URL
NEXT_PUBLIC_APP_URL=https://your-domain.pages.dev
```

### 4. 验证部署

访问你的部署 URL：

```bash
# 测试 BFF API
https://your-domain.pages.dev/api/bff/dashboard

# 测试微服务 API
https://your-domain.pages.dev/api/microservices/students
```

## 🏠 本地开发

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. 启动开发服务器

```bash
pnpm dev
```

### 4. 访问应用

```bash
# 前端
http://localhost:3000

# BFF API
http://localhost:3000/api/bff/dashboard

# 微服务 API
http://localhost:3000/api/microservices/students
```

## 🔧 构建验证

### 本地构建测试

```bash
# 构建项目
pnpm build

# 启动生产服务器
pnpm start
```

### 类型检查

```bash
# 运行类型检查
pnpm type-check
```

## 🐛 常见问题

### 1. 部署时类型错误

**问题**：`Type 'Promise<{ id: string }>' is not assignable to type '{ id: string }'`

**解决**：已修复，所有动态路由的 params 都使用 Promise 类型（Next.js 16 要求）

### 2. 本地开发数据库错误

**问题**：`Cannot read properties of undefined (reading 'prepare')`

**解决**：已修复，本地环境自动使用模拟数据，无需配置数据库

### 3. Edge Runtime fetch 错误

**问题**：`Failed to parse URL from /api/microservices/students`

**解决**：已修复，BFF Service 自动构建完整 URL

## 📊 架构说明

### 数据流

```
用户浏览器
    ↓ 1 次请求
BFF API (/api/bff/*)
    ↓ 并行调用多个微服务（内网）
微服务 API (/api/microservices/*)
    ↓
数据库 (D1 / 模拟数据)
```

### 环境检测逻辑

```typescript
// 微服务 API 自动检测环境
const env = process.env as any;
const hasD1 = env.DB !== undefined;

if (hasD1) {
  // 生产环境：使用 D1 数据库
  const store = new D1StudentStore(env.DB);
  students = await store.getAll();
} else {
  // 本地开发：使用模拟数据
  students = await memoryStudentStore.getAll();
}
```

### URL 解析逻辑

```typescript
// BFF Service 自动构建完整 URL
private getBaseUrl(): string {
  // 浏览器环境
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // 本地开发
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  }
  
  // 生产环境（从 Request 提取）
  return '';
}
```

## 🎯 部署检查清单

- [ ] D1 数据库已创建
- [ ] 数据库迁移已执行
- [ ] `wrangler.toml` 配置正确
- [ ] 环境变量已设置（如需要）
- [ ] 本地构建成功 (`pnpm build`)
- [ ] 类型检查通过
- [ ] Git 仓库已连接到 Cloudflare Pages
- [ ] 首次部署成功
- [ ] API 端点可访问

## 📚 相关文档

- [BFF_MICROSERVICES_ARCHITECTURE.md](./BFF_MICROSERVICES_ARCHITECTURE.md) - 架构说明
- [D1_SETUP.md](./D1_SETUP.md) - D1 数据库配置
- [API_USAGE.md](./API_USAGE.md) - API 使用文档

## 🆘 获取帮助

如遇到问题：

1. 检查本文档的常见问题部分
2. 查看 Cloudflare Pages 部署日志
3. 检查浏览器控制台错误
4. 验证环境变量配置
5. 确认 D1 数据库绑定正确
