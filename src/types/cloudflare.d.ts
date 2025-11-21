// Cloudflare D1 类型定义
declare global {
  interface CloudflareEnv {
    DB: D1Database;
  }
}

export {};
