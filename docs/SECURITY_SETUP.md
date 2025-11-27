# 项目安全设置指南

## 🔐 首次设置（新团队成员）

### 步骤 1: 克隆项目
```bash
git clone <repository-url>
cd nextjs
```

### 步骤 2: 安装依赖
```bash
pnpm install
```

### 步骤 3: 配置 Cloudflare 数据库

#### 选项 A: 使用自己的数据库（开发环境推荐）
```bash
# 1. 登录 Cloudflare
wrangler login

# 2. 创建你自己的开发数据库
wrangler d1 create my-students-db
wrangler d1 create my-interview-db

# 3. 复制配置模板
cp wrangler.toml.example wrangler.toml

# 4. 编辑 wrangler.toml，填入你的数据库 ID
# 从上面创建命令的输出中复制 database_id

# 5. 运行数据库迁移
pnpm run db:migrate:local
```

#### 选项 B: 使用生产数据库（需要权限）
```bash
# 1. 向项目管理员申请数据库访问权限

# 2. 复制配置模板
cp wrangler.toml.example wrangler.toml

# 3. 管理员会提供数据库 ID（通过安全渠道，不要在公开聊天中分享）

# 4. 编辑 wrangler.toml，填入提供的数据库 ID
```

### 步骤 4: 本地开发
```bash
# 启动开发服务器（连接生产环境 API）
pnpm dev
```

本地开发时，通过 `.env.local` 配置连接到生产环境 API。

## 🚨 重要安全规则

### ❌ 绝对不要做的事：

1. **不要提交 `wrangler.toml` 到 Git**
   - 这个文件包含数据库 ID
   - 已添加到 .gitignore

2. **不要在公开渠道分享数据库 ID**
   - 不要在 Slack/Teams 等聊天工具中发送
   - 不要截图包含数据库 ID 的配置
   - 使用加密的密码管理器或安全通道

3. **不要提交 `.env` 文件**
   - 包含敏感的环境变量
   - 已添加到 .gitignore

### ✅ 应该做的事：

1. **使用 `wrangler.toml.example` 作为参考**
   - 这是安全的配置模板
   - 可以提交到 Git

2. **保护你的 Cloudflare API Token**
   - 启用两步验证 (2FA)
   - 定期更换 API Token
   - 使用受限权限的 Token

3. **报告安全问题**
   - 如果发现敏感信息泄露，立即通知团队
   - 如果 API Token 泄露，立即轮换

## 📁 关键文件说明

| 文件 | 状态 | 说明 |
|------|------|------|
| `wrangler.toml` | ❌ 不提交 | 包含真实数据库 ID |
| `wrangler.toml.example` | ✅ 提交 | 配置模板，无敏感信息 |
| `.env` / `.env.local` | ❌ 不提交 | 环境变量 |
| `package.json` | ✅ 提交 | 依赖配置 |
| `*.md` 文档 | ✅ 提交 | 项目文档（已脱敏） |

## 🔍 检查清单

在提交代码前，请检查：

- [ ] `git status` 中没有 `wrangler.toml`
- [ ] `git status` 中没有 `.env` 文件
- [ ] 代码中没有硬编码的数据库 ID
- [ ] 代码中没有硬编码的 API Token

## 📚 相关文档

- `DATABASE_SECURITY.md` - 完整的安全最佳实践
- `DEPLOYMENT_CHECKLIST.md` - 部署前检查清单
- `CLOUDFLARE_DEPLOYMENT.md` - 部署详细指南

## 🆘 获取帮助

### 如果你看到以下错误：

#### "Failed to fetch auth token"
```bash
# 重新登录
wrangler logout
wrangler login
```

#### "Database not found"
```bash
# 检查数据库 ID 是否正确
wrangler d1 list

# 重新填写 wrangler.toml
```

#### "Type error" 构建失败
```bash
# 清理并重新构建
rm -rf .next
pnpm run build
```

### 联系方式
- 技术问题：查看项目文档或创建 Issue
- 安全问题：私下联系项目管理员

---

**记住：安全是每个人的责任！**
