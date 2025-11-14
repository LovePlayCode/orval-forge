import type { 
  IHttpClient, 
  RequestConfig, 
  ApiResponse, 
  ApiError, 
  Interceptors 
} from '@orval-forge/types';

/**
 * MyRequest 客户端配置
 */
export interface MyRequestConfig {
  /** 基础 URL */
  baseURL?: string;
  /** 默认超时时间 */
  timeout?: number;
  /** 默认请求头 */
  headers?: Record<string, string>;
  /** 是否启用请求重试 */
  retry?: boolean;
  /** 重试次数 */
  retryCount?: number;
  /** 重试延迟 */
  retryDelay?: number;
}

/**
 * MyRequest HTTP 客户端
 * 
 * 这是一个功能丰富的 HTTP 客户端，适用于复杂的企业级应用
 * 支持请求/响应拦截器、自动重试、错误处理等高级功能
 */
export class MyRequest implements IHttpClient {
  private config: MyRequestConfig;
  private requestInterceptors: Array<(config: RequestConfig) => RequestConfig | Promise<RequestConfig>> = [];
  private responseInterceptors: Array<(response: ApiResponse) => ApiResponse | Promise<ApiResponse>> = [];
  private errorInterceptors: Array<(error: ApiError) => any> = [];

  constructor(config: MyRequestConfig = {}) {
    this.config = {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      retry: true,
      retryCount: 3,
      retryDelay: 1000,
      ...config,
    };
  }

  /**
   * 拦截器
   */
  public interceptors: Interceptors = {
    request: {
      use: (onFulfilled, onRejected) => {
        if (onFulfilled) {
          this.requestInterceptors.push(onFulfilled);
        }
        if (onRejected) {
          this.errorInterceptors.push(onRejected);
        }
      },
    },
    response: {
      use: (onFulfilled, onRejected) => {
        if (onFulfilled) {
          this.responseInterceptors.push(onFulfilled);
        }
        if (onRejected) {
          this.errorInterceptors.push(onRejected);
        }
      },
    },
  };

  /**
   * 发送 HTTP 请求
   */
  async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    // TODO: 实现具体的请求逻辑
    console.log('MyRequest: Sending request with config:', config);
    
    // 占位实现 - 返回模拟响应
    return {
      data: {} as T,
      status: 200,
      statusText: 'OK',
      headers: {},
      raw: null,
    };
  }

  /**
   * GET 请求
   */
  async get<T = any>(
    url: string, 
    params?: Record<string, any>, 
    config?: Partial<RequestConfig>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'GET',
      params,
      ...config,
    });
  }

  /**
   * POST 请求
   */
  async post<T = any>(
    url: string, 
    data?: any, 
    config?: Partial<RequestConfig>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      ...config,
    });
  }

  /**
   * PUT 请求
   */
  async put<T = any>(
    url: string, 
    data?: any, 
    config?: Partial<RequestConfig>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      ...config,
    });
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(
    url: string, 
    config?: Partial<RequestConfig>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'DELETE',
      ...config,
    });
  }

  /**
   * PATCH 请求
   */
  async patch<T = any>(
    url: string, 
    data?: any, 
    config?: Partial<RequestConfig>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'PATCH',
      data,
      ...config,
    });
  }

  /**
   * 设置基础 URL
   */
  setBaseURL(baseURL: string): void {
    this.config.baseURL = baseURL;
  }

  /**
   * 设置默认请求头
   */
  setDefaultHeaders(headers: Record<string, string>): void {
    this.config.headers = {
      ...this.config.headers,
      ...headers,
    };
  }

  /**
   * 设置默认超时时间
   */
  setTimeout(timeout: number): void {
    this.config.timeout = timeout;
  }

  /**
   * 获取当前配置
   */
  getConfig(): MyRequestConfig {
    return { ...this.config };
  }

  /**
   * 重置配置
   */
  resetConfig(config: MyRequestConfig): void {
    this.config = { ...config };
  }
}