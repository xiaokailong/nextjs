# Cloudflare 部署脚本
# 用于简化部署流程，自动处理 SSL 证书问题

Write-Host "🚀 开始部署到 Cloudflare Pages..." -ForegroundColor Green
Write-Host ""

# 设置环境变量以处理 SSL 证书问题
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'

# 构建项目
Write-Host "📦 正在构建 Next.js 应用..." -ForegroundColor Cyan
pnpm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 构建失败，请检查错误信息" -ForegroundColor Red
    exit 1
}

Write-Host "✅ 构建完成" -ForegroundColor Green
Write-Host ""

# 部署到 Cloudflare Pages
Write-Host "🌐 正在部署到 Cloudflare Pages..." -ForegroundColor Cyan
npx wrangler pages deploy .next

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 部署失败，请检查错误信息" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 部署成功！" -ForegroundColor Green
Write-Host ""
Write-Host "📋 接下来的步骤：" -ForegroundColor Yellow
Write-Host "1. 访问您的 Cloudflare Pages 控制台查看部署详情"
Write-Host "2. 测试部署的应用是否正常工作"
Write-Host "3. 检查 D1 数据库连接是否正常"
Write-Host ""
