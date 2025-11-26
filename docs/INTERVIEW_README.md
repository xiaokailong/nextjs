# 面试题管理系统 - 快速开始

## 🎯 功能概述

完整的面试题 CRUD 系统，支持本地开发和生产环境部署。

- ✅ 完整的增删改查 API
- ✅ 本地开发使用 Mock 数据
- ✅ 生产环境使用 Cloudflare D1 数据库
- ✅ 分类管理和搜索功能
- ✅ 响应式 UI 展示

## 📁 项目结构

```
src/
├── app/
│   ├── api/
│   │   └── interviews/
│   │       ├── route.ts              # 获取列表、创建题目
│   │       ├── [id]/route.ts         # 获取、更新、删除单个题目
│   │       └── categories/route.ts   # 获取分类列表
│   └── page.tsx                      # 首页展示
├── lib/
│   ├── d1InterviewStore.ts          # D1 数据库操作
│   └── mockDatabase.ts              # Mock 数据（含面试题）
├── types/
│   └── interview.ts                 # 类型定义
└── data/
    └── interviewQuestions.ts        # 静态数据（已迁移到 API）

migrations/
└── 0003_create_interview_questions.sql  # 数据库迁移脚本
```

## 🚀 本地开发

### 1. 启动开发服务器

```bash
pnpm install
pnpm dev
```

访问 http://localhost:3000 查看面试题列表。

### 2. 测试 API

```bash
# 获取所有面试题
curl http://localhost:3000/api/interviews

# 获取分类
curl http://localhost:3000/api/interviews/categories

# 搜索
curl http://localhost:3000/api/interviews?search=React

# 按分类过滤
curl http://localhost:3000/api/interviews?category=javascript

# 创建新题目
curl -X POST http://localhost:3000/api/interviews \
  -H "Content-Type: application/json" \
  -d '{
    "title": "测试题目",
    "category": "javascript",
    "difficulty": "easy",
    "tags": ["测试"],
    "content": "这是问题描述",
    "answer": "这是参考答案"
  }'

# 更新题目
curl -X PUT http://localhost:3000/api/interviews/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "更新后的标题"}'

# 删除题目
curl -X DELETE http://localhost:3000/api/interviews/1
```

本地开发使用内存中的 Mock 数据，重启服务器后数据会重置。

## 🗄️ 数据库设置

### 1. 创建 D1 数据库

```bash
npx wrangler d1 create students-db
```

### 2. 配置 wrangler.toml

将返回的 database_id 添加到 `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "students-db"
database_id = "your-database-id-here"
```

### 3. 执行数据库迁移

```bash
# 在远程（生产）执行
npx wrangler d1 execute students-db --remote --file=./migrations/0003_create_interview_questions.sql
```

这会创建以下表：
- `interview_categories` - 面试题分类
- `interview_questions` - 面试题内容

并插入初始示例数据。

### 4. 验证数据

```bash
# 查看分类
npx wrangler d1 execute students-db --remote --command="SELECT * FROM interview_categories"

# 查看面试题
npx wrangler d1 execute students-db --remote --command="SELECT * FROM interview_questions LIMIT 5"

# 统计数量
npx wrangler d1 execute students-db --remote --command="SELECT COUNT(*) as total FROM interview_questions"
```

## 🌐 部署到生产

### 1. 部署应用

```bash
pnpm run deploy
```

### 2. 配置 D1 绑定

在 Cloudflare Dashboard 中：
1. 进入你的 Pages 项目
2. Settings → Functions → D1 database bindings
3. 添加绑定：
   - Variable name: `DB`
   - D1 database: `students-db`

### 3. 测试生产环境

```bash
# 替换为你的域名
curl https://your-domain.pages.dev/api/interviews
curl https://your-domain.pages.dev/api/interviews/categories
```

## 📚 API 文档

### 获取所有分类
```
GET /api/interviews/categories
```

响应:
```json
[
  {
    "id": "javascript",
    "name": "JavaScript 基础",
    "count": 5
  }
]
```

### 获取面试题列表
```
GET /api/interviews
GET /api/interviews?category=javascript
GET /api/interviews?search=闭包
```

响应:
```json
[
  {
    "id": "1",
    "title": "什么是闭包？",
    "category": "javascript",
    "difficulty": "medium",
    "tags": ["闭包", "作用域"],
    "content": "问题描述...",
    "answer": "参考答案..."
  }
]
```

### 创建面试题
```
POST /api/interviews
Content-Type: application/json

{
  "title": "题目标题",
  "category": "javascript",
  "difficulty": "medium",
  "tags": ["标签1", "标签2"],
  "content": "题目描述",
  "answer": "参考答案"
}
```

### 更新面试题
```
PUT /api/interviews/[id]
Content-Type: application/json

{
  "title": "新标题",
  "difficulty": "hard"
}
```

### 删除面试题
```
DELETE /api/interviews/[id]
```

## 🎨 前端功能

### 主页特性

- ✅ 左侧分类导航（可折叠）
- ✅ 实时搜索过滤
- ✅ 按难度标记（简单/中等/困难）
- ✅ 标签展示
- ✅ 题目详情卡片
- ✅ 平滑滚动定位
- ✅ 响应式布局

### 数据流

```
页面加载
  ↓
fetch /api/interviews/categories
  ↓
fetch /api/interviews
  ↓
渲染左侧分类列表
  ↓
渲染题目卡片
  ↓
用户搜索/筛选 → 前端过滤
```

## 🔧 开发工作流

### 添加新题目

1. **本地测试** - 使用 POST API 创建
2. **验证显示** - 检查首页是否正确显示
3. **部署到生产** - push 代码，Cloudflare 自动部署
4. **生产环境创建** - 使用生产 API 或数据库迁移

### 批量导入题目

创建 SQL 文件 `scripts/import-questions.sql`:

```sql
INSERT INTO interview_questions (title, category, difficulty, tags, content, answer) VALUES
  ('题目1', 'javascript', 'easy', '["tag1"]', '内容1', '答案1'),
  ('题目2', 'react', 'medium', '["tag2"]', '内容2', '答案2');
```

执行:
```bash
npx wrangler d1 execute students-db --remote --file=./scripts/import-questions.sql
```

## 📊 数据库架构

### interview_categories
| 字段 | 类型 | 说明 |
|------|------|------|
| id | TEXT | 分类ID（主键） |
| name | TEXT | 分类名称 |
| icon | TEXT | 图标（可选） |
| count | INTEGER | 题目数量 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### interview_questions
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 题目ID（主键） |
| title | TEXT | 题目标题 |
| category | TEXT | 分类（外键） |
| difficulty | TEXT | 难度（easy/medium/hard） |
| tags | TEXT | 标签（JSON数组） |
| content | TEXT | 题目内容 |
| answer | TEXT | 参考答案 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

## 🛠️ 常见问题

### Q: 本地看不到数据？
A: 检查 `src/lib/mockDatabase.ts` 中的 `memoryInterviewStore` 是否有数据。

### Q: 生产环境 API 报错？
A: 
1. 确认数据库迁移已执行
2. 验证 D1 绑定配置
3. 检查 Cloudflare Dashboard 中的日志

### Q: 如何重置本地数据？
A: 重启开发服务器，Mock 数据会自动重置。

### Q: 如何备份生产数据？
A: 
```bash
npx wrangler d1 export students-db --output=backup.sql
```

## 📖 相关文档

- [完整 CRUD 文档](./INTERVIEW_CRUD.md) - 详细的 API 和架构说明
- [D1 设置指南](./D1_SETUP.md) - 数据库配置步骤
- [Next.js 文档](https://nextjs.org/docs)
- [Cloudflare D1 文档](https://developers.cloudflare.com/d1/)

## 🎯 下一步

1. **添加管理界面** - 创建后台管理页面
2. **用户认证** - 限制创建/编辑权限
3. **评论系统** - 允许用户讨论题目
4. **收藏功能** - 用户可以收藏感兴趣的题目
5. **导出功能** - 导出题目为 PDF 或 Markdown

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT
