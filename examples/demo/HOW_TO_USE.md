# 如何使用 Demo 项目

## 🚀 三步开始

### 1️⃣ 安装依赖

```bash
pnpm install
```

### 2️⃣ 生成 API 代码

```bash
pnpm generate
```

这个命令会：
- 读取 `orval-forge.config.js` 配置
- 基于 `swagger.json` 生成 TypeScript API 函数
- 输出到 `generated/` 目录

### 3️⃣ 查看生成的代码

```bash
ls -la generated/
# api.ts          - API 函数
# models/         - TypeScript 类型定义
```

---

## 📦 生成的内容

### API 函数文件

**位置**: `generated/api.ts`

包含所有 API 请求函数：
- `getPosts()` - 获取文章列表
- `getPostById(id)` - 获取单个文章
- `createPost(data)` - 创建文章
- `updatePost(id, data)` - 更新文章
- `deletePost(id)` - 删除文章
- 等等...

### 类型定义

**位置**: `generated/models/`

包含所有 TypeScript 类型：
- `Post` - 文章类型
- `Comment` - 评论类型
- `User` - 用户类型
- 等等...

---

## 🛠️ 可用命令

```bash
# 生成 API 代码
pnpm generate

# 查看配置（dry-run）
pnpm generate:check

# 查看当前配置
pnpm config

# 查看 OrvalForge 信息
pnpm info

# 清理生成的文件
pnpm clean

# 运行简单示例
pnpm simple
```

---

## 📝 配置文件

**文件**: `orval-forge.config.js`

```javascript
module.exports = {
  // Orval 原生配置
  orval: {
    blogApi: {
      input: './swagger.json',           // 输入的 OpenAPI 文件
      output: {
        mode: 'split',                   // 分割模式
        target: './generated/api.ts',    // API 输出文件
        schemas: './generated/models',   // 类型输出目录
        clean: true,                     // 生成前清理
      },
    },
  },
  
  // OrvalForge 扩展配置
  httpClient: {
    type: 'MyRequest',                   // HTTP 客户端类型
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 10000,
    // ... 更多配置
  },
};
```

---

## 💡 使用生成的 API

生成代码后，在项目中导入使用：

```typescript
import { getPosts, createPost } from './generated/api';

// 获取文章列表
const posts = await getPosts();

// 创建新文章
const newPost = await createPost({
  title: 'Hello World',
  body: 'This is my first post',
  userId: 1,
});
```

---

## 🐛 常见问题

### Q: 命令找不到？

**A**: 确保已经安装依赖：
```bash
pnpm install
```

### Q: 生成失败？

**A**: 使用 check 命令查看配置：
```bash
pnpm generate:check
```

### Q: 如何修改配置？

**A**: 编辑 `orval-forge.config.js` 文件，然后重新运行：
```bash
pnpm generate
```

---

## 📚 更多资源

- [QUICK_START.md](./QUICK_START.md) - 详细的快速开始指南
- [DEMO_GUIDE.md](./DEMO_GUIDE.md) - 完整的功能说明
- [README.md](./README.md) - 项目概述

---

## 🎉 就是这么简单！

```bash
pnpm install
pnpm generate
# 完成！
```
