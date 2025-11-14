import type {
  IHttpClient,
  RequestConfig,
  ApiResponse,
  Interceptors,
} from '@orval-forge/types';

/**
 * MyMiniRequest 客户端配置
 */
export interface MyMiniRequestConfig {
  /** 基础 URL */
  baseURL?: string;
  /** 默认超时时间 */
  timeout?: number;
  /** 默认请求头 */
  headers?: Record<string, string>;
}

/**
 * MyMiniRequest HTTP 客户端
 *
 * 这是一个轻量级的 HTTP 客户端，适用于简单的应用场景
 * 提供基本的 HTTP 请求功能，体积小，性能高
 */
export class MyMiniRequest implements IHttpClient {
  private config: MyMiniRequestConfig;

  constructor(config: MyMiniRequestConfig = {}) {
    this.config = {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    };
  }

  /**
   * 简化的拦截器实现
   * 注意: MyMiniRequest 提供基础的拦截器支持，功能相对简单
   */
  public interceptors: Interceptors = {
    request: {
      use: (_onFulfilled, _onRejected) => {
        // TODO: 实现简单的请求拦截器
        console.log('MyMiniRequest: Request interceptor registered');
      },
    },
    response: {
      use: (_onFulfilled, _onRejected) => {
        // TODO: 实现简单的响应拦截器
        console.log('MyMiniRequest: Response interceptor registered');
      },
    },
  };

  /**
   * 发送 HTTP 请求
   */
  async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    // TODO: 实现轻量级的请求逻辑
    console.log('MyMiniRequest: Sending request with config:', config);

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
  getConfig(): MyMiniRequestConfig {
    return { ...this.config };
  }
}
