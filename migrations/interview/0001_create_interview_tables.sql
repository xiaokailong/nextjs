-- 创建面试题分类表
CREATE TABLE IF NOT EXISTS interview_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建面试题表
CREATE TABLE IF NOT EXISTS interview_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK(difficulty IN ('easy', 'medium', 'hard')),
  tags TEXT NOT NULL, -- JSON array stored as text
  content TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category) REFERENCES interview_categories(id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_questions_category ON interview_questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON interview_questions(difficulty);

-- 插入分类数据
INSERT INTO interview_categories (id, name, count) VALUES
  ('javascript', 'JavaScript 基础', 15),
  ('react', 'React', 12),
  ('vue', 'Vue', 8),
  ('css', 'CSS', 10),
  ('network', '网络协议', 5),
  ('performance', '性能优化', 8),
  ('algorithm', '算法与数据结构', 7),
  ('engineering', '工程化', 5);

-- 插入示例面试题数据
INSERT INTO interview_questions (title, category, difficulty, tags, content, answer) VALUES
  (
    '什么是闭包？闭包的应用场景有哪些？',
    'javascript',
    'medium',
    '["闭包", "作用域", "核心概念"]',
    '闭包是 JavaScript 中的一个重要概念。请详细解释：
1. 什么是闭包？
2. 闭包的工作原理
3. 闭包的常见应用场景
4. 闭包可能带来的问题',
    '闭包是指函数能够访问其词法作用域外部的变量。

**工作原理：**
当函数嵌套时，内部函数可以访问外部函数的变量，即使外部函数已经执行完毕。

**应用场景：**
1. 数据私有化/模块化
2. 函数工厂
3. 回调函数和事件处理
4. 防抖节流

**示例代码：**
```javascript
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}
```

**注意事项：**
过度使用闭包可能导致内存泄漏，因为闭包会保持对外部变量的引用。'
  ),
  (
    'React Hooks 的使用规则和原理',
    'react',
    'medium',
    '["Hooks", "useState", "useEffect"]',
    'React Hooks 是 React 16.8 引入的新特性。请回答：
1. Hooks 的使用规则
2. useState 和 useEffect 的工作原理
3. 为什么 Hooks 不能在条件语句中使用？',
    '**Hooks 使用规则：**
1. 只能在函数组件顶层调用
2. 不能在循环、条件或嵌套函数中调用
3. 只能在 React 函数组件或自定义 Hook 中调用

**工作原理：**
React 使用链表结构按顺序存储 Hooks 状态，依赖调用顺序来匹配对应的状态。

**示例：**
```javascript
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);
  
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**不能在条件语句中使用的原因：**
因为 React 依赖 Hooks 的调用顺序来维护状态，条件调用会破坏这个顺序。'
  ),
  (
    'CSS 盒模型详解',
    'css',
    'easy',
    '["盒模型", "box-sizing"]',
    '请详细说明 CSS 盒模型，包括：
1. 标准盒模型和 IE 盒模型的区别
2. box-sizing 属性的作用
3. 如何计算元素的实际宽度',
    '**CSS 盒模型组成：**
content（内容）、padding（内边距）、border（边框）、margin（外边距）

**两种盒模型：**

1. **标准盒模型** (content-box)
   - width/height 只包含 content
   - 实际宽度 = width + padding + border

2. **IE 盒模型** (border-box)
   - width/height 包含 content + padding + border
   - 实际宽度 = width

**box-sizing 属性：**
```css
/* 标准盒模型 */
.box1 {
  box-sizing: content-box;
  width: 200px;
  padding: 20px;
  border: 5px solid;
  /* 实际宽度: 200 + 40 + 10 = 250px */
}

/* IE 盒模型 */
.box2 {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 5px solid;
  /* 实际宽度: 200px */
}
```

**推荐做法：**
通常使用 `box-sizing: border-box` 更直观和易于计算。'
  );
