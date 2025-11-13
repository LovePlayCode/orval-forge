# orval-forge

一个强大的 Orval 二次封装工具，支持自定义 HTTP 客户端集成。

这是 OrvalForge 的主包，聚合了所有子包的功能。

## 📦 安装

```bash
npm install orval-forge --save-dev
# 或
pnpm add orval-forge --save-dev
```

## 🚀 快速开始

### 1. 创建配置文件

```javascript
// orval-forge.config.js
module.exports = {
  orval: {
    petstore: {
      input: './swagger.json',
      output: {
        mode: 'split',
        target: './src/api/endpoints.ts',
        schemas: './src/api/models',
      },
    },
  },
  httpClient: {
    type: 'MyRequest',
    baseURL: 'https://api.example.com',
    timeout: 10000,
  },
};
```

### 2. 生成 API 代码

```typescript
import { generateApi } from 'orval-forge';

await generateApi('./orval-forge.config.js');
```

### 3. 使用生成的 API

```typescript
import { getUser, createUser } from './src/api/endpoints';

const user = await getUser({ id: 1 });
const newUser = await createUser({ name: 'John' });
```

## 📚 完整文档

查看 [主文档](../../README.md) 了解：
- 完整的配置选项
- HTTP 客户端使用
- CLI 工具使用
- 最佳实践

## 📦 包含的子包

此包自动引入以下依赖：

- `@orval-forge/core` - 核心代码生成引擎
- `@orval-forge/my-request` - 功能丰富的 HTTP 客户端
- `@orval-forge/my-mini-request` - 轻量级 HTTP 客户端
- `@orval-forge/types` - TypeScript 类型定义

## 🔗 相关资源

- [GitHub 仓库](https://github.com/your-org/orval-forge)
- [问题反馈](https://github.com/your-org/orval-forge/issues)
- [贡献指南](../../CONTRIBUTING.md)

## 📄 许可证

MIT
