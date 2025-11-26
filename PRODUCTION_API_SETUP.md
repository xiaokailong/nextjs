# 生产环境 API 直连设置

## 快速开始

本项目支持在本地开发时直接使用生产环境的 API 和数据库，无需本地 mock 数据。

### 1. 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# Windows PowerShell
Copy-Item .env.example .env.local
```

### 2. 配置生产环境 API 地址

编辑 `.env.local` 文件，取消注释并设置生产环境地址：

```env
NEXT_PUBLIC_API_BASE_URL=https://velen-nextjs.pages.dev
```

### 3. 重启开发服务器

```bash
# 停止当前服务器 (Ctrl+C)
# 重新启动
pnpm dev
```

## 工作原理

- **未设置环境变量**：使用本地 API 路由（`/api/interviews`）
- **设置环境变量**：所有 API 请求自动转向生产环境（`https://velen-nextjs.pages.dev/api/interviews`）

所有页面和组件已经更新为自动支持此功能，无需修改代码。

## 切换回本地模式

### 方法 1: 删除环境变量
在 `.env.local` 中注释掉或删除：
```env
# NEXT_PUBLIC_API_BASE_URL=https://velen-nextjs.pages.dev
```

### 方法 2: 设置为空
```env
NEXT_PUBLIC_API_BASE_URL=
```

重启开发服务器即可。

## ⚠️ 重要提示

- **生产数据修改**：使用生产 API 时，创建、编辑、删除操作会直接影响生产环境数据
- **CORS 限制**：确保生产环境允许本地开发域名的跨域请求
- **认证问题**：如果生产环境有认证要求，需要额外配置

## 技术细节

项目使用 `getAPIPath()` 辅助函数来处理 API 路径：
- 位于：`src/config/api.config.ts`
- 自动检测 `NEXT_PUBLIC_API_BASE_URL` 环境变量
- 所有页面和组件都已集成此功能

### 受影响的文件
- ✅ `src/app/page.tsx` - 首页
- ✅ `src/app/admin/page.tsx` - 管理页面
- ✅ `src/components/QuestionFormModal.tsx` - 表单弹窗
- ✅ 所有面试题相关 API 调用

## 验证设置

启动开发服务器后，打开浏览器开发者工具（F12），查看 Network 标签：

- **本地模式**：请求地址为 `http://localhost:3000/api/interviews`
- **生产模式**：请求地址为 `https://velen-nextjs.pages.dev/api/interviews`
