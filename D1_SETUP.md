# Cloudflare D1 数据库设置指南

## 1. 创建 D1 数据库

在本地或 Cloudflare 控制台创建数据库：

```bash
# 使用 wrangler CLI 创建数据库
npx wrangler d1 create students-db
```

这会返回数据库 ID，类似于：
```
✅ Successfully created DB 'students-db'!

[[d1_databases]]
binding = "DB"
database_name = "students-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

## 2. 更新 wrangler.toml

将返回的 `database_id` 复制到 `wrangler.toml` 文件中。

## 3. 运行数据库迁移

```bash
# 本地开发环境
npx wrangler d1 execute students-db --local --file=./migrations/0001_create_students.sql

# 生产环境
npx wrangler d1 execute students-db --remote --file=./migrations/0001_create_students.sql
```

## 4. 在 Cloudflare Pages 配置绑定

1. 进入 Cloudflare Dashboard
2. 选择你的 Pages 项目
3. 进入 **Settings** > **Functions** > **D1 database bindings**
4. 添加绑定：
   - Variable name: `DB`
   - D1 database: `students-db`

## 5. 本地开发

对于本地开发，需要使用 `--local` 标志：

```bash
npx wrangler pages dev .next/standalone --binding DB=students-db --d1=students-db
```

或者使用 Next.js 开发服务器（需要配置环境变量模拟）。

## 6. 部署

推送代码到 GitHub，Cloudflare Pages 会自动部署。确保在 Cloudflare 控制台配置了 D1 绑定。

## 常用命令

```bash
# 查看数据库列表
npx wrangler d1 list

# 执行 SQL 查询（本地）
npx wrangler d1 execute students-db --local --command="SELECT * FROM students"

# 执行 SQL 查询（远程）
npx wrangler d1 execute students-db --remote --command="SELECT * FROM students"
```
