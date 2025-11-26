# Cloudflare D1 数据库绑定修复说明

## 问题描述

在 Cloudflare Pages 部署 Next.js 应用时，原来的代码使用了错误的方式访问 D1 数据库绑定，导致生产环境无法连接数据库。

### 原来的错误代码
```typescript
// ❌ 错误的访问方式
const INTERVIEW_DB = process.env.INTERVIEW_DB || (typeof globalThis !== 'undefined' && (globalThis as any).INTERVIEW_DB);
```

### 修复后的正确代码
```typescript
// ✅ 正确的访问方式
const env = process.env as any;
const INTERVIEW_DB = env.INTERVIEW_DB;
```

## 为什么这样修复？

在 Cloudflare Workers/Pages 的 **Edge Runtime** 环境中：

1. **D1 数据库绑定** 是通过 `wrangler.toml` 配置的
2. 在运行时，这些绑定会被注入到 **`process.env`** 对象中（作为特殊对象，而不是字符串）
3. 不需要通过 `globalThis` 或其他复杂方式访问

### wrangler.toml 配置
```toml
[[d1_databases]]
binding = "DB"
database_name = "students-db"
database_id = "43d7dda4-8ee5-4918-933b-56eab744037c"

[[d1_databases]]
binding = "INTERVIEW_DB"
database_name = "interview-db"
database_id = "1a80acab-e719-45aa-8b1c-b51287c64a87"
```

- `binding = "DB"` → 代码中访问 `process.env.DB`
- `binding = "INTERVIEW_DB"` → 代码中访问 `process.env.INTERVIEW_DB`

## 修复的文件列表

### 1. `/api/interviews/route.ts`
- ✅ GET /api/interviews
- ✅ POST /api/interviews

### 2. `/api/interviews/[id]/route.ts`
- ✅ GET /api/interviews/[id]
- ✅ PUT /api/interviews/[id]
- ✅ DELETE /api/interviews/[id]

### 3. `/api/interviews/categories/route.ts`
- ✅ GET /api/interviews/categories

### 4. `/api/students/route.ts`
- ✅ 已经使用正确的方式（无需修改）

```typescript
const env = process.env as any;
const hasD1 = env.DB !== undefined;
```

## 环境行为

### 本地开发环境
- `process.env.INTERVIEW_DB` → `undefined`
- 自动回退到 `memoryInterviewStore`（内存模拟数据）

### Cloudflare 生产环境
- `process.env.INTERVIEW_DB` → D1Database 对象
- 使用 `D1InterviewStore` 操作真实数据库

## 验证修复

部署后访问以下 API 端点验证：

```bash
# 获取面试题分类
curl https://velen-nextjs.pages.dev/api/interviews/categories

# 获取所有面试题
curl https://velen-nextjs.pages.dev/api/interviews

# 获取单个面试题
curl https://velen-nextjs.pages.dev/api/interviews/1

# 创建面试题
curl -X POST https://velen-nextjs.pages.dev/api/interviews \
  -H "Content-Type: application/json" \
  -d '{
    "title": "测试题目",
    "category": "javascript",
    "difficulty": "medium",
    "tags": ["测试"],
    "content": "题目内容",
    "answer": "参考答案"
  }'
```

## 重要提示

⚠️ **Edge Runtime 限制**：
- 所有 API 路由都必须使用 `export const runtime = 'edge';`
- D1 绑定只在 Edge Runtime 中可用
- 本地开发时 D1 不可用，会自动使用模拟数据

✅ **最佳实践**：
```typescript
// 统一的数据库访问模式
const env = process.env as any;
const DB_BINDING = env.YOUR_BINDING_NAME;

if (DB_BINDING) {
  // 生产环境：使用 D1
  const store = new D1Store(DB_BINDING);
  // ...
} else {
  // 开发环境：使用模拟数据
  const store = memoryStore;
  // ...
}
```

## 部署命令

```bash
# 构建并部署
pnpm run deploy

# 或分步执行
pnpm run build
npx wrangler pages deploy .next
```

## 数据库管理

```bash
# 查看远程数据库数据
npx wrangler d1 execute interview-db --remote --command="SELECT * FROM interview_questions;"

# 运行迁移
pnpm run db:migrate:interview
```

---

**修复日期**: 2025-11-26
**状态**: ✅ 已修复并验证
