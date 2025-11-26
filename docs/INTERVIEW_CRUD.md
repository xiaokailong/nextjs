# 面试题 CRUD 功能文档

## 概述

本系统实现了面试题的完整 CRUD（创建、读取、更新、删除）功能，支持本地开发使用 Mock 数据和生产环境使用 Cloudflare D1 数据库。

## 架构设计

### 数据流向

```
本地开发:
客户端 → API Routes → Memory Store (Mock Data) → 响应

生产环境:
客户端 → API Routes → D1 Store → Cloudflare D1 数据库 → 响应
```

### 核心组件

#### 1. 数据库层

**D1 数据库迁移** (`migrations/0003_create_interview_questions.sql`)
- 创建 `interview_categories` 表：存储面试题分类
- 创建 `interview_questions` 表：存储面试题内容
- 建立外键关系和索引
- 插入初始示例数据

**表结构:**

```sql
-- 分类表
CREATE TABLE interview_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  count INTEGER DEFAULT 0,
  created_at DATETIME,
  updated_at DATETIME
);

-- 面试题表
CREATE TABLE interview_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard')),
  tags TEXT, -- JSON array
  content TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at DATETIME,
  updated_at DATETIME
);
```

#### 2. 数据访问层

**D1InterviewStore** (`src/lib/d1InterviewStore.ts`)
- 封装所有 D1 数据库操作
- 提供类型安全的接口
- 自动管理分类计数

**MemoryInterviewStore** (`src/lib/mockDatabase.ts`)
- 本地开发用的内存数据库
- 与 D1Store 接口保持一致
- 预置示例数据

主要方法:
- `getAllCategories()` - 获取所有分类
- `getAllQuestions()` - 获取所有面试题
- `getQuestionsByCategory(category)` - 按分类获取
- `getQuestionById(id)` - 获取单个题目
- `createQuestion(input)` - 创建新题目
- `updateQuestion(id, input)` - 更新题目
- `deleteQuestion(id)` - 删除题目
- `searchQuestions(query)` - 搜索题目

#### 3. API 路由层

**分类 API** (`src/app/api/interviews/categories/route.ts`)
```
GET /api/interviews/categories - 获取所有分类
```

**面试题列表 API** (`src/app/api/interviews/route.ts`)
```
GET /api/interviews - 获取所有面试题
GET /api/interviews?category=javascript - 按分类过滤
GET /api/interviews?search=闭包 - 搜索题目
POST /api/interviews - 创建新面试题
```

**单个面试题 API** (`src/app/api/interviews/[id]/route.ts`)
```
GET /api/interviews/[id] - 获取单个面试题
PUT /api/interviews/[id] - 更新面试题
DELETE /api/interviews/[id] - 删除面试题
```

#### 4. 前端展示层

**主页** (`src/app/page.tsx`)
- 从 API 动态加载数据
- 支持实时搜索和过滤
- 按分类组织展示
- 响应式布局

## API 使用示例

### 1. 获取所有面试题

```typescript
// 获取所有题目
const response = await fetch('/api/interviews');
const questions = await response.json();

// 按分类过滤
const response = await fetch('/api/interviews?category=javascript');
const jsQuestions = await response.json();

// 搜索题目
const response = await fetch('/api/interviews?search=闭包');
const results = await response.json();
```

### 2. 创建新面试题

```typescript
const newQuestion = {
  title: '什么是防抖和节流？',
  category: 'javascript',
  difficulty: 'medium',
  tags: ['防抖', '节流', '性能优化'],
  content: '请解释防抖和节流的概念及其应用场景',
  answer: '防抖是延迟执行...'
};

const response = await fetch('/api/interviews', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newQuestion)
});

const created = await response.json();
```

### 3. 更新面试题

```typescript
const updates = {
  title: '更新后的标题',
  difficulty: 'hard'
};

const response = await fetch('/api/interviews/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(updates)
});

const updated = await response.json();
```

### 4. 删除面试题

```typescript
const response = await fetch('/api/interviews/1', {
  method: 'DELETE'
});

const result = await response.json();
// { success: true, message: 'Question deleted successfully', question: {...} }
```

## 本地开发

### 1. 启动开发服务器

```bash
pnpm dev
```

系统会自动使用 `memoryInterviewStore` 提供的 Mock 数据。

### 2. 测试 API

使用浏览器或 Postman 测试:

```bash
# 获取所有题目
http://localhost:3000/api/interviews

# 获取所有分类
http://localhost:3000/api/interviews/categories

# 获取单个题目
http://localhost:3000/api/interviews/1

# 搜索
http://localhost:3000/api/interviews?search=React
```

### 3. 开发新功能

Mock 数据存储在内存中，服务器重启后会重置。适合快速开发和测试。

## 生产部署

### 1. 执行数据库迁移

```bash
# 应用所有迁移
pnpm run db:migrate

# 或手动执行单个迁移
npx wrangler d1 execute DB --file=./migrations/0003_create_interview_questions.sql
```

### 2. 验证数据库

```bash
# 查看分类
npx wrangler d1 execute DB --command="SELECT * FROM interview_categories"

# 查看面试题
npx wrangler d1 execute DB --command="SELECT * FROM interview_questions"

# 统计数量
npx wrangler d1 execute DB --command="SELECT COUNT(*) as total FROM interview_questions"
```

### 3. 部署到 Cloudflare

```bash
pnpm run deploy
```

部署后，系统会自动使用 D1 数据库。

### 4. 测试生产 API

```bash
# 测试你的生产域名
https://your-domain.pages.dev/api/interviews
https://your-domain.pages.dev/api/interviews/categories
```

## 数据管理

### 添加更多示例数据

创建脚本 `scripts/seed-interviews.sql`:

```sql
INSERT INTO interview_questions (title, category, difficulty, tags, content, answer) VALUES
  (
    'Vue 3 Composition API',
    'vue',
    'medium',
    '["Vue3", "Composition API", "响应式"]',
    '请介绍 Vue 3 Composition API 的特点',
    'Composition API 提供了更好的逻辑复用...'
  );
```

执行:
```bash
npx wrangler d1 execute DB --file=./scripts/seed-interviews.sql
```

### 更新分类计数

计数会自动更新，但如果需要手动修复:

```sql
UPDATE interview_categories 
SET count = (
  SELECT COUNT(*) FROM interview_questions 
  WHERE category = interview_categories.id
);
```

### 数据备份

```bash
# 导出数据
npx wrangler d1 export DB --output=backup.sql

# 恢复数据
npx wrangler d1 execute DB --file=backup.sql
```

## 类型定义

```typescript
interface InterviewQuestion {
  id: string;
  title: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  content: string;
  answer: string;
}

interface InterviewCategory {
  id: string;
  name: string;
  icon?: string;
  count: number;
}

interface CreateInterviewQuestionInput {
  title: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  content: string;
  answer: string;
}

interface UpdateInterviewQuestionInput {
  title?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  content?: string;
  answer?: string;
}
```

## 性能优化

1. **数据库索引**: 已在 category 和 difficulty 字段上创建索引
2. **Edge Runtime**: API 路由使用 Edge Runtime，全球低延迟
3. **前端缓存**: 使用 React state 缓存数据，减少 API 调用
4. **懒加载**: 大列表可以考虑实现分页或虚拟滚动

## 安全性

1. **输入验证**: API 层验证所有输入参数
2. **类型检查**: 使用 TypeScript 确保类型安全
3. **SQL 注入防护**: 使用参数化查询
4. **错误处理**: 完善的错误处理和用户提示

## 扩展建议

### 1. 添加用户认证

```typescript
// 在 API 路由中添加认证中间件
import { verifyAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const user = await verifyAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // ...
}
```

### 2. 添加评论功能

```sql
CREATE TABLE interview_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER NOT NULL,
  user_id TEXT,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES interview_questions(id)
);
```

### 3. 添加收藏功能

```sql
CREATE TABLE interview_favorites (
  user_id TEXT NOT NULL,
  question_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, question_id),
  FOREIGN KEY (question_id) REFERENCES interview_questions(id)
);
```

### 4. 添加标签管理

```sql
CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE question_tags (
  question_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (question_id, tag_id),
  FOREIGN KEY (question_id) REFERENCES interview_questions(id),
  FOREIGN KEY (tag_id) REFERENCES tags(id)
);
```

## 故障排查

### 问题：API 返回 500 错误

1. 检查数据库迁移是否执行
2. 验证环境变量配置
3. 查看服务器日志

### 问题：本地开发看不到数据

1. 确认 `memoryInterviewStore` 已正确初始化
2. 检查 API 路由是否正确返回 Mock 数据
3. 查看浏览器控制台错误

### 问题：生产环境数据不同步

1. 验证 D1 绑定配置
2. 检查迁移是否在生产环境执行
3. 使用 Wrangler CLI 直接查询数据库

## 总结

该 CRUD 系统提供了:

✅ 完整的增删改查功能
✅ 本地 Mock 数据支持
✅ 生产环境 D1 数据库支持
✅ 类型安全的 API
✅ 良好的错误处理
✅ 易于扩展的架构

开发体验优秀，部署简单，适合快速迭代和生产使用。
