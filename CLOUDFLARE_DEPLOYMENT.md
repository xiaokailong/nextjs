# Cloudflare 部署指南

## ✅ 部署前准备（已完成）

### 1. 代码清理
- ✅ 移除所有调试注释代码
- ✅ 清理 API 路由中的临时注释

### 2. D1 数据库初始化
- ✅ 数据库名称：`students-db`
- ✅ 数据库 ID：`43d7dda4-8ee5-4918-933b-56eab744037c`
- ✅ 已创建表：
  - `students` (7 行数据)
  - `classes` (2 行数据)
  - `interview_questions` (3 行数据)
  - `interview_categories` (8 行数据)

## 🚀 部署步骤

### 方式一：使用脚本部署（推荐）

```bash
# 如果遇到 SSL 证书问题，先设置环境变量
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'

# 构建并部署
pnpm run deploy
```

### 方式二：分步部署

```bash
# 1. 构建 Next.js 应用
pnpm run build

# 2. 部署到 Cloudflare Pages
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'
npx wrangler pages deploy .next
```

## 📋 部署后验证

### 1. 检查数据库连接
访问部署后的网站，测试以下功能：
- ✅ 访问首页查看面试题列表
- ✅ 访问 `/students` 查看学生列表
- ✅ 添加/编辑/删除数据
- ✅ 检查数据是否正确保存到 D1 数据库

### 2. 检查 API 端点
- `GET /api/interviews` - 获取所有面试题
- `GET /api/students` - 获取所有学生
- `POST /api/students` - 创建新学生
- `PUT /api/students/[id]` - 更新学生
- `DELETE /api/students/[id]` - 删除学生

## 🔧 数据库管理命令

### 查看数据库列表
```bash
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'
npx wrangler d1 list
```

### 查看表结构
```bash
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'
npx wrangler d1 execute students-db --remote --command="SELECT name FROM sqlite_master WHERE type='table';"
```

### 查看数据
```bash
# 查看学生数据
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'
npx wrangler d1 execute students-db --remote --command="SELECT * FROM students;"

# 查看面试题数据
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'
npx wrangler d1 execute students-db --remote --command="SELECT * FROM interview_questions;"
```

### 重置数据库（谨慎使用）
```bash
pnpm run db:reset
```

## 🌐 环境说明

### 本地开发环境
- **Runtime**: Node.js
- **存储**: JSON 文件 (`src/data/db.json`)
- **启动命令**: `pnpm dev`

### 生产环境（Cloudflare）
- **Runtime**: 自动检测（Cloudflare Workers）
- **存储**: D1 数据库
- **自动切换**: 代码检测到 `env.DB` 时自动使用 D1

## ⚠️ 注意事项

### SSL 证书问题
如果在中国大陆网络环境下遇到 SSL 证书错误，需要在命令前添加：
```bash
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'
```

### 数据库绑定
确保 `wrangler.toml` 中的数据库配置正确：
```toml
[[d1_databases]]
binding = "DB"
database_name = "students-db"
database_id = "43d7dda4-8ee5-4918-933b-56eab744037c"
```

### 兼容性标志
```toml
compatibility_flags = ["nodejs_compat"]
```
这个标志确保 Node.js API 在 Cloudflare Workers 中可用。

## 📝 Package.json 脚本说明

```json
{
  "deploy": "next build && npx wrangler pages deploy .next",
  "db:migrate": "运行所有迁移脚本（远程）",
  "db:migrate:local": "运行所有迁移脚本（本地）",
  "db:reset": "重置数据库并重新迁移"
}
```

## 🎉 完成！

数据库已经初始化完成，现在可以部署到 Cloudflare Pages 了！

部署后，您的应用将：
- ✅ 自动使用 D1 数据库存储数据
- ✅ 在全球边缘节点运行（高性能）
- ✅ 享受 Cloudflare 的免费配额
- ✅ 自动 HTTPS 和 CDN 加速
