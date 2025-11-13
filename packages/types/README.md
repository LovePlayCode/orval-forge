# @orval-forge/types

共享的 TypeScript 类型定义，用于 OrvalForge 项目。

## 📦 安装

```bash
npm install @orval-forge/types
# 或
pnpm add @orval-forge/types
```

## 📖 使用

```typescript
import type { 
  HttpClientConfig, 
  HttpClientType,
  IHttpClient,
  OrvalForgeConfig 
} from '@orval-forge/types';

const config: HttpClientConfig = {
  type: 'MyRequest',
  baseURL: 'https://api.example.com',
  timeout: 10000,
};
```

## 🔗 相关包

- [@orval-forge/core](../core) - 核心代码生成引擎
- [@orval-forge/cli](../cli) - 命令行工具
- [orval-forge](../orval-forge) - 主包

## 📄 许可证

MIT
