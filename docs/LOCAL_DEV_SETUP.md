# 本地开发配置说明

## 数据访问方案

本项目的本地开发环境直接连接生产环境 API，不再使用本地 JSON 文件存储。

### 本地开发环境
- **数据来源**：生产环境 API（`https://velen-nextjs.pages.dev`）
- **配置方式**：通过 `.env.local` 文件配置
- **优点**：
  - 使用真实生产数据
  - 无需维护本地数据库
  - 开发环境与生产环境一致

### 生产环境
- **存储方式**：Cloudflare D1 数据库
- **Runtime**：Edge Runtime
- **优点**：高性能边缘计算

## 配置步骤

### 1. 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# 使用生产环境 API
NEXT_PUBLIC_API_BASE_URL=https://velen-nextjs.pages.dev
```

### 2. 启动开发服务器

```bash
pnpm dev
```

现在访问 http://localhost:3000，所有 API 调用都会请求生产环境。

## API 路由说明

所有 API 路由都支持自动环境切换：

```typescript
const env = process.env as any;
const hasD1 = env.DB !== undefined;

if (hasD1) {
  // 生产环境：使用 D1 数据库
  const store = new D1StudentStore(env.DB);
} else {
  // 本地开发：返回错误，提示使用生产 API
  throw new Error('Please use production API');
}
```

## 相关文档

- [DEV_WITH_PRODUCTION_API.md](./DEV_WITH_PRODUCTION_API.md) - 详细的生产 API 使用指南
- [SECURITY_SETUP.md](./SECURITY_SETUP.md) - 安全配置说明
