-- 创建班级表
CREATE TABLE IF NOT EXISTS classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  teacher_name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 为学生表添加班级关联（如果需要的话）
-- 注意：SQLite 不支持 ALTER TABLE ADD FOREIGN KEY，所以我们只添加字段
ALTER TABLE students ADD COLUMN class_id INTEGER;

-- 插入示例班级数据
INSERT INTO classes (name, grade, teacher_name) VALUES
  ('一班', '高三', '王老师'),
  ('二班', '高二', '李老师');

-- 更新学生的班级关联
UPDATE students SET class_id = 1 WHERE id IN (1, 3);
UPDATE students SET class_id = 2 WHERE id = 2;
