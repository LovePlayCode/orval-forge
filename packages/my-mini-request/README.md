# @orval-forge/my-mini-request

轻量级 HTTP 客户端，支持微信小程序环境。

## 📦 安装

```bash
npm install @orval-forge/my-mini-request
# 或
pnpm add @orval-forge/my-mini-request
```

## 🚀 使用

### 在 Node.js 中使用

```typescript
import { MyMiniRequest } from '@orval-forge/my-mini-request';

const client = new MyMiniRequest({
  baseURL: 'https://api.example.com',
  timeout: 5000,
});

// GET 请求
const response = await client.get('/users');

// POST 请求
const newUser = await client.post('/users', {
  name: 'John Doe',
});
```

### 在微信小程序中使用

```typescript
import { MyMiniRequest } from '@orval-forge/my-mini-request';

const client = new MyMiniRequest({
  baseURL: 'https://api.example.com',
  timeout: 5000,
});

// 自动适配微信小程序的 wx.request
const response = await client.get('/users');
```

## ✨ 特性

- ✅ 轻量级设计
- ✅ 微信小程序支持
- ✅ TypeScript 支持
- ✅ 统一的 API 接口
- ✅ 自动环境检测

## 🔧 配置选项

```typescript
interface MyMiniRequestConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}
```

## 🌍 环境支持

- ✅ Node.js
- ✅ 浏览器
- ✅ 微信小程序
- ✅ 其他小程序环境

## 📚 文档

查看 [主文档](../../README.md) 了解完整使用指南。

## 🔗 相关包

- [@orval-forge/my-request](../my-request) - 功能丰富的客户端
- [@orval-forge/types](../types) - 类型定义
- [orval-forge](../orval-forge) - 主包

## 📄 许可证

MIT
