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

执行所有迁移文件以创建数据库表结构：

```bash
# 本地开发环境
npx wrangler d1 execute students-db --local --file=./migrations/0001_create_students.sql
npx wrangler d1 execute students-db --local --file=./migrations/0002_add_classes.sql
npx wrangler d1 execute students-db --local --file=./migrations/0003_create_interview_questions.sql

# 生产环境（推荐）
npx wrangler d1 execute students-db --remote --file=./migrations/0001_create_students.sql
npx wrangler d1 execute students-db --remote --file=./migrations/0002_add_classes.sql
npx wrangler d1 execute students-db --remote --file=./migrations/0003_create_interview_questions.sql
```

### 数据库表说明

**0001_create_students.sql**
- 创建学生表 (students)
- 字段：id, name, age, grade, email, created_at, updated_at

**0002_add_classes.sql**
- 创建班级表 (classes)
- 字段：id, name, grade, teacher_name, created_at, updated_at

**0003_create_interview_questions.sql**
- 创建面试题分类表 (interview_categories)
- 创建面试题表 (interview_questions)
- 建立索引和外键关系
- 插入示例数据

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

# 查看数据库信息
npx wrangler d1 info students-db

# 执行 SQL 查询（本地）
npx wrangler d1 execute students-db --local --command="SELECT * FROM students"
npx wrangler d1 execute students-db --local --command="SELECT * FROM classes"
npx wrangler d1 execute students-db --local --command="SELECT * FROM interview_questions"

# 执行 SQL 查询（远程）
npx wrangler d1 execute students-db --remote --command="SELECT * FROM students"
npx wrangler d1 execute students-db --remote --command="SELECT * FROM interview_categories"
npx wrangler d1 execute students-db --remote --command="SELECT * FROM interview_questions"

# 统计数据
npx wrangler d1 execute students-db --remote --command="SELECT COUNT(*) as total FROM interview_questions"

# 备份数据库
npx wrangler d1 export students-db --output=backup.sql

# 恢复数据库
npx wrangler d1 execute students-db --file=backup.sql
```

## 7. 数据表概览

### students（学生表）
```sql
CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  grade TEXT NOT NULL,
  email TEXT,
  created_at DATETIME,
  updated_at DATETIME
);
```

### classes（班级表）
```sql
CREATE TABLE classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  teacher_name TEXT,
  created_at DATETIME,
  updated_at DATETIME
);
```

### interview_categories（面试题分类表）
```sql
CREATE TABLE interview_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  count INTEGER DEFAULT 0,
  created_at DATETIME,
  updated_at DATETIME
);
```

### interview_questions（面试题表）
```sql
CREATE TABLE interview_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard')),
  tags TEXT, -- JSON array
  content TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (category) REFERENCES interview_categories(id)
);
```

## 8. 验证设置

部署后，访问以下 API 端点验证数据库是否正常工作：

```bash
# 学生相关
https://your-domain.pages.dev/api/students
https://your-domain.pages.dev/api/students/1

# 班级相关
https://your-domain.pages.dev/api/bff/classes
https://your-domain.pages.dev/api/bff/classes/1

# 面试题相关
https://your-domain.pages.dev/api/interviews
https://your-domain.pages.dev/api/interviews/categories
https://your-domain.pages.dev/api/interviews/1
```
