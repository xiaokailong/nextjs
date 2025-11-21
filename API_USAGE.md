# 学生 CRUD API 使用文档

## 部署到 Cloudflare Pages

### 1. 推送代码到 GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

### 2. Cloudflare Pages 部署配置
- Framework preset: **Next.js**
- Build command: `npm run build`
- Build output directory: `.next`
- Environment variables (可选):
  - `NODE_VERSION`: `18` 或 `20`

### 3. 部署后你会得到一个地址
```
https://你的项目名.pages.dev
```

---

## 跨域调用示例

部署后，你可以在**任何前端项目**中调用这些 API：

### React / Vue / 原生 JS 示例

```javascript
// 配置 API 基础地址
const API_BASE_URL = 'https://你的项目名.pages.dev/api';

// 1. 获取所有学生
async function getStudents() {
  const res = await fetch(`${API_BASE_URL}/students`);
  const data = await res.json();
  console.log(data.data); // 学生列表
}

// 2. 获取单个学生
async function getStudent(id) {
  const res = await fetch(`${API_BASE_URL}/students/${id}`);
  const data = await res.json();
  console.log(data.data); // 学生详情
}

// 3. 创建学生
async function createStudent() {
  const res = await fetch(`${API_BASE_URL}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: '测试学生',
      age: 20,
      grade: '大一',
      email: 'test@example.com'
    })
  });
  const data = await res.json();
  console.log(data.data); // 新创建的学生
}

// 4. 更新学生
async function updateStudent(id) {
  const res = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      age: 21,
      email: 'newemail@example.com'
    })
  });
  const data = await res.json();
  console.log(data.data); // 更新后的学生
}

// 5. 删除学生
async function deleteStudent(id) {
  const res = await fetch(`${API_BASE_URL}/students/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  console.log(data.message); // "删除成功"
}
```

### Axios 示例

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://你的项目名.pages.dev/api',
  headers: { 'Content-Type': 'application/json' }
});

// 获取所有学生
const { data } = await api.get('/students');
console.log(data.data);

// 创建学生
const { data: newStudent } = await api.post('/students', {
  name: '张三',
  age: 18,
  grade: '高一'
});

// 更新学生
await api.put('/students/1', { age: 19 });

// 删除学生
await api.delete('/students/1');
```

### React Hook 示例

```typescript
import { useState, useEffect } from 'react';

const API_BASE = 'https://你的项目名.pages.dev/api';

function StudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/students`)
      .then(res => res.json())
      .then(data => setStudents(data.data));
  }, []);

  const handleCreate = async () => {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: '新学生',
        age: 18,
        grade: '高一'
      })
    });
    const data = await res.json();
    setStudents([...students, data.data]);
  };

  const handleDelete = async (id) => {
    await fetch(`${API_BASE}/students/${id}`, { method: 'DELETE' });
    setStudents(students.filter(s => s.id !== id));
  };

  return (
    <div>
      <button onClick={handleCreate}>添加学生</button>
      <ul>
        {students.map(student => (
          <li key={student.id}>
            {student.name} - {student.age}岁 - {student.grade}
            <button onClick={() => handleDelete(student.id)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## API 响应格式

所有成功响应：
```json
{
  "success": true,
  "data": { ... }
}
```

所有错误响应：
```json
{
  "success": false,
  "error": "错误信息"
}
```

---

## CORS 配置说明

当前配置允许以下来源的跨域请求：
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:5173` (Vite)
- `http://localhost:5174`
- `http://localhost:8080`

### 添加生产域名

编辑 `src/lib/cors.ts`，在 `ALLOWED_ORIGINS` 数组中添加你的生产域名：

```typescript
const ALLOWED_ORIGINS = [
  // ... 现有配置
  'https://yourapp.com',
  'https://www.yourapp.com',
];
```

### 允许所有来源（不推荐用于生产）

如果要允许任何域名访问，可以修改 `src/lib/cors.ts`：

```typescript
export function setCorsHeaders(response: NextResponse, origin?: string | null): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  // ... 其他配置
}
```

---

## 注意事项

1. **数据持久化**：当前使用内存存储，重启后数据会丢失。生产环境建议接入数据库（Cloudflare D1、Supabase 等）。

2. **安全性**：如果需要身份验证，建议添加 API Token 或 JWT 认证。

3. **限流**：生产环境建议添加 API 限流保护。

4. **环境变量**：可在 Cloudflare Pages 设置页面添加环境变量来区分开发/生产环境。

---

## 测试 API

部署后可以使用以下工具测试：
- Postman
- Thunder Client (VS Code 扩展)
- curl 命令行
- 浏览器开发者工具

示例 curl：
```bash
# 获取所有学生
curl https://你的项目名.pages.dev/api/students

# 创建学生
curl -X POST https://你的项目名.pages.dev/api/students \
  -H "Content-Type: application/json" \
  -d '{"name":"测试","age":18,"grade":"高一"}'
```
