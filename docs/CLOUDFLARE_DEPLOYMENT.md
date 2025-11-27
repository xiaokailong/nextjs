# Cloudflare 部署指南

## ✅ 数据库架构

本项目使用了两个独立的 D1 数据库：

### 1. students-db (学生和班级数据库)
- **数据库 ID**: `${STUDENTS_DB_ID}` (从 wrangler.toml 中获取)
- **绑定名称**: `DB`
- **包含表**:
  - `students` - 学生信息表
  - `classes` - 班级信息表

### 2. interview-db (面试题数据库)
- **数据库 ID**: `${INTERVIEW_DB_ID}` (从 wrangler.toml 中获取)
- **绑定名称**: `INTERVIEW_DB`
- **包含表**:
  - `interview_questions` - 面试题表
  - `interview_categories` - 面试题分类表

## 📋 部署前准备（已完成）

### 1. 代码清理
- ✅ 移除所有调试注释代码
- ✅ 清理 API 路由中的临时注释

### 2. D1 数据库初始化
- ✅ **students-db**: students (7 行), classes (2 行)
- ✅ **interview-db**: interview_questions (3 行), interview_categories (8 行)

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

### 学生数据库 (students-db)

#### 查看表结构
```bash
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'
npx wrangler d1 execute students-db --remote --command="SELECT name FROM sqlite_master WHERE type='table';"
```

#### 查看数据
```bash
# 查看学生数据
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'
npx wrangler d1 execute students-db --remote --command="SELECT * FROM students;"

# 查看班级数据
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'
npx wrangler d1 execute students-db --remote --command="SELECT * FROM classes;"
```

### 面试题数据库 (interview-db)

#### 查看表结构
```bash
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'
npx wrangler d1 execute interview-db --remote --command="SELECT name FROM sqlite_master WHERE type='table';"
```

#### 查看数据
```bash
# 查看面试题数据
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'
npx wrangler d1 execute interview-db --remote --command="SELECT * FROM interview_questions;"

# 查看分类数据
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'
npx wrangler d1 execute interview-db --remote --command="SELECT * FROM interview_categories;"
```

### 数据库迁移脚本

#### 迁移所有数据库
```bash
pnpm run db:migrate
```

#### 单独迁移学生数据库
```bash
pnpm run db:migrate:students
```

#### 单独迁移面试题数据库
```bash
pnpm run db:migrate:interview
```

### 重置数据库（谨慎使用）

#### 重置所有数据库
```bash
pnpm run db:reset
```

#### 单独重置学生数据库
```bash
pnpm run db:reset:students
```

#### 单独重置面试题数据库
```bash
pnpm run db:reset:interview
```

## 🌐 环境说明

### 本地开发环境
- **数据源**: 生产环境 API（`https://velen-nextjs.pages.dev`）
- **配置**: 通过 `.env.local` 文件配置
- **启动命令**: `pnpm dev`

### 生产环境（Cloudflare）
- **Runtime**: 自动检测（Cloudflare Workers）
- **存储**: 
  - 学生/班级 → `students-db` (绑定: `DB`)
  - 面试题 → `interview-db` (绑定: `INTERVIEW_DB`)
- **自动切换**: 代码检测到 `env.DB` 或 `env.INTERVIEW_DB` 时自动使用对应的 D1 数据库

## ⚠️ 注意事项

### SSL 证书问题
如果在中国大陆网络环境下遇到 SSL 证书错误，需要在命令前添加：
```bash
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'
```

### 数据库绑定
确保 `wrangler.toml` 中的数据库配置正确：
```toml
# 学生和班级数据库
[[d1_databases]]
binding = "DB"
database_name = "students-db"
database_id = "YOUR_STUDENTS_DB_ID_HERE"

# 面试题数据库
[[d1_databases]]
binding = "INTERVIEW_DB"
database_name = "interview-db"
database_id = "YOUR_INTERVIEW_DB_ID_HERE"
```

**注意**：
- 使用 `wrangler.toml.example` 作为模板
- 将真实的 `wrangler.toml` 添加到 `.gitignore`
- 数据库 ID 可通过 `wrangler d1 list` 获取

### 兼容性标志
```toml
compatibility_flags = ["nodejs_compat"]
```
这个标志确保 Node.js API 在 Cloudflare Workers 中可用。

## 📝 Package.json 脚本说明

### 部署相关
```json
{
  "deploy": "next build && npx wrangler pages deploy .next"
}
```

### 数据库迁移（远程）
```json
{
  "db:migrate": "迁移所有数据库",
  "db:migrate:students": "仅迁移学生数据库",
  "db:migrate:interview": "仅迁移面试题数据库"
}
```

### 数据库迁移（本地）
```json
{
  "db:migrate:local": "本地迁移所有数据库",
  "db:migrate:local:students": "本地迁移学生数据库",
  "db:migrate:local:interview": "本地迁移面试题数据库"
}
```

### 数据库重置
```json
{
  "db:reset": "重置所有数据库",
  "db:reset:students": "重置学生数据库",
  "db:reset:interview": "重置面试题数据库"
}
```

## 🎉 完成！

数据库已经初始化完成，现在可以部署到 Cloudflare Pages 了！

部署后，您的应用将：
- ✅ 自动使用 D1 数据库存储数据
- ✅ 在全球边缘节点运行（高性能）
- ✅ 享受 Cloudflare 的免费配额
- ✅ 自动 HTTPS 和 CDN 加速
