# OrvalForge Demo - 快速开始

这个示例展示了如何使用 OrvalForge 基于 OpenAPI 规范生成类型安全的 API 函数。

## 📋 前置条件

确保项目已经构建：

```bash
cd /Users/nathenieli/codebuddy/orval-forge
pnpm install
pnpm build
```

## 🚀 快速开始

### 1. 安装依赖

```bash
cd examples/demo
pnpm install
```

### 2. 生成 API 代码

基于 `orval-forge.config.js` 配置文件生成 API：

```bash
pnpm generate
```

这个命令会：
- 读取 `orval-forge.config.js` 配置
- 使用 `swagger.json` 作为输入
- 在 `generated/` 目录生成 API 函数和类型定义

### 3. 查看生成的代码

```bash
ls -la generated/
# api.ts - API 函数
# models/ - TypeScript 类型定义
```

## 📝 配置文件说明

`orval-forge.config.js` 包含两部分配置：

### Orval 原生配置

```javascript
orval: {
  blogApi: {
    input: './swagger.json',           // OpenAPI 规范文件
    output: {
      mode: 'split',                   // 分割模式
      target: './generated/api.ts',    // API 函数输出文件
      schemas: './generated/models',   // 类型定义输出目录
      clean: true,                     // 生成前清理目录
    },
  },
}
```

### OrvalForge 扩展配置

```javascript
httpClient: {
  type: 'MyRequest',                   // HTTP 客户端类型
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: { /* ... */ },
  interceptors: { /* ... */ },
  errorHandling: { /* ... */ },
}
```

## 🛠️ 可用命令

```bash
# 生成 API 代码
pnpm generate

# 检查配置（dry-run）
pnpm generate:check

# 查看当前配置
pnpm config

# 查看 OrvalForge 信息
pnpm info

# 初始化新配置（可选）
pnpm init
```

## 📁 生成的文件结构

```
generated/
├── api.ts          # API 函数（包含所有请求方法）
└── models/         # TypeScript 类型定义
    ├── post.ts
    ├── comment.ts
    └── ...
```

## 💡 使用生成的 API

生成代码后，你可以在项目中导入使用：

```typescript
import { getPosts, getPostById, createPost } from './generated/api';

// 获取所有文章
const posts = await getPosts();

// 获取单个文章
const post = await getPostById(1);

// 创建文章
const newPost = await createPost({
  title: 'Hello',
  body: 'World',
  userId: 1,
});
```

## 🔄 监听模式（即将支持）

```bash
pnpm generate:watch
```

## 🐛 故障排除

### 命令找不到

如果 `orval-forge` 命令找不到，请确保：

1. 在根目录执行了 `pnpm build`
2. 在 demo 目录执行了 `pnpm install`

### 生成失败

如果生成失败，使用详细模式查看错误：

```bash
pnpm generate:check
```

### 检查配置

查看当前配置是否正确：

```bash
pnpm config
```

## 📚 下一步

- 查看 [DEMO_GUIDE.md](./DEMO_GUIDE.md) 了解完整功能
- 查看 [README.md](./README.md) 了解详细说明
- 修改 `orval-forge.config.js` 自定义配置
- 探索 `src/examples/` 中的示例代码
