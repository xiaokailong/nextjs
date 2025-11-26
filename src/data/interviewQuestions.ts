import { InterviewQuestion, InterviewCategory } from '@/types/interview';

// 面试题分类
export const interviewCategories: InterviewCategory[] = [
  { id: 'all', name: '全部题目', count: 50 },
  { id: 'javascript', name: 'JavaScript 基础', count: 15 },
  { id: 'react', name: 'React', count: 12 },
  { id: 'vue', name: 'Vue', count: 8 },
  { id: 'css', name: 'CSS', count: 10 },
  { id: 'network', name: '网络协议', count: 5 },
  { id: 'performance', name: '性能优化', count: 8 },
  { id: 'algorithm', name: '算法与数据结构', count: 7 },
  { id: 'engineering', name: '工程化', count: 5 },
];

// Mock 面试题数据
export const interviewQuestions: InterviewQuestion[] = [
  {
    id: '1',
    title: '什么是闭包？闭包的应用场景有哪些？',
    category: 'javascript',
    difficulty: 'medium',
    tags: ['闭包', '作用域', '核心概念'],
    content: `闭包是 JavaScript 中的一个重要概念。请详细解释：
1. 什么是闭包？
2. 闭包的工作原理
3. 闭包的常见应用场景
4. 闭包可能带来的问题`,
    answer: `闭包是指函数能够访问其词法作用域外部的变量。

**工作原理：**
当函数嵌套时，内部函数可以访问外部函数的变量，即使外部函数已经执行完毕。

**应用场景：**
1. 数据私有化/模块化
2. 函数工厂
3. 回调函数和事件处理
4. 防抖节流

**示例代码：**
\`\`\`javascript
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}
\`\`\`

**注意事项：**
过度使用闭包可能导致内存泄漏，因为闭包会保持对外部变量的引用。`,
  },
  {
    id: '2',
    title: 'React Hooks 的使用规则和原理',
    category: 'react',
    difficulty: 'medium',
    tags: ['Hooks', 'useState', 'useEffect'],
    content: `React Hooks 是 React 16.8 引入的新特性。请回答：
1. Hooks 的使用规则
2. useState 和 useEffect 的工作原理
3. 为什么 Hooks 不能在条件语句中使用？`,
    answer: `**Hooks 使用规则：**
1. 只能在函数组件顶层调用
2. 不能在循环、条件或嵌套函数中调用
3. 只能在 React 函数组件或自定义 Hook 中调用

**工作原理：**
React 使用链表结构按顺序存储 Hooks 状态，依赖调用顺序来匹配对应的状态。

**示例：**
\`\`\`javascript
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);
  
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
\`\`\`

**不能在条件语句中使用的原因：**
因为 React 依赖 Hooks 的调用顺序来维护状态，条件调用会破坏这个顺序。`,
  },
  {
    id: '3',
    title: 'CSS 盒模型详解',
    category: 'css',
    difficulty: 'easy',
    tags: ['盒模型', 'box-sizing'],
    content: `请详细说明 CSS 盒模型，包括：
1. 标准盒模型和 IE 盒模型的区别
2. box-sizing 属性的作用
3. 如何计算元素的实际宽度`,
    answer: `**CSS 盒模型组成：**
content（内容）、padding（内边距）、border（边框）、margin（外边距）

**两种盒模型：**

1. **标准盒模型** (content-box)
   - width/height 只包含 content
   - 实际宽度 = width + padding + border

2. **IE 盒模型** (border-box)
   - width/height 包含 content + padding + border
   - 实际宽度 = width

**box-sizing 属性：**
\`\`\`css
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
\`\`\`

**推荐做法：**
通常使用 \`box-sizing: border-box\` 更直观和易于计算。`,
  },
  {
    id: '4',
    title: 'HTTP 与 HTTPS 的区别',
    category: 'network',
    difficulty: 'easy',
    tags: ['HTTP', 'HTTPS', '安全'],
    content: `请说明 HTTP 和 HTTPS 的区别，以及 HTTPS 的工作原理。`,
    answer: `**主要区别：**

| 特性 | HTTP | HTTPS |
|------|------|-------|
| 安全性 | 明文传输 | 加密传输 |
| 端口 | 80 | 443 |
| 证书 | 不需要 | 需要 SSL/TLS 证书 |
| SEO | 较低 | 较高 |

**HTTPS 工作原理：**
1. 客户端发起 HTTPS 请求
2. 服务器返回 SSL 证书
3. 客户端验证证书有效性
4. 使用非对称加密协商对称密钥
5. 使用对称密钥加密数据通信

**加密过程：**
\`\`\`
客户端 -----(Client Hello)-----> 服务器
客户端 <----(Server Hello + 证书)--- 服务器
客户端 -----(加密的预主密钥)-----> 服务器
       [协商完成，开始加密通信]
\`\`\`

**优势：**
- 数据加密，防止窃听
- 数据完整性校验
- 身份认证，防止中间人攻击`,
  },
  {
    id: '5',
    title: 'Vue 响应式原理',
    category: 'vue',
    difficulty: 'hard',
    tags: ['响应式', 'Proxy', 'Observer'],
    content: `请详细说明 Vue 2 和 Vue 3 的响应式原理及其区别。`,
    answer: `**Vue 2 响应式原理 (Object.defineProperty)：**

\`\`\`javascript
function defineReactive(obj, key, val) {
  const dep = new Dep();
  
  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) {
        dep.depend(); // 收集依赖
      }
      return val;
    },
    set(newVal) {
      if (newVal === val) return;
      val = newVal;
      dep.notify(); // 触发更新
    }
  });
}
\`\`\`

**Vue 3 响应式原理 (Proxy)：**

\`\`\`javascript
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key); // 收集依赖
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      trigger(target, key); // 触发更新
      return result;
    }
  });
}
\`\`\`

**主要区别：**

| 特性 | Vue 2 | Vue 3 |
|------|-------|-------|
| 实现方式 | Object.defineProperty | Proxy |
| 数组监听 | 需要重写数组方法 | 原生支持 |
| 新增属性 | 需要 $set | 自动响应 |
| 性能 | 初始化时遍历所有属性 | 懒代理，性能更好 |
| 删除属性 | 需要 $delete | 自动响应 |

**优势：**
- Proxy 可以监听整个对象，包括新增和删除属性
- 性能更好，不需要递归遍历所有属性
- 支持 Map、Set 等数据结构`,
  },
  {
    id: '6',
    title: '前端性能优化策略',
    category: 'performance',
    difficulty: 'medium',
    tags: ['性能优化', '最佳实践'],
    content: `请列举前端性能优化的主要策略和具体实施方法。`,
    answer: `**1. 加载性能优化：**
- 代码分割 (Code Splitting)
- 懒加载 (Lazy Loading)
- Tree Shaking
- 压缩资源 (Gzip/Brotli)
- CDN 加速
- HTTP/2 多路复用

**2. 渲染性能优化：**
- 减少重排重绘
- 使用 CSS3 动画代替 JS 动画
- 虚拟滚动
- 防抖节流
- RequestAnimationFrame

**3. 资源优化：**
\`\`\`javascript
// 图片懒加载
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});

// 防抖
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
\`\`\`

**4. React 特定优化：**
- React.memo / useMemo / useCallback
- 虚拟列表
- Suspense 和 Lazy

**5. 监控指标：**
- FCP (First Contentful Paint)
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)`,
  },
  {
    id: '7',
    title: '实现深拷贝的多种方法',
    category: 'javascript',
    difficulty: 'medium',
    tags: ['深拷贝', '浅拷贝', '对象'],
    content: `请实现一个完整的深拷贝函数，并说明各种深拷贝方法的优缺点。`,
    answer: `**方法一：JSON 序列化（简单但有限制）**
\`\`\`javascript
const deepClone1 = (obj) => JSON.parse(JSON.stringify(obj));
// 缺点：无法处理函数、undefined、Symbol、循环引用
\`\`\`

**方法二：递归实现（完整版）**
\`\`\`javascript
function deepClone(obj, hash = new WeakMap()) {
  // 处理 null 或非对象
  if (obj === null || typeof obj !== 'object') return obj;
  
  // 处理日期
  if (obj instanceof Date) return new Date(obj);
  
  // 处理正则
  if (obj instanceof RegExp) return new RegExp(obj);
  
  // 处理循环引用
  if (hash.has(obj)) return hash.get(obj);
  
  // 创建新对象/数组
  const cloneObj = new obj.constructor();
  hash.set(obj, cloneObj);
  
  // 递归拷贝
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key], hash);
    }
  }
  
  // 处理 Symbol 属性
  const symbols = Object.getOwnPropertySymbols(obj);
  for (let sym of symbols) {
    cloneObj[sym] = deepClone(obj[sym], hash);
  }
  
  return cloneObj;
}
\`\`\`

**方法三：structuredClone (现代浏览器)**
\`\`\`javascript
const clone = structuredClone(obj);
// 支持大多数类型，但不支持函数
\`\`\`

**对比：**
| 方法 | 优点 | 缺点 |
|------|------|------|
| JSON | 简单快速 | 类型支持有限 |
| 递归 | 功能完整 | 代码复杂 |
| structuredClone | 原生支持 | 不支持函数 |`,
  },
  {
    id: '8',
    title: 'Webpack 和 Vite 的区别',
    category: 'engineering',
    difficulty: 'medium',
    tags: ['构建工具', 'Webpack', 'Vite'],
    content: `请对比 Webpack 和 Vite 的原理和特点。`,
    answer: `**核心差异：**

**Webpack:**
- 基于 Bundle 的构建工具
- 开发时需要打包整个应用
- 启动较慢，但生态成熟

**Vite:**
- 基于 ESM 的开发服务器
- 开发时按需编译
- 冷启动快，HMR 更新快

**工作原理对比：**

\`\`\`
Webpack 开发流程：
源码 → 全量打包 → Bundle → 浏览器

Vite 开发流程：
源码 → ESM 导入 → 按需编译 → 浏览器
\`\`\`

**配置示例：**

\`\`\`javascript
// vite.config.js
export default {
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
}
\`\`\`

**选型建议：**
- 新项目：推荐 Vite（开发体验好）
- 复杂项目：Webpack（生态更完善）
- 构建工具库：Rollup

**性能对比：**
| 指标 | Webpack | Vite |
|------|---------|------|
| 冷启动 | 慢 | 快 |
| HMR | 较慢 | 极快 |
| 生产构建 | 成熟 | 基于Rollup |
| 生态 | 丰富 | 增长中 |`,
  },
  {
    id: '9',
    title: '实现 Promise.all 和 Promise.race',
    category: 'javascript',
    difficulty: 'hard',
    tags: ['Promise', '异步编程'],
    content: `请手动实现 Promise.all 和 Promise.race 方法。`,
    answer: `**Promise.all 实现：**
\`\`\`javascript
Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'));
    }
    
    const results = [];
    let completedCount = 0;
    const total = promises.length;
    
    if (total === 0) {
      return resolve([]);
    }
    
    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(
        value => {
          results[index] = value;
          completedCount++;
          
          if (completedCount === total) {
            resolve(results);
          }
        },
        error => {
          reject(error); // 任一失败则整体失败
        }
      );
    });
  });
};
\`\`\`

**Promise.race 实现：**
\`\`\`javascript
Promise.myRace = function(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'));
    }
    
    if (promises.length === 0) {
      return;
    }
    
    promises.forEach(promise => {
      Promise.resolve(promise).then(
        value => resolve(value),  // 第一个完成的决定结果
        error => reject(error)
      );
    });
  });
};
\`\`\`

**使用示例：**
\`\`\`javascript
// Promise.all 示例
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

Promise.myAll([p1, p2, p3]).then(console.log); // [1, 2, 3]

// Promise.race 示例
const fast = new Promise(resolve => setTimeout(() => resolve('fast'), 100));
const slow = new Promise(resolve => setTimeout(() => resolve('slow'), 500));

Promise.myRace([fast, slow]).then(console.log); // 'fast'
\`\`\`

**关键点：**
- Promise.all 等待所有完成或任一失败
- Promise.race 返回第一个完成的结果
- 都需要处理非 Promise 值`,
  },
  {
    id: '10',
    title: '快速排序算法实现',
    category: 'algorithm',
    difficulty: 'medium',
    tags: ['排序', '算法', '分治'],
    content: `请实现快速排序算法，并分析其时间复杂度。`,
    answer: `**快速排序实现：**

\`\`\`javascript
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left >= right) return arr;
  
  const pivotIndex = partition(arr, left, right);
  quickSort(arr, left, pivotIndex - 1);
  quickSort(arr, pivotIndex + 1, right);
  
  return arr;
}

function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left - 1;
  
  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}

// 使用示例
const arr = [64, 34, 25, 12, 22, 11, 90];
console.log(quickSort([...arr])); // [11, 12, 22, 25, 34, 64, 90]
\`\`\`

**简洁版本（非原地排序）：**
\`\`\`javascript
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}
\`\`\`

**复杂度分析：**
- **时间复杂度：**
  - 最好/平均: O(n log n)
  - 最坏: O(n²) - 数组已排序且选择首/尾元素作为pivot
- **空间复杂度：** O(log n) - 递归栈空间
- **稳定性：** 不稳定

**优化方案：**
1. 三数取中选择 pivot
2. 小数组使用插入排序
3. 尾递归优化`,
  },
  {
    id: '11',
    title: 'React Virtual DOM 原理',
    category: 'react',
    difficulty: 'hard',
    tags: ['Virtual DOM', 'Diff算法', 'React'],
    content: `请说明 React Virtual DOM 的工作原理和 Diff 算法。`,
    answer: `**Virtual DOM 工作流程：**

\`\`\`
1. 状态改变 → 2. 生成新 VNode 树 → 3. Diff 对比 
→ 4. 计算最小更新 → 5. 批量更新真实 DOM
\`\`\`

**Diff 算法三大策略：**

1. **Tree Diff**: 同层比较，跨层级移动视为删除+创建
2. **Component Diff**: 同类型组件继续比较，不同类型直接替换
3. **Element Diff**: 使用 key 优化列表对比

**简化实现：**
\`\`\`javascript
function diff(oldVNode, newVNode) {
  // 类型不同，直接替换
  if (oldVNode.type !== newVNode.type) {
    return { type: 'REPLACE', newVNode };
  }
  
  // 文本节点
  if (typeof newVNode === 'string') {
    if (oldVNode !== newVNode) {
      return { type: 'TEXT', text: newVNode };
    }
    return null;
  }
  
  // 比较属性
  const propsPatches = diffProps(oldVNode.props, newVNode.props);
  
  // 比较子节点
  const childPatches = diffChildren(
    oldVNode.children, 
    newVNode.children
  );
  
  return {
    type: 'UPDATE',
    props: propsPatches,
    children: childPatches
  };
}

function diffChildren(oldChildren, newChildren) {
  const patches = [];
  const oldKeys = {};
  
  // 建立 key 映射
  oldChildren.forEach((child, i) => {
    const key = child.key || i;
    oldKeys[key] = { child, index: i };
  });
  
  newChildren.forEach((newChild, i) => {
    const key = newChild.key || i;
    const old = oldKeys[key];
    
    if (old) {
      patches.push(diff(old.child, newChild));
    } else {
      patches.push({ type: 'INSERT', node: newChild, index: i });
    }
  });
  
  return patches;
}
\`\`\`

**为什么需要 key：**
\`\`\`jsx
// 不推荐：使用 index 作为 key
{items.map((item, index) => <Item key={index} data={item} />)}

// 推荐：使用唯一标识作为 key
{items.map(item => <Item key={item.id} data={item} />)}
\`\`\`

**优势：**
- 减少 DOM 操作
- 批量更新
- 跨平台能力（React Native）`,
  },
  {
    id: '12',
    title: 'CSS Flexbox 布局详解',
    category: 'css',
    difficulty: 'medium',
    tags: ['Flexbox', '布局', 'CSS'],
    content: `请详细说明 Flexbox 布局的核心概念和常用属性。`,
    answer: `**Flexbox 核心概念：**

\`\`\`
主轴 (main axis) ←→
侧轴 (cross axis) ↕

[容器属性]          [项目属性]
flex-direction      order
flex-wrap          flex-grow
justify-content    flex-shrink
align-items        flex-basis
align-content      align-self
\`\`\`

**容器属性详解：**
\`\`\`css
.container {
  display: flex;
  
  /* 主轴方向 */
  flex-direction: row | row-reverse | column | column-reverse;
  
  /* 换行 */
  flex-wrap: nowrap | wrap | wrap-reverse;
  
  /* 主轴对齐 */
  justify-content: flex-start | flex-end | center | 
                   space-between | space-around | space-evenly;
  
  /* 侧轴对齐 */
  align-items: flex-start | flex-end | center | 
               baseline | stretch;
  
  /* 多行侧轴对齐 */
  align-content: flex-start | flex-end | center | 
                 space-between | space-around | stretch;
}
\`\`\`

**项目属性详解：**
\`\`\`css
.item {
  /* 排序 */
  order: 0; /* 数字越小越靠前 */
  
  /* 放大比例 */
  flex-grow: 0; /* 默认不放大 */
  
  /* 缩小比例 */
  flex-shrink: 1; /* 默认会缩小 */
  
  /* 初始大小 */
  flex-basis: auto;
  
  /* 简写 */
  flex: 1; /* flex-grow flex-shrink flex-basis */
  
  /* 单独对齐 */
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
\`\`\`

**实用案例：**
\`\`\`css
/* 1. 水平垂直居中 */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 2. 两端对齐 */
.space-between {
  display: flex;
  justify-content: space-between;
}

/* 3. 等分布局 */
.equal {
  display: flex;
}
.equal > * {
  flex: 1;
}

/* 4. 圣杯布局 */
.holy-grail {
  display: flex;
  min-height: 100vh;
}
.sidebar { flex: 0 0 200px; }
.main { flex: 1; }
\`\`\``,
  },
  {
    id: '13',
    title: 'TypeScript 高级类型',
    category: 'javascript',
    difficulty: 'hard',
    tags: ['TypeScript', '类型系统'],
    content: `请介绍 TypeScript 的高级类型特性和使用场景。`,
    answer: `**1. 联合类型和交叉类型：**
\`\`\`typescript
// 联合类型 (|)
type Status = 'pending' | 'success' | 'error';

// 交叉类型 (&)
type Person = { name: string };
type Employee = { id: number };
type Staff = Person & Employee;
// Staff = { name: string; id: number }
\`\`\`

**2. 条件类型：**
\`\`\`typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

// 实用工具类型
type NonNullable<T> = T extends null | undefined ? never : T;
type Extract<T, U> = T extends U ? T : never;
\`\`\`

**3. 映射类型：**
\`\`\`typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Required<T> = {
  [P in keyof T]-?: T[P];
};

type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface User {
  name: string;
  age: number;
}

type PartialUser = Partial<User>;
// { name?: string; age?: number; }
\`\`\`

**4. 模板字面量类型：**
\`\`\`typescript
type EventName<T extends string> = \`on\${Capitalize<T>}\`;

type ClickEvent = EventName<'click'>;  // 'onClick'
type HoverEvent = EventName<'hover'>;  // 'onHover'

// 组合使用
type Methods = 'GET' | 'POST';
type Endpoints = '/users' | '/posts';
type API = \`\${Methods} \${Endpoints}\`;
// 'GET /users' | 'GET /posts' | 'POST /users' | 'POST /posts'
\`\`\`

**5. infer 关键字：**
\`\`\`typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

function foo() {
  return { x: 10, y: 20 };
}

type FooReturn = ReturnType<typeof foo>;
// { x: number; y: number }
\`\`\`

**实际应用：**
\`\`\`typescript
// API 响应类型推导
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

// 深度只读
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? DeepReadonly<T[P]> 
    : T[P];
};
\`\`\``,
  },
  {
    id: '14',
    title: '浏览器事件循环机制',
    category: 'javascript',
    difficulty: 'hard',
    tags: ['事件循环', '异步', '宏任务', '微任务'],
    content: `请详细说明浏览器的事件循环机制，包括宏任务和微任务的执行顺序。`,
    answer: `**事件循环流程：**

\`\`\`
1. 执行同步代码
2. 执行微任务队列（全部）
3. 执行一个宏任务
4. 执行微任务队列（全部）
5. 渲染更新（如需要）
6. 重复步骤 3-5
\`\`\`

**任务分类：**

**宏任务 (MacroTask):**
- setTimeout / setInterval
- setImmediate (Node.js)
- I/O 操作
- UI 渲染
- script 标签代码

**微任务 (MicroTask):**
- Promise.then/catch/finally
- MutationObserver
- queueMicrotask
- process.nextTick (Node.js)

**执行示例：**
\`\`\`javascript
console.log('1');

setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => {
    console.log('3');
  });
}, 0);

Promise.resolve().then(() => {
  console.log('4');
  setTimeout(() => {
    console.log('5');
  }, 0);
});

console.log('6');

// 输出顺序: 1 6 4 2 3 5
\`\`\`

**执行过程分析：**
\`\`\`
Step 1: 同步代码
  输出: 1, 6

Step 2: 微任务队列
  执行 Promise → 输出: 4
  (产生新宏任务 setTimeout-5)

Step 3: 宏任务队列
  执行 setTimeout-2 → 输出: 2
  (产生新微任务 Promise-3)

Step 4: 微任务队列
  执行 Promise-3 → 输出: 3

Step 5: 宏任务队列
  执行 setTimeout-5 → 输出: 5
\`\`\`

**经典面试题：**
\`\`\`javascript
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}

async function async2() {
  console.log('async2');
}

console.log('script start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

async1();

new Promise(resolve => {
  console.log('promise1');
  resolve();
}).then(() => {
  console.log('promise2');
});

console.log('script end');

/* 输出顺序:
script start
async1 start
async2
promise1
script end
async1 end
promise2
setTimeout
*/
\`\`\`

**关键点：**
- await 后面的代码相当于 Promise.then()
- 微任务优先级高于宏任务
- 每次宏任务后都会清空微任务队列`,
  },
  {
    id: '15',
    title: 'Git 常用命令和工作流',
    category: 'engineering',
    difficulty: 'easy',
    tags: ['Git', '版本控制'],
    content: `请介绍 Git 的常用命令和标准工作流程。`,
    answer: `**基础命令：**
\`\`\`bash
# 初始化仓库
git init

# 克隆远程仓库
git clone <url>

# 查看状态
git status

# 添加文件到暂存区
git add .
git add <file>

# 提交
git commit -m "message"

# 推送
git push origin main

# 拉取
git pull origin main
\`\`\`

**分支操作：**
\`\`\`bash
# 创建分支
git branch feature-x

# 切换分支
git checkout feature-x
# 或
git switch feature-x

# 创建并切换
git checkout -b feature-x

# 合并分支
git merge feature-x

# 删除分支
git branch -d feature-x

# 查看所有分支
git branch -a
\`\`\`

**撤销操作：**
\`\`\`bash
# 撤销工作区修改
git checkout -- <file>
git restore <file>

# 撤销暂存区
git reset HEAD <file>
git restore --staged <file>

# 撤销提交
git reset --soft HEAD^   # 保留修改
git reset --hard HEAD^   # 丢弃修改

# 修改最后一次提交
git commit --amend
\`\`\`

**查看历史：**
\`\`\`bash
# 查看提交历史
git log
git log --oneline --graph

# 查看文件修改
git diff
git diff --staged

# 查看某次提交
git show <commit-id>
\`\`\`

**Git Flow 工作流：**
\`\`\`
main (生产)
  ↑
release (预发布)
  ↑
develop (开发)
  ↑
feature (功能分支)
\`\`\`

**标准流程示例：**
\`\`\`bash
# 1. 从 develop 创建功能分支
git checkout develop
git checkout -b feature/user-auth

# 2. 开发并提交
git add .
git commit -m "feat: add user authentication"

# 3. 推送到远程
git push origin feature/user-auth

# 4. 创建 Pull Request

# 5. 代码审查通过后合并到 develop
git checkout develop
git merge feature/user-auth

# 6. 删除功能分支
git branch -d feature/user-auth
\`\`\`

**实用技巧：**
\`\`\`bash
# 暂存当前修改
git stash
git stash pop

# 查看某个文件的历史
git log -p <file>

# 找回删除的提交
git reflog

# Cherry-pick
git cherry-pick <commit-id>

# 变基（整理提交历史）
git rebase -i HEAD~3
\`\`\``,
  },
];
