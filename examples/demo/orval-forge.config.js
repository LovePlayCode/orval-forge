// OrvalForge Demo 配置文件
module.exports = {
  // Orval 原生配置
  orval: {
    blogApi: {
      input: './swagger.yaml', // OpenAPI 规范文件路径
      output: {
        mode: 'split', // 分割模式：分开生成文件
        target: './generated/api.ts', // API 函数输出文件
        schemas: './generated/model2s', // 类型定义输出目录
        clean: true, // 生成前清理目录
        prettier: true, // 使用 prettier 格式化生成的代码
        override: {
          // 自定义生成选项
          operations: {
            // 为所有操作添加标签
            tags: true,
          },
        },
      },
    },
  },

  // HTTP 客户端配置
  httpClient: {
    type: 'MyMiniRequest', // 使用功能丰富的客户端
    baseURL: 'https://jsonplaceholder.typicode.com', // 基础 URL，使用 JSONPlaceholder 作为模拟 API
    timeout: 10000, // 超时时间 10 秒
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'OrvalForge-Demo/1.0.0',
      Accept: 'application/json',
    },
    interceptors: {
      request: true, // 启用请求拦截器
      response: true, // 启用响应拦截器
    },
    errorHandling: {
      retry: true, // 启用自动重试
      retryCount: 3, // 重试 3 次
      retryDelay: 1000, // 重试间隔 1 秒
    },
    customConfig: {
      // 自定义配置项
      enableCache: false, // 禁用缓存（demo 环境）
      logRequests: true, // 记录请求日志
    },
  },

  // 输出配置
  output: {
    generateTypes: true, // 生成 TypeScript 类型定义
    generateClient: true, // 生成客户端代码
    templatePath: undefined, // 使用默认模板
  },

  // 代码生成配置
  generation: {
    strict: true, // 启用严格模式
    comments: true, // 生成详细注释
    naming: {
      interfacePrefix: 'I', // 接口名前缀
      typeSuffix: 'Type', // 类型名后缀
    },
  },
};
