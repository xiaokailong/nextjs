# 数据库快速参考

## 🗄️ 数据库信息

| 数据库 | 绑定名称 | 数据库 ID | 用途 |
|--------|----------|-----------|------|
| `students-db` | `DB` | `${STUDENTS_DB_ID}` | 学生和班级数据 |
| `interview-db` | `INTERVIEW_DB` | `${INTERVIEW_DB_ID}` | 面试题数据 |

**获取你的数据库 ID**：
```bash
wrangler d1 list
```

## 📁 表结构

### students-db
- `students` - 学生信息
- `classes` - 班级信息

### interview-db
- `interview_questions` - 面试题
- `interview_categories` - 面试题分类

## 🔌 代码中的使用

### Students API
```typescript
const env = process.env as any;
if (env.DB) {
  const store = new D1StudentStore(env.DB);
}
```

### Interviews API
```typescript
const env = process.env as any;
if (env.INTERVIEW_DB) {
  const store = new D1InterviewStore(env.INTERVIEW_DB);
}
```

## 🛠️ 常用命令

### 迁移数据库
```bash
pnpm run db:migrate              # 迁移所有
pnpm run db:migrate:students     # 仅学生数据库
pnpm run db:migrate:interview    # 仅面试题数据库
```

### 重置数据库
```bash
pnpm run db:reset                # 重置所有
pnpm run db:reset:students       # 仅学生数据库
pnpm run db:reset:interview      # 仅面试题数据库
```

### 查看数据库
```bash
# 设置环境变量（处理 SSL 问题）
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'

# 查看所有数据库
npx wrangler d1 list

# 查看表
npx wrangler d1 execute students-db --remote --command="SELECT name FROM sqlite_master WHERE type='table';"
npx wrangler d1 execute interview-db --remote --command="SELECT name FROM sqlite_master WHERE type='table';"
```

## 📂 迁移文件位置

```
migrations/
├── 0001_create_students.sql           # 学生表
├── 0002_add_classes.sql               # 班级表
├── 0003_create_interview_questions.sql # ⚠️ 已废弃
└── interview/
    └── 0001_create_interview_tables.sql # ✅ 面试题表（新）
```

## 🚀 部署

```bash
# 一键部署
.\deploy.ps1

# 或手动部署
pnpm run build
npx wrangler pages deploy .next
```

## 📚 相关文档

- `DATABASE_MIGRATION_SUMMARY.md` - 迁移完整总结
- `CLOUDFLARE_DEPLOYMENT.md` - 部署详细指南
- `LOCAL_DEV_SETUP.md` - 本地开发配置
