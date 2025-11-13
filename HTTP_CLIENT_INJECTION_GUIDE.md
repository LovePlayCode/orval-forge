# HTTP 客户端注入功能说明

## 🎯 功能概述

OrvalForge 现在支持**自动注入自定义 HTTP 客户端**到 Orval 生成的代码中。用户只需在 `orval-forge.config.js` 中配置 `httpClient.type`，系统会自动将对应的 mutator 注入到 Orval 配置中。

## ✨ 核心特性

1. **内置 Mutator 文件**：项目根目录 `mutators/` 文件夹包含预定义的 HTTP 客户端
2. **自动注入**：根据配置自动将 mutator 路径添加到 Orval 配置的 `override.mutator` 中
3. **零配置**：用户无需手动配置 mutator 路径，只需选择客户端类型即可

## 📁 项目结构

```
orval-forge/
├── mutators/                      # 内置 mutator 文件
│   ├── my-request.ts             # MyRequest 客户端 mutator
│   └── my-mini-request.ts        # MyMiniRequest 客户端 mutator
└── packages/
    └── core/
        └── src/
            └── lib/
                └── generator.ts   # 自动注入逻辑
```

## 🔧 使用方法

### 1. 配置 `orval-forge.config.js`

```javascript
module.exports = {
  // Orval 原生配置
  orval: {
    blogApi: {
      input: './swagger.json',
      output: {
        mode: 'split',
        target: './generated/api.ts',
        schemas: './generated/models',
        clean: true,
      },
    },
  },
  
  // HTTP 客户端配置
  httpClient: {
    type: 'MyRequest',  // 或 'MyMiniRequest'
    baseURL: 'https://api.example.com',
    timeout: 10000,
    // ... 其他配置
  },
};
```

### 2. 运行生成命令

```bash
pnpm generate
```

### 3. 查看生成结果

生成的 `api.ts` 文件会自动导入和使用自定义的 HTTP 客户端：

```typescript
// generated/api.ts
import { customInstance } from '../../../mutators/my-request';

export const getPosts = (
  options?: SecondParameter<typeof customInstance>
) => {
  return customInstance<Post[]>({
    url: '/posts',
    method: 'GET',
  }, options);
};
```

## 🎨 内置 HTTP 客户端

### MyRequest - 功能丰富型

**文件**: `mutators/my-request.ts`

**特点**:
- ✅ 完整的请求/响应拦截器
- ✅ 统一错误处理（401, 403, 404, 500 等）
- ✅ 支持请求取消
- ✅ 详细的日志输出
- ✅ 适合企业级应用

**示例**:
```typescript
// 创建 axios 实例
export const myRequestInstance = axios.create({
  baseURL: process.env.API_BASE_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
myRequestInstance.interceptors.request.use(
  (config) => {
    console.log('MyRequest: 发送请求', config.url);
    // 添加 token
    return config;
  }
);

// 响应拦截器  
myRequestInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 统一错误处理
    switch (error.response?.status) {
      case 401: console.error('未授权'); break;
      case 403: console.error('无权限'); break;
      // ...
    }
    return Promise.reject(error);
  }
);
```

### MyMiniRequest - 轻量级

**文件**: `mutators/my-mini-request.ts`

**特点**:
- ✅ 轻量级实现
- ✅ 基础拦截器支持
- ✅ 简单日志输出
- ✅ 适合简单应用

**示例**:
```typescript
// 创建轻量级 axios 实例
export const myMiniRequestInstance = axios.create({
  baseURL: process.env.API_BASE_URL || '',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 简单拦截器
myMiniRequestInstance.interceptors.request.use(
  (config) => {
    console.log('MyMiniRequest: 发送请求', config.url);
    return config;
  }
);
```

## ⚙️ 实现原理

### 1. 配置处理流程

```
用户配置 (orval-forge.config.js)
         ↓
  读取 httpClient.type
         ↓
  选择对应的 mutator 文件
         ↓
  注入到 orval 配置
         ↓
  生成临时配置文件
         ↓
  调用 orval 生成代码
```

### 2. 核心代码

**`packages/core/src/lib/generator.ts`**:

```typescript
/**
 * 准备 Orval 配置
 */
private prepareOrvalConfig(): any {
  const { orval, httpClient } = this.config;
  
  // 根据 httpClient.type 确定 mutator 路径
  const mutatorPath = this.getMutatorPath(httpClient.type);
  
  // 处理每个 orval 配置
  Object.entries(orval).forEach(([key, config]) => {
    const output = { ...config.output };
    
    // 注入 mutator 配置（如果用户没有配置）
    if (!output.override) {
      output.override = {};
    }
    if (!output.override.mutator && mutatorPath) {
      output.override.mutator = {
        path: mutatorPath,        // 内置 mutator 文件路径
        name: 'customInstance',   // 导出的函数名
      };
      console.log(`📦 OrvalForge: 注入 HTTP 客户端 mutator: ${httpClient.type}`);
    }
  });
  
  return processedOrval;
}

/**
 * 获取内置 mutator 文件路径
 */
private getMutatorPath(clientType: string): string | null {
  const mutatorMap: Record<string, string> = {
    'MyRequest': 'my-request.ts',
    'MyMiniRequest': 'my-mini-request.ts',
  };
  
  const mutatorFile = mutatorMap[clientType];
  if (!mutatorFile) {
    return null;
  }
  
  // 返回项目根目录 mutators 文件夹中的文件路径
  const mutatorPath = path.resolve(__dirname, '../../../../mutators', mutatorFile);
  return mutatorPath;
}
```

### 3. 注入前后对比

**注入前** (用户的 orval-forge.config.js):
```javascript
{
  orval: {
    blogApi: {
      input: './swagger.json',
      output: {
        target: './generated/api.ts',
        schemas: './generated/models',
      },
    },
  },
  httpClient: {
    type: 'MyRequest',  // 只需配置类型
  },
}
```

**注入后** (传递给 orval 的临时配置):
```javascript
{
  blogApi: {
    input: '/absolute/path/to/swagger.json',
    output: {
      target: '/absolute/path/to/generated/api.ts',
      schemas: '/absolute/path/to/generated/models',
      override: {
        mutator: {
          path: '/absolute/path/to/mutators/my-request.ts',
          name: 'customInstance',
        },
      },
    },
  },
}
```

## 📝 自定义 Mutator

如果需要自定义 mutator 行为，有两种方式：

### 方式 1: 修改内置 mutator 文件

直接编辑 `mutators/my-request.ts` 或 `mutators/my-mini-request.ts`：

```typescript
// mutators/my-request.ts

// 自定义请求拦截器
myRequestInstance.interceptors.request.use(
  (config) => {
    // 添加自定义逻辑
    const token = getAuthToken(); // 你的 token 获取函数
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加请求 ID
    config.headers['X-Request-ID'] = generateRequestId();
    
    return config;
  }
);

// 自定义响应拦截器
myRequestInstance.interceptors.response.use(
  (response) => {
    // 处理响应数据
    if (response.data?.code !== 0) {
      return Promise.reject(new Error(response.data?.message));
    }
    return response;
  },
  (error) => {
    // 自定义错误处理
    showErrorNotification(error);
    return Promise.reject(error);
  }
);
```

### 方式 2: 在配置中手动覆盖

如果不想使用内置 mutator，可以在配置中手动指定：

```javascript
module.exports = {
  orval: {
    blogApi: {
      input: './swagger.json',
      output: {
        target: './generated/api.ts',
        schemas: './generated/models',
        override: {
          mutator: {
            path: './my-custom-mutator.ts',  // 自定义路径
            name: 'customInstance',
          },
        },
      },
    },
  },
  httpClient: {
    type: 'MyRequest',  // 这个配置会被忽略
  },
};
```

## 🔍 调试信息

生成时会输出以下日志：

```bash
🔥 OrvalForge: Starting code generation...
📦 OrvalForge: 注入 HTTP 客户端 mutator: MyRequest
📋 OrvalForge: Using orval configuration: [ 'blogApi' ]
📋 OrvalForge: Working directory: /path/to/project
📝 OrvalForge: Created temporary config file
🎉 blogApi - Your OpenAPI spec has been converted into ready to use orval!
✅ OrvalForge: Code generation completed successfully!
```

## 🎓 最佳实践

1. **选择合适的客户端类型**
   - 企业级应用 → `MyRequest`
   - 简单应用 → `MyMiniRequest`

2. **环境变量配置**
   ```bash
   # .env
   API_BASE_URL=https://api.production.com
   ```

3. **自定义拦截器**
   - 在 mutator 文件中添加业务逻辑
   - 统一处理认证、错误、日志等

4. **类型安全**
   - 生成的代码保持完整的 TypeScript 类型
   - 使用 `SecondParameter<typeof customInstance>` 类型

## 🐛 故障排除

### 问题 1: mutator 文件找不到

**症状**: `Error: ENOENT: no such file or directory`

**解决**: 确保项目根目录存在 `mutators/` 文件夹和对应的 `.ts` 文件

### 问题 2: 生成的代码没有使用 customInstance

**检查**:
1. 确认 `httpClient.type` 配置正确
2. 查看生成日志是否有 "注入 HTTP 客户端 mutator" 消息
3. 检查生成的 `api.ts` 文件的 import 语句

### 问题 3: TypeScript 编译错误

**症状**: `Cannot find module 'axios'`

**解决**: 确保项目安装了 axios 依赖
```bash
pnpm add axios
```

## 📚 相关文档

- [Orval Mutator 文档](https://orval.dev/guides/custom-axios)
- [Axios 拦截器文档](https://axios-http.com/docs/interceptors)
- [OrvalForge 示例](./examples/)

---

**版本**: 1.0.0  
**更新时间**: 2025-11-13
