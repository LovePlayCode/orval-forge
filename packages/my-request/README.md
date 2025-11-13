# @orval-forge/my-request

功能丰富的 HTTP 客户端，支持拦截器、重试等高级功能。

## 📦 安装

```bash
npm install @orval-forge/my-request
# 或
pnpm add @orval-forge/my-request
```

## 🚀 使用

### 基本使用

```typescript
import { MyRequest } from '@orval-forge/my-request';

const client = new MyRequest({
  baseURL: 'https://api.example.com',
  timeout: 10000,
});

// GET 请求
const response = await client.get('/users');

// POST 请求
const newUser = await client.post('/users', {
  name: 'John Doe',
  email: 'john@example.com',
});
```

### 拦截器

```typescript
// 请求拦截器
client.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getToken()}`;
  return config;
});

// 响应拦截器
client.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status);
    return response;
  },
  (error) => {
    console.error('Error:', error.message);
    throw error;
  }
);
```

### 重试机制

```typescript
const client = new MyRequest({
  baseURL: 'https://api.example.com',
  retry: true,
  retryCount: 3,
  retryDelay: 1000,
});
```

## ✨ 特性

- ✅ 请求/响应拦截器
- ✅ 自动重试机制
- ✅ 错误处理
- ✅ 请求缓存
- ✅ 超时控制
- ✅ TypeScript 支持

## 🔧 配置选项

```typescript
interface MyRequestConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  retry?: boolean;
  retryCount?: number;
  retryDelay?: number;
  cache?: boolean;
  cacheTimeout?: number;
}
```

## 📚 文档

查看 [主文档](../../README.md) 了解完整使用指南。

## 🔗 相关包

- [@orval-forge/my-mini-request](../my-mini-request) - 轻量级客户端
- [@orval-forge/types](../types) - 类型定义
- [orval-forge](../orval-forge) - 主包

## 📄 许可证

MIT
