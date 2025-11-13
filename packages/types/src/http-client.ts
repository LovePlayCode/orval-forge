/**
 * HTTP 请求方法
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

/**
 * 请求配置接口
 */
export interface RequestConfig {
  /** 请求 URL */
  url: string;
  /** 请求方法 */
  method: HttpMethod;
  /** 请求参数 (查询参数) */
  params?: Record<string, any>;
  /** 请求体数据 */
  data?: any;
  /** 请求头 */
  headers?: Record<string, string>;
  /** 超时时间 */
  timeout?: number;
  /** 基础 URL */
  baseURL?: string;
}

/**
 * 响应接口
 */
export interface ApiResponse<T = any> {
  /** 响应数据 */
  data: T;
  /** HTTP 状态码 */
  status: number;
  /** 状态文本 */
  statusText: string;
  /** 响应头 */
  headers: Record<string, string>;
  /** 原始响应对象 */
  raw?: any;
}

/**
 * 错误响应接口
 */
export interface ApiError extends Error {
  /** 错误码 */
  code?: string | number;
  /** HTTP 状态码 */
  status?: number;
  /** 响应数据 */
  response?: ApiResponse;
  /** 请求配置 */
  config?: RequestConfig;
}

/**
 * 拦截器接口
 */
export interface Interceptors {
  /** 请求拦截器 */
  request?: {
    use: (
      onFulfilled?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>,
      onRejected?: (error: any) => any
    ) => void;
  };
  /** 响应拦截器 */
  response?: {
    use: (
      onFulfilled?: (response: ApiResponse) => ApiResponse | Promise<ApiResponse>,
      onRejected?: (error: ApiError) => any
    ) => void;
  };
}

/**
 * HTTP 客户端基础接口
 */
export interface IHttpClient {
  /** 发送请求 */
  request<T = any>(config: RequestConfig): Promise<ApiResponse<T>>;
  
  /** GET 请求 */
  get<T = any>(url: string, params?: Record<string, any>, config?: Partial<RequestConfig>): Promise<ApiResponse<T>>;
  
  /** POST 请求 */
  post<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>>;
  
  /** PUT 请求 */
  put<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>>;
  
  /** DELETE 请求 */
  delete<T = any>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>>;
  
  /** PATCH 请求 */
  patch<T = any>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>>;
  
  /** 拦截器 */
  interceptors: Interceptors;
  
  /** 设置基础 URL */
  setBaseURL(baseURL: string): void;
  
  /** 设置默认请求头 */
  setDefaultHeaders(headers: Record<string, string>): void;
  
  /** 设置默认超时时间 */
  setTimeout(timeout: number): void;
}