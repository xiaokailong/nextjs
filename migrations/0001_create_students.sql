-- 创建学生表
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  grade TEXT NOT NULL,
  email TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 插入示例数据
INSERT INTO students (name, age, grade, email) VALUES
  ('张三', 18, '高三', 'zhangsan@example.com'),
  ('李四', 17, '高二', 'lisi@example.com'),
  ('王五', 16, '高一', 'wangwu@example.com');
