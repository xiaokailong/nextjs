# 如何在本地开发时直连生产环境 API

## 快速开始

### 1. 创建 `.env.local` 文件

在项目根目录创建 `.env.local` 文件，添加以下内容：

```bash
# 使用生产环境 API
NEXT_PUBLIC_API_BASE_URL=https://velen-nextjs.pages.dev
```

### 2. 重启开发服务器

```bash
# 停止当前开发服务器 (Ctrl+C)
# 重新启动
pnpm dev
```

### 3. 开始开发

现在所有 API 调用都会直接请求生产环境：
- 本地页面：`http://localhost:3000`
- API 请求：`https://velen-nextjs.pages.dev/api/interviews`

## 切换回本地 mock 数据

### 方法 1：删除或注释环境变量

编辑 `.env.local`：
```bash
# NEXT_PUBLIC_API_BASE_URL=https://velen-nextjs.pages.dev
```

### 方法 2：删除 `.env.local` 文件

直接删除 `.env.local` 文件即可恢复使用本地 API。

## 使用 API 客户端（推荐）

如果要使用封装好的 API 客户端，更新你的代码：

```typescript
import { interviewAPI } from '@/lib/interviewAPI';

// 获取所有分类
const categories = await interviewAPI.getCategories();

// 获取所有面试题
const questions = await interviewAPI.getQuestions();

// 按分类获取
const jsQuestions = await interviewAPI.getQuestions({ category: 'javascript' });

// 搜索
const searchResults = await interviewAPI.getQuestions({ search: 'react' });

// 创建面试题
const newQuestion = await interviewAPI.createQuestion({
  title: '新题目',
  category: 'javascript',
  difficulty: 'medium',
  tags: ['标签'],
  content: '题目内容',
  answer: '答案',
});

// 更新面试题
await interviewAPI.updateQuestion('1', { title: '更新后的标题' });

// 删除面试题
await interviewAPI.deleteQuestion('1');
```

## 或者直接使用 getAPIPath 函数

如果不想重构现有代码，只需在 fetch 调用中包装路径：

```typescript
import { getAPIPath } from '@/config/api.config';

// 原来的代码
// const response = await fetch('/api/interviews');

// 改为
const response = await fetch(getAPIPath('/api/interviews'));
```

## 环境变量说明

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `NEXT_PUBLIC_API_BASE_URL` | 生产环境 API 地址 | `https://velen-nextjs.pages.dev` |

- 设置后：使用远程生产 API
- 未设置或为空：使用本地 API（需要在生产环境或配置 D1 绑定）

## 注意事项

⚠️ **重要**：
1. 直连生产环境会修改真实数据，请谨慎操作
2. 每次修改 `.env.local` 后需要重启开发服务器
3. `.env.local` 已被 `.gitignore` 忽略，不会提交到 Git
