// 由于 Orval 可能没有导出 Config 类型，我们自己定义基础类型
export interface OrvalConfig {
  [key: string]: {
    input: string | object;
    output: {
      target: string;
      mode?: 'single' | 'split' | 'tags' | 'tags-split';
      schemas?: string;
      client?: string;
      mock?: boolean;
      override?: {
        mutator?: {
          path: string;
          name: string;
        };
        [key: string]: any;
      };
    };
    hooks?: object;
  };
}

/**
 * 支持的 HTTP 客户端类型
 */
export type HttpClientType = 'MyRequest' | 'MyMiniRequest';

/**
 * HTTP 客户端配置接口
 */
export interface HttpClientConfig {
  /** 客户端类型 */
  type: HttpClientType;
  /** 基础 URL */
  baseURL?: string;
  /** 超时时间 (毫秒) */
  timeout?: number;
  /** 请求头 */
  headers?: Record<string, string>;
  /** 请求拦截器配置 */
  interceptors?: {
    request?: boolean;
    response?: boolean;
  };
  /** 错误处理配置 */
  errorHandling?: {
    retry?: boolean;
    retryCount?: number;
    retryDelay?: number;
  };
  /** 自定义配置 */
  customConfig?: Record<string, any>;
}

/**
 * OrvalForge 配置接口
 */
export interface OrvalForgeConfig {
  /** Orval 原生配置 */
  orval: OrvalConfig;
  /** HTTP 客户端配置 */
  httpClient: HttpClientConfig;
  /** 输出配置 */
  output?: {
    /** 是否生成类型定义 */
    generateTypes?: boolean;
    /** 是否生成客户端代码 */
    generateClient?: boolean;
    /** 自定义模板路径 */
    templatePath?: string;
  };
  /** 代码生成配置 */
  generation?: {
    /** 是否使用严格模式 */
    strict?: boolean;
    /** 是否生成注释 */
    comments?: boolean;
    /** 命名约定 */
    naming?: {
      /** 接口命名前缀 */
      interfacePrefix?: string;
      /** 类型命名后缀 */
      typeSuffix?: string;
    };
  };
}

/**
 * 默认配置
 */
export const defaultConfig: Partial<OrvalForgeConfig> = {
  httpClient: {
    type: 'MyRequest',
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
  output: {
    generateTypes: true,
    generateClient: true,
  },
  generation: {
    strict: true,
    comments: true,
    naming: {
      interfacePrefix: 'I',
      typeSuffix: 'Type',
    },
  },
};