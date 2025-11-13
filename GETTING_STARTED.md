# 🚀 OrvalForge 入门指南

这份指南将帮助你快速上手 OrvalForge CLI，从零开始创建一个完整的 API 项目。

## 📋 前置要求

- Node.js >= 16.0.0
- npm >= 7.0.0 (或 yarn/pnpm)
- 一个 OpenAPI/Swagger 规范文件

## 🎯 30秒快速开始

```bash
# 1. 全局安装 OrvalForge
npm install -g orval-forge

# 2. 创建新项目
mkdir my-api-project && cd my-api-project
npm init -y

# 3. 安装 OrvalForge（本地）
npm install orval-forge --save-dev

# 4. 初始化配置
npx orval-forge init

# 5. 生成 API 代码
npx orval-forge generate
```

## 📝 详细步骤

### 第一步：项目初始化

```bash
# 创建项目目录
mkdir my-awesome-api && cd my-awesome-api

# 初始化 package.json
npm init -y

# 安装依赖
npm install orval-forge --save-dev
npm install typescript @types/node --save-dev
```

### 第二步：创建 OpenAPI 规范文件

创建 `swagger.json`（或从现有 API 获取）：

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "My API",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "https://api.example.com/v1"
    }
  ],
  "paths": {
    "/users": {
      "get": {
        "summary": "Get users",
        "operationId": "getUsers",
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "User": {
        "type": "object",
        "properties": {
          "id": { "type": "integer" },
          "name": { "type": "string" },
          "email": { "type": "string" }
        }
      }
    }
  }
}
```

### 第三步：初始化 OrvalForge 配置

```bash
# 使用默认设置初始化
npx orval-forge init

# 或者指定选项
npx orval-forge init --type MyRequest --format js
```

这会创建 `orval-forge.config.js` 文件：

```javascript
module.exports = {
  orval: {
    myApi: {
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
    baseURL: 'https://api.example.com/v1',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    interceptors: {
      request: true,
      response: true,
    },
    errorHandling: {
      retry: true,
      retryCount: 3,
      retryDelay: 1000,
    },
  },
};
```

### 第四步：配置 package.json 脚本

编辑 `package.json`，添加有用的脚本：

```json
{
  "scripts": {
    "api:generate": "orval-forge generate",
    "api:watch": "orval-forge generate --watch",
    "api:check": "orval-forge generate --dry-run",
    "api:validate": "orval-forge config --validate",
    "dev": "npm run api:generate && npm start",
    "build": "npm run api:generate && npm run build:app"
  }
}
```

### 第五步：生成 API 代码

```bash
# 验证配置
npm run api:validate

# 生成代码
npm run api:generate

# 或者使用监听模式（开发时推荐）
npm run api:watch
```

生成的文件结构：
```
src/
├── api/
│   ├── endpoints.ts    # API 函数
│   └── models/         # 类型定义
│       ├── index.ts
│       └── User.ts
```

### 第六步：使用生成的 API

创建 `src/userService.ts`：

```typescript
import { getUsers } from './api/endpoints';
import type { User } from './api/models';

export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await getUsers();
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
}

// 使用
fetchUsers().then(users => {
  console.log('Users:', users);
});
```

## 🔧 常用配置

### 多环境配置

创建不同环境的配置文件：

`configs/dev.config.js`:
```javascript
module.exports = {
  orval: {
    myApi: {
      input: './swagger-dev.json',
      output: {
        mode: 'split',
        target: './src/api/endpoints.ts',
        schemas: './src/api/models',
      },
    },
  },
  httpClient: {
    type: 'MyRequest',
    baseURL: 'https://dev-api.example.com/v1',
    timeout: 15000,
  },
};
```

更新 `package.json`：
```json
{
  "scripts": {
    "api:dev": "orval-forge generate -c ./configs/dev.config.js",
    "api:prod": "orval-forge generate -c ./configs/prod.config.js"
  }
}
```

### 自动化工作流

使用 `husky` 和 `lint-staged` 实现自动化：

```bash
npm install husky lint-staged --save-dev
```

更新 `package.json`：
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "swagger.json": [
      "npm run api:validate",
      "npm run api:generate"
    ]
  }
}
```

## 💡 最佳实践

### 1. 开发工作流

```bash
# 开发模式 - 启动监听
npm run api:watch

# 在另一个终端启动应用
npm start
```

### 2. 构建部署

```bash
# 构建前自动生成最新 API
npm run build
```

### 3. CI/CD 集成

`.github/workflows/api-check.yml`:
```yaml
name: API Check
on: [push, pull_request]

jobs:
  api-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npx orval-forge config --validate
      - run: npx orval-forge generate --dry-run
```

## 🚨 故障排除

### 常见问题

**Q: 找不到配置文件**
```bash
# 检查配置文件是否存在
ls -la | grep orval-forge

# 重新初始化
npx orval-forge init --force
```

**Q: 生成失败**
```bash
# 验证配置
npx orval-forge config --validate

# 查看详细错误
npx orval-forge generate --dry-run --verbose
```

**Q: HTTP 客户端类型错误**
```bash
# 查看支持的类型
npx orval-forge info

# 重新初始化正确的类型
npx orval-forge init --type MyMiniRequest --force
```

### 调试技巧

1. **使用 `--verbose` 查看详细日志**
   ```bash
   npx orval-forge generate --verbose
   ```

2. **使用 `--dry-run` 测试配置**
   ```bash
   npx orval-forge generate --dry-run
   ```

3. **检查配置文件**
   ```bash
   npx orval-forge config --show
   ```

## 🎉 下一步

现在你已经成功设置了 OrvalForge！接下来可以：

1. 📖 阅读 [CLI 详细文档](./docs/CLI.md)
2. 🔍 查看 [完整使用示例](./examples/cli-usage.md)  
3. 🛠️ 探索 [高级配置选项](./README.md#配置选项)
4. 🤝 参与项目贡献

Happy coding! 🚀