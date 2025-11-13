# @orval-forge/core

OrvalForge 核心代码生成引擎，提供基于 Orval 的扩展功能。

## 📦 安装

```bash
npm install @orval-forge/core
# 或
pnpm add @orval-forge/core
```

## 🚀 快速开始

```typescript
import { createOrvalForge, generateApi } from '@orval-forge/core';

// 方式 1: 快速生成
await generateApi('./orval-forge.config.js');

// 方式 2: 使用生成器实例
const orvalForge = await createOrvalForge('./orval-forge.config.js');
await orvalForge.generate();
```

## 🔧 配置

```typescript
import type { OrvalForgeConfig } from '@orval-forge/core';

const config: OrvalForgeConfig = {
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

## 📚 文档

查看 [主文档](../../README.md) 了解完整使用指南。

## 🔗 相关包

- [@orval-forge/types](../types) - 类型定义
- [@orval-forge/cli](../cli) - 命令行工具
- [orval-forge](../orval-forge) - 主包

## 📄 许可证

MIT
