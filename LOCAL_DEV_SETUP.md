# 本地开发配置说明

## 数据持久化方案

### 本地开发环境
- **存储方式**：JSON 文件（`src/data/db.json`）
- **Runtime**：Node.js Runtime（支持 `fs` 模块）
- **优点**：数据持久化，重启服务器后数据不丢失

### 生产环境（Cloudflare）
- **存储方式**：D1 数据库
- **Runtime**：Edge Runtime
- **优点**：高性能边缘计算

## 重要修复说明

### 问题
之前所有 API 路由使用了 `export const runtime = 'edge'`，但本地开发使用的 `jsonStore` 依赖 Node.js 的 `fs` 模块，导致：
- ❌ Edge Runtime 不支持 `fs` 模块
- ❌ 本地开发时 API 返回 500 错误
- ❌ 数据无法读取和保存

### 解决方案
将本地开发需要的 API 路由改为 **Node.js Runtime**（注释掉 `export const runtime = 'edge'`）：

#### 已修改的路由
- ✅ `/api/students` 
- ✅ `/api/students/[id]`
- ✅ `/api/interviews`
- ✅ `/api/interviews/[id]`
- ✅ `/api/interviews/categories`
- ✅ `/api/microservices/students`
- ✅ `/api/microservices/students/[id]`
- ✅ `/api/microservices/classes`
- ✅ `/api/microservices/classes/[id]`
- ✅ `/api/bff/students/age-groups`
- ✅ `/api/bff/classes`
- ✅ `/api/bff/classes/[id]`
- ✅ `/api/bff/dashboard`

## 数据文件位置
```
src/data/db.json
```

## 自动环境切换逻辑
```typescript
const env = process.env as any;
const hasD1 = env.DB !== undefined;

if (hasD1) {
  // 生产环境：使用 D1 数据库
  const store = new D1StudentStore(env.DB);
} else {
  // 本地开发：使用 JSON 文件存储
  const students = await memoryStudentStore.getAll();
}
```

## 部署到 Cloudflare 时
Cloudflare Workers 会自动提供 `env.DB` 绑定，代码会自动切换到 D1 数据库，无需修改任何代码。

## 测试验证
1. 启动开发服务器：`pnpm dev`
2. 访问 http://localhost:3000/students
3. 添加/修改数据
4. 重启服务器，数据应该保持不变
5. 检查 `src/data/db.json` 文件，应该能看到数据更新
