# 面试题管理界面使用指南

## 🎯 功能概览

新增了完整的前端管理界面，支持：
- ✅ 可视化添加面试题
- ✅ 富文本编辑器（支持图片、视频、代码块）
- ✅ 编辑已有题目
- ✅ 删除题目（带确认弹窗）
- ✅ 实时预览
- ✅ 搜索和筛选

## 📦 新增组件

### 1. RichTextEditor（富文本编辑器）
位置：`src/components/RichTextEditor.tsx`

**功能特性：**
- 📝 格式化工具栏（粗体、斜体、标题等）
- 🖼️ 插入图片（URL）
- 🎥 插入 YouTube 视频
- 💻 代码块（支持语法高亮）
- 📋 列表、引用、分隔线
- ↶↷ 撤销/重做

**使用示例：**
```tsx
import RichTextEditor from '@/components/RichTextEditor';

<RichTextEditor
  content={content}
  onChange={(html) => setContent(html)}
  placeholder="请输入内容..."
/>
```

### 2. QuestionFormModal（题目表单弹窗）
位置：`src/components/QuestionFormModal.tsx`

**功能：**
- 添加新题目
- 编辑现有题目
- 表单验证
- 标签管理

**Props：**
```typescript
interface QuestionFormModalProps {
  isOpen: boolean;           // 是否打开
  onClose: () => void;       // 关闭回调
  onSuccess: () => void;     // 成功回调
  question?: InterviewQuestion | null;  // 编辑的题目（null为新建）
  categories: InterviewCategory[];      // 分类列表
}
```

### 3. DeleteConfirmModal（删除确认弹窗）
位置：`src/components/DeleteConfirmModal.tsx`

**功能：**
- 显示要删除的题目信息
- 确认删除操作
- 防止误删

### 4. Admin Page（管理页面）
位置：`src/app/admin/page.tsx`

完整的管理界面，集成所有 CRUD 功能。

## 🚀 使用方法

### 访问管理页面

1. **从首页进入**
   - 点击左上角的 "⚙️ 管理" 按钮
   - 或直接访问：http://localhost:3000/admin

2. **管理页面功能**
   ```
   /admin
   ├── 顶部工具栏
   │   ├── 搜索框（搜索题目和标签）
   │   └── "添加面试题" 按钮
   └── 题目列表
       ├── 每个题目卡片显示
       │   ├── 难度标签
       │   ├── 分类标签
       │   ├── 题目标题
       │   ├── 标签列表
       │   ├── 内容预览
       │   └── 操作按钮（编辑、删除）
   ```

### 添加新题目

1. 点击 "✚ 添加面试题" 按钮
2. 填写表单：
   - **标题**：输入题目标题
   - **分类**：选择分类（JavaScript、React、CSS 等）
   - **难度**：选择难度（简单、中等、困难）
   - **标签**：输入标签后按回车或点击"添加"
   - **题目描述**：使用富文本编辑器编写
   - **参考答案**：使用富文本编辑器编写
3. 点击 "创建" 保存

### 编辑题目

1. 在题目卡片上点击 "✏️ 编辑" 按钮
2. 修改表单内容
3. 点击 "保存" 更新

### 删除题目

1. 在题目卡片上点击 "🗑️ 删除" 按钮
2. 在确认弹窗中查看题目信息
3. 点击 "确认删除" 完成删除

## 🎨 富文本编辑器使用

### 基础格式化

| 功能 | 快捷键 | 说明 |
|------|--------|------|
| **粗体** | - | 加粗文字 |
| *斜体* | - | 倾斜文字 |
| `代码` | - | 行内代码 |
| H1/H2/H3 | - | 标题 |

### 插入图片

1. 点击工具栏的 "🖼️ 图片" 按钮
2. 输入图片 URL（例如：https://example.com/image.jpg）
3. 确认插入

**示例 URL：**
```
https://via.placeholder.com/600x400
https://picsum.photos/800/600
```

### 插入视频

1. 点击工具栏的 "🎥 视频" 按钮
2. 输入 YouTube 视频 URL
3. 确认插入

**支持的格式：**
```
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
```

### 插入代码块

1. 点击工具栏的 "代码块" 按钮
2. 输入代码
3. 支持语法高亮

**示例：**
```javascript
function hello() {
  console.log('Hello, World!');
}
```

### 列表和引用

- **无序列表**：点击 "• 列表" 按钮
- **有序列表**：点击 "1. 列表" 按钮
- **引用**：点击 "引用" 按钮

### 其他功能

- **分隔线**：点击 "─ 分隔线" 插入水平线
- **撤销**：点击 "↶ 撤销" 或 Ctrl+Z
- **重做**：点击 "↷ 重做" 或 Ctrl+Y

## 📝 编辑器快速示例

### 创建一个完整的面试题

**题目标题：**
```
React Hooks 的使用规则和最佳实践
```

**分类：** React  
**难度：** 中等  
**标签：** Hooks, useState, useEffect, 最佳实践

**题目描述（使用富文本）：**

```
请回答以下关于 React Hooks 的问题：

1. Hooks 的三大使用规则是什么？
2. 为什么 Hooks 不能在条件语句中调用？
3. 如何自定义 Hook？

请结合代码示例说明。
```

**参考答案（使用富文本）：**

```
### Hooks 使用规则

**1. 只在最顶层调用 Hooks**
不要在循环、条件或嵌套函数中调用 Hooks。

**2. 只在 React 函数中调用 Hooks**
在 React 函数组件或自定义 Hook 中调用。

**3. 遵循命名规范**
自定义 Hook 必须以 "use" 开头。

### 代码示例

// ✅ 正确用法
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);
  
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// ❌ 错误用法 - 在条件中调用
function BadComponent() {
  if (condition) {
    const [value, setValue] = useState(0); // 错误！
  }
}

### 为什么不能在条件中调用？

React 依赖 Hooks 的调用顺序来维护状态。条件调用会破坏这个顺序，导致状态错乱。
```

## 🎯 实际使用场景

### 场景 1：批量导入题目

如果你有现成的题目，可以：

1. **通过 API 批量创建**（推荐生产环境）
```bash
# 准备 JSON 文件
cat questions.json
[
  {
    "title": "题目1",
    "category": "javascript",
    "difficulty": "easy",
    "tags": ["标签1"],
    "content": "<p>内容</p>",
    "answer": "<p>答案</p>"
  }
]

# 使用脚本批量导入
node scripts/import-questions.js
```

2. **通过管理界面逐个添加**（推荐本地开发）

### 场景 2：更新现有题目

1. 在管理页面搜索题目
2. 点击编辑按钮
3. 使用富文本编辑器美化内容
4. 添加图片或代码示例
5. 保存更新

### 场景 3：内容迁移

从旧的纯文本格式迁移到富文本：

**旧格式（纯文本）：**
```
什么是闭包？

答案：
闭包是指函数能够访问其词法作用域外部的变量。

示例代码：
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count
  };
}
```

**新格式（富文本）：**
- 使用标题分隔问题和答案
- 代码块自动高亮
- 可以添加说明图片
- 支持列表和引用

## 🛠️ 技术栈

### 依赖包

```json
{
  "@tiptap/react": "^3.11.0",
  "@tiptap/starter-kit": "^3.11.0",
  "@tiptap/extension-image": "^3.11.0",
  "@tiptap/extension-code-block-lowlight": "^3.11.0",
  "@tiptap/extension-youtube": "^3.11.0",
  "lowlight": "^3.3.0",
  "react-hot-toast": "^2.6.0"
}
```

### 核心技术

- **Tiptap**：现代化的富文本编辑器框架
- **Lowlight**：代码语法高亮
- **React Hot Toast**：消息提示
- **HeroUI**：UI 组件库

## 🎨 样式定制

富文本编辑器样式定义在 `src/app/globals.css` 中：

```css
/* 自定义编辑器样式 */
.ProseMirror {
  /* 编辑器容器样式 */
}

.ProseMirror h1 {
  /* 标题样式 */
}

.ProseMirror pre {
  /* 代码块样式 */
}
```

可以根据需要修改这些样式。

## 🔒 安全性

1. **XSS 防护**
   - 使用 `dangerouslySetInnerHTML` 时需要确保内容来源可信
   - 生产环境建议添加内容过滤

2. **权限控制**（待实现）
   - 建议添加用户认证
   - 限制管理页面访问权限

3. **输入验证**
   - 表单已包含基础验证
   - API 层有完整的数据验证

## 📊 数据格式

### HTML 内容存储

题目内容和答案以 HTML 格式存储：

```json
{
  "content": "<h2>问题描述</h2><p>这是一道关于...</p><pre><code>const example = 'code';</code></pre>",
  "answer": "<h3>答案</h3><p>详细解释...</p><img src='...' />"
}
```

### 迁移旧数据

如需将纯文本转换为 HTML：

```javascript
// 简单转换
const htmlContent = plainText
  .split('\n')
  .map(line => `<p>${line}</p>`)
  .join('');

// 或使用编辑器 API
editor.commands.setContent(plainText);
const html = editor.getHTML();
```

## 🚀 最佳实践

### 1. 编写题目内容

- **使用标题**：合理使用 H2、H3 组织结构
- **代码格式化**：使用代码块而不是行内代码
- **添加说明图片**：复杂概念配图说明
- **列表分点**：使用列表让内容更清晰

### 2. 图片使用

- 使用稳定的图床服务
- 推荐尺寸：800x600 或 16:9 比例
- 优化图片大小（建议 < 500KB）

### 3. 视频使用

- 优先使用 YouTube
- 选择高质量的教程视频
- 考虑国内访问性

### 4. 标签管理

- 使用有意义的标签
- 保持标签一致性
- 每个题目 3-5 个标签为宜

## 🐛 故障排查

### 问题：编辑器不显示

**解决方案：**
1. 检查浏览器控制台错误
2. 确认 Tiptap 依赖已安装
3. 清除缓存重新加载

### 问题：图片无法加载

**解决方案：**
1. 检查图片 URL 是否有效
2. 确认图片支持 CORS
3. 使用 HTTPS 链接

### 问题：保存失败

**解决方案：**
1. 检查网络连接
2. 查看浏览器控制台错误
3. 确认表单所有必填项已填写
4. 检查 API 服务是否正常

### 问题：视频无法播放

**解决方案：**
1. 确认使用正确的 YouTube URL
2. 检查视频是否可公开访问
3. 测试视频嵌入权限

## 📖 扩展功能建议

### 1. 添加图片上传

```typescript
// 集成图片上传服务（如 Cloudflare Images）
const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  const { url } = await response.json();
  return url;
};

// 在编辑器中使用
<input 
  type="file" 
  onChange={async (e) => {
    const file = e.target.files[0];
    const url = await uploadImage(file);
    editor.chain().focus().setImage({ src: url }).run();
  }} 
/>
```

### 2. 添加题目导入/导出

```typescript
// 导出为 JSON
const exportQuestions = () => {
  const json = JSON.stringify(questions, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'questions.json';
  a.click();
};

// 导出为 Markdown
const exportToMarkdown = (question: InterviewQuestion) => {
  return `# ${question.title}

**分类**: ${question.category}
**难度**: ${question.difficulty}
**标签**: ${question.tags.join(', ')}

## 题目描述

${htmlToMarkdown(question.content)}

## 参考答案

${htmlToMarkdown(question.answer)}
`;
};
```

### 3. 添加版本控制

跟踪题目修改历史，支持回退。

### 4. 添加协作功能

多人同时编辑，实时同步。

## 🎉 总结

现在你拥有了：
- ✅ 功能完整的管理界面
- ✅ 强大的富文本编辑器
- ✅ 直观的用户体验
- ✅ 完善的错误处理

开始创建精美的面试题库吧！🚀
