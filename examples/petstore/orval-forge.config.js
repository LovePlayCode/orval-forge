// OrvalForge 配置文件 - Petstore 示例
module.exports = {
  // Orval 原生配置
  orval: {
    petstore: {
      input: './swagger.json', // OpenAPI 规范文件路径
      output: {
        mode: 'split', // 分离模式，生成多个文件
        target: './generated/api/endpoints.ts', // API 函数输出路径
        schemas: './generated/api/models', // 类型定义输出路径
        client: 'axios', // 这个会被 OrvalForge 覆盖
        clean: true, // 清理旧文件
        prettier: true, // 格式化生成的代码
      },
    },
  },
  
  // HTTP 客户端配置
  httpClient: {
    type: 'MyRequest', // 使用功能丰富的 MyRequest 客户端
    baseURL: 'https://petstore.swagger.io/v2', // API 基础 URL
    timeout: 10000, // 请求超时时间
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'OrvalForge-Example/1.0.0',
    },
    interceptors: {
      request: true, // 启用请求拦截器
      response: true, // 启用响应拦截器
    },
    errorHandling: {
      retry: true, // 启用重试
      retryCount: 3, // 重试次数
      retryDelay: 1000, // 重试延迟 (毫秒)
    },
    customConfig: {
      // 自定义配置项
      enableCache: true,
      cacheTimeout: 300000, // 5分钟缓存
      enableLogging: true,
    },
  },
  
  // 输出配置
  output: {
    generateTypes: true, // 生成类型定义
    generateClient: true, // 生成客户端代码
    templatePath: './templates', // 自定义模板路径（可选）
  },
  
  // 代码生成配置
  generation: {
    strict: true, // 严格模式
    comments: true, // 生成注释
    naming: {
      interfacePrefix: 'I', // 接口命名前缀
      typeSuffix: 'Type', // 类型命名后缀
    },
  },
};