# JSON 数据存储说明

## 概述

本项目使用 JSON 文件 (`src/data/db.json`) 作为本地开发环境的持久化存储。所有对面试题、学生、班级等数据的增删改查操作都会自动保存到此文件中。

## 特点

- ✅ **持久化存储**：数据保存在 `src/data/db.json` 文件中，服务器重启或热重载后数据不会丢失
- ✅ **自动保存**：每次操作（增删改查）都会自动写入 JSON 文件
- ✅ **防抖优化**：使用 100ms 防抖，避免频繁写入文件
- ✅ **内存缓存**：数据在内存中缓存，读取速度快
- ✅ **易于调试**：可以直接编辑 JSON 文件查看或修改数据

## 数据文件位置

```
src/data/db.json
```

## 数据结构

```json
{
  "interviews": {
    "questions": [...],
    "categories": [...],
    "nextId": 4
  },
  "students": [...],
  "classes": [...]
}
```

## 使用方式

### 面试题操作

```typescript
import { memoryInterviewStore } from '@/lib/mockDatabase';

// 获取所有面试题
const questions = await memoryInterviewStore.getAllQuestions();

// 创建面试题
const newQuestion = await memoryInterviewStore.createQuestion({
  title: '题目标题',
  category: 'javascript',
  difficulty: 'medium',
  tags: ['标签1', '标签2'],
  content: '题目内容',
  answer: '参考答案'
});

// 更新面试题
const updated = await memoryInterviewStore.updateQuestion(1, {
  title: '新标题',
  tags: ['新标签']
});

// 删除面试题
const deleted = await memoryInterviewStore.deleteQuestion(1);
```

## 注意事项

### 1. Git 版本控制

如果你想在团队中共享初始数据，**保留** `db.json` 在 Git 中。

如果你不想提交个人的测试数据，可以添加到 `.gitignore`：

```gitignore
# 本地数据库文件（可选）
src/data/db.json
```

### 2. 备份数据

建议定期备份 `db.json` 文件，以防意外丢失数据。

### 3. 重置数据

如果需要重置为初始数据，可以删除 `db.json` 文件，系统会自动使用默认数据重新创建。

或者手动编辑 `db.json` 文件恢复初始状态。

## 技术实现

- **存储引擎**：`src/lib/jsonStore.ts`
- **包装层**：`src/lib/mockDatabase.ts` 中的 `MemoryInterviewStore` 类
- **API 调用**：`src/app/api/interviews/` 路由使用该存储

## 性能优化

1. **内存缓存**：首次读取后数据缓存在内存中，后续读取无需重复解析 JSON
2. **防抖写入**：100ms 内的多次写操作会合并为一次文件写入
3. **异步操作**：所有文件读写都是异步的，不会阻塞主线程

## 从内存存储迁移

之前的 `MemoryInterviewStore` 使用纯内存数组存储，服务器重启后数据丢失。

现在已升级为基于 JSON 文件的持久化存储，API 接口保持不变，无需修改业务代码。
