# 🚀 OrvalForge Demo

这是一个完整的 OrvalForge 使用演示项目，展示了如何使用 OrvalForge 从 OpenAPI 规范生成类型安全的 API 客户端代码。

## 📋 项目概述

这个 demo 包含：
- 📄 完整的 OpenAPI 3.0 规范文件 (`swagger.json`)
- ⚙️ OrvalForge 配置文件 (`orval-forge.config.js`)
- 🎯 使用生成 API 的示例代码
- 🔧 完整的开发工作流演示

## 🏗️ 项目结构

```
demo/
├── README.md                    # 本文档
├── package.json                 # 项目配置和脚本
├── swagger.json                 # OpenAPI 规范文件
├── orval-forge.config.js        # OrvalForge 配置
├── src/
│   ├── index.ts                 # 主程序入口
│   ├── services/
│   │   ├── userService.ts       # 用户服务示例
│   │   └── postService.ts       # 文章服务示例
│   └── examples/
│       ├── basic-usage.ts       # 基础使用示例
│       ├── advanced-usage.ts    # 高级使用示例
│       └── error-handling.ts    # 错误处理示例
└── generated/                   # 生成的 API 代码 (运行后创建)
    ├── api.ts                   # API 函数
    └── models/                  # 类型定义
        ├── index.ts
        ├── User.ts
        ├── Post.ts
        └── ...
```

## 🚀 快速开始

> **注意**: 由于 OrvalForge 还未发布到 npm，需要先设置本地开发环境。

### 方法一：一键设置（推荐）

```bash
# 在项目根目录执行
npm run demo:setup
cd examples/demo
npm start
```

### 方法二：手动设置

```bash
# 1. 在项目根目录构建 OrvalForge
cd ../../
npm install
npm run build

# 2. 回到 demo 目录
cd examples/demo

# 3. 运行设置脚本
npm run setup

# 4. 运行演示
npm start
```

### 方法三：分步执行

#### 1. 构建主项目

```bash
# 在项目根目录
npm install
npm run build
```

#### 2. 安装 Demo 依赖

```bash
cd examples/demo
npm install
```

#### 3. 生成 API 代码

```bash
# 使用 OrvalForge CLI 生成
npm run api:generate

# 或者使用监听模式 (推荐开发时使用)
npm run api:watch
```

### 3. 运行示例

```bash
# 运行所有示例
npm start

# 运行特定示例
npm run example:basic
npm run example:advanced
npm run example:error-handling
```

## 📚 API 规范说明

这个 demo 使用了一个模拟的博客 API，包含以下端点：

### 用户管理
- `GET /users` - 获取用户列表
- `GET /users/{id}` - 获取用户详情
- `POST /users` - 创建用户
- `PUT /users/{id}` - 更新用户
- `DELETE /users/{id}` - 删除用户

### 文章管理
- `GET /posts` - 获取文章列表
- `GET /posts/{id}` - 获取文章详情
- `POST /posts` - 创建文章
- `PUT /posts/{id}` - 更新文章
- `DELETE /posts/{id}` - 删除文章

### 评论管理
- `GET /posts/{postId}/comments` - 获取文章评论
- `POST /posts/{postId}/comments` - 添加评论

## 🎯 使用示例

### 基础使用

```typescript
import { getUsers, createUser } from '../generated/api';
import type { User, CreateUserRequest } from '../generated/models';

// 获取所有用户
const users = await getUsers();
console.log('Users:', users.data);

// 创建新用户
const newUser: CreateUserRequest = {
  name: 'John Doe',
  email: 'john@example.com'
};
const createdUser = await createUser(newUser);
console.log('Created user:', createdUser.data);
```

### 高级使用 (带拦截器)

```typescript
import { MyRequest } from 'orval-forge';

// 创建自定义客户端实例
const apiClient = new MyRequest({
  baseURL: 'https://api.example.com/v1',
  timeout: 10000
});

// 添加请求拦截器
apiClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getAuthToken()}`;
  return config;
});

// 添加响应拦截器
apiClient.interceptors.response.use((response) => {
  console.log('API Response:', response.status);
  return response;
});
```

### 错误处理

```typescript
import { getUserById } from '../generated/api';

try {
  const user = await getUserById({ id: 999 });
  console.log('User found:', user.data);
} catch (error) {
  if (error.response?.status === 404) {
    console.log('User not found');
  } else {
    console.error('API Error:', error.message);
  }
}
```

## ⚙️ 配置说明

### OrvalForge 配置 (`orval-forge.config.js`)

```javascript
module.exports = {
  // Orval 原生配置
  orval: {
    blogApi: {
      input: './swagger.json',           // OpenAPI 规范文件
      output: {
        mode: 'split',                   // 分割模式：分开生成文件
        target: './generated/api.ts',    // API 函数输出文件
        schemas: './generated/models',   // 类型定义输出目录
        clean: true,                     // 生成前清理目录
      },
    },
  },
  
  // HTTP 客户端配置
  httpClient: {
    type: 'MyRequest',                   // 使用功能丰富的客户端
    baseURL: 'https://jsonplaceholder.typicode.com', // 基础 URL
    timeout: 10000,                      // 超时时间
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'OrvalForge-Demo/1.0.0',
    },
    interceptors: {
      request: true,                     // 启用请求拦截器
      response: true,                    // 启用响应拦截器
    },
    errorHandling: {
      retry: true,                       // 启用重试
      retryCount: 3,                     // 重试次数
      retryDelay: 1000,                  // 重试延迟
    },
  },
  
  // 输出配置
  output: {
    generateTypes: true,                 // 生成类型定义
    generateClient: true,                // 生成客户端代码
  },
  
  // 代码生成配置
  generation: {
    strict: true,                        // 严格模式
    comments: true,                      // 生成注释
    naming: {
      interfacePrefix: 'I',              // 接口前缀
      typeSuffix: 'Type',                // 类型后缀
    },
  },
};
```

### Package.json 脚本

```json
{
  "scripts": {
    "api:generate": "orval-forge generate",
    "api:watch": "orval-forge generate --watch",
    "api:validate": "orval-forge config --validate",
    "start": "npm run api:generate && ts-node src/index.ts",
    "example:basic": "npm run api:generate && ts-node src/examples/basic-usage.ts",
    "example:advanced": "npm run api:generate && ts-node src/examples/advanced-usage.ts",
    "example:error-handling": "npm run api:generate && ts-node src/examples/error-handling.ts"
  }
}
```

## 🔄 开发工作流

### 日常开发

1. **启动监听模式**
   ```bash
   npm run api:watch
   ```

2. **在另一个终端运行代码**
   ```bash
   npm start
   ```

3. **修改 OpenAPI 规范**
   - 编辑 `swagger.json`
   - OrvalForge 会自动重新生成代码

### 生产构建

```bash
# 验证配置
npm run api:validate

# 生成最新代码
npm run api:generate

# 构建应用
npm run build
```

## 🎨 自定义配置

### 使用不同的 HTTP 客户端

```javascript
// 使用轻量级客户端
module.exports = {
  httpClient: {
    type: 'MyMiniRequest',  // 轻量级客户端
    baseURL: 'https://api.example.com',
    timeout: 5000,
  },
};
```

### 多环境配置

创建不同环境的配置文件：

```bash
# 开发环境
npm run api:generate -c ./configs/dev.config.js

# 生产环境
npm run api:generate -c ./configs/prod.config.js
```

## 📊 性能对比

| 特性 | 手写 API | OrvalForge |
|------|---------|------------|
| 开发时间 | 2-3 hours | 2-3 minutes |
| 类型安全 | 手动维护 | 自动生成 |
| API 同步 | 手动更新 | 自动同步 |
| 错误处理 | 自己实现 | 内置支持 |
| 拦截器 | 自己实现 | 内置支持 |

## 🚨 常见问题

### Q: 生成的代码在哪里？
A: 在 `generated/` 目录下，包括 `api.ts` 和 `models/` 文件夹。

### Q: 如何自定义 HTTP 客户端？
A: 修改 `orval-forge.config.js` 中的 `httpClient.type` 字段。

### Q: 如何添加认证头？
A: 使用拦截器或在配置中设置默认 headers。

### Q: 支持哪些 OpenAPI 版本？
A: 支持 OpenAPI 3.0+ 和 Swagger 2.0。

## 🔗 相关链接

- [OrvalForge 主页](../README.md)
- [CLI 文档](../docs/CLI.md)
- [入门指南](../GETTING_STARTED.md)
- [Orval 官方文档](https://orval.dev/)

## 📝 许可证

MIT License - 详见 [LICENSE](../../LICENSE) 文件。