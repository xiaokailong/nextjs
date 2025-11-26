# Next.js 项目

基于 Next.js 16 的全栈应用，使用 Cloudflare D1 数据库，包含学生管理和面试题管理功能。

## 🚀 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器（本地使用 JSON 文件存储）
pnpm dev

# 访问应用
open http://localhost:3000
```

## 📚 文档目录

所有项目文档已整理到 [`docs/`](./docs) 文件夹：

### 🎯 快速入门
- [QUICKSTART.md](./docs/QUICKSTART.md) - 快速开始指南
- [SECURITY_SETUP.md](./docs/SECURITY_SETUP.md) - 安全设置指南（新团队成员必读）

### 🔐 安全与部署
- [DATABASE_SECURITY.md](./docs/DATABASE_SECURITY.md) - 数据库安全最佳实践
- [DEPLOYMENT_CHECKLIST.md](./docs/DEPLOYMENT_CHECKLIST.md) - 部署前检查清单
- [CLOUDFLARE_DEPLOYMENT.md](./docs/CLOUDFLARE_DEPLOYMENT.md) - Cloudflare 部署详细指南

### 💾 数据库
- [DATABASE_QUICK_REFERENCE.md](./docs/DATABASE_QUICK_REFERENCE.md) - 数据库快速参考
- [DATABASE_MIGRATION_SUMMARY.md](./docs/DATABASE_MIGRATION_SUMMARY.md) - 数据库迁移总结
- [D1_SETUP.md](./docs/D1_SETUP.md) - D1 数据库设置
- [JSON_STORAGE.md](./docs/JSON_STORAGE.md) - JSON 存储说明

### 🏗️ 架构设计
- [BFF_ARCHITECTURE.md](./docs/BFF_ARCHITECTURE.md) - BFF 架构说明
- [BFF_MICROSERVICES_ARCHITECTURE.md](./docs/BFF_MICROSERVICES_ARCHITECTURE.md) - BFF 微服务架构
- [BFF_WORK.md](./docs/BFF_WORK.md) - BFF 工作原理

### 📖 功能文档
- [INTERVIEW_README.md](./docs/INTERVIEW_README.md) - 面试题功能说明
- [INTERVIEW_CRUD.md](./docs/INTERVIEW_CRUD.md) - 面试题 CRUD 操作
- [API_USAGE.md](./docs/API_USAGE.md) - API 使用指南
- [ADMIN_GUIDE.md](./docs/ADMIN_GUIDE.md) - 管理员指南

### 🔧 开发相关
- [LOCAL_DEV_SETUP.md](./docs/LOCAL_DEV_SETUP.md) - 本地开发配置
- [DEPLOYMENT.md](./docs/DEPLOYMENT.md) - 部署说明

## 🗄️ 数据库架构

项目使用两个独立的 Cloudflare D1 数据库：

- **students-db** (`DB`) - 学生和班级数据
- **interview-db** (`INTERVIEW_DB`) - 面试题数据

本地开发时使用 JSON 文件存储（`src/data/db.json`）。

## 🛠️ 主要技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **UI**: React 19, Tailwind CSS, HeroUI
- **数据库**: Cloudflare D1 (生产) / JSON (开发)
- **部署**: Cloudflare Pages
- **编辑器**: TipTap (富文本)

## 📦 可用脚本

```bash
# 开发
pnpm dev              # 启动开发服务器

# 构建
pnpm build            # 构建生产版本

# 数据库
pnpm db:migrate       # 迁移所有数据库（远程）
pnpm db:migrate:local # 迁移所有数据库（本地）

# 部署
pnpm deploy           # 构建并部署到 Cloudflare Pages
```

## 🔒 安全注意事项

⚠️ **重要**: 
- `wrangler.toml` 包含数据库 ID，已添加到 `.gitignore`
- 使用 `wrangler.toml.example` 作为配置模板
- 查看 [SECURITY_SETUP.md](./docs/SECURITY_SETUP.md) 了解完整的安全设置

## 📄 许可证

详见 [LICENSE](./LICENSE) 文件。
