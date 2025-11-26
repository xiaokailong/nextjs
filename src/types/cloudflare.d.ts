// Cloudflare D1 类型定义
declare global {
  interface CloudflareEnv {
    DB: D1Database; // students-db: 学生和班级数据库
    INTERVIEW_DB: D1Database; // interview-db: 面试题数据库
  }
}

export {};
