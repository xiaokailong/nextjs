// 动态 runtime 配置
// 本地开发时可以通过环境变量切换 runtime
export const runtime = process.env.USE_NODEJS_RUNTIME === 'true' ? undefined : 'edge';
