import { MyRequest } from '@orval-forge/my-request';
import { MyMiniRequest } from '@orval-forge/my-mini-request';
import type { IHttpClient, HttpClientType, HttpClientConfig } from '@orval-forge/types';

/**
 * 创建 HTTP 客户端工厂函数
 */
export function createHttpClient(config: HttpClientConfig): IHttpClient {
  const { type, ...clientConfig } = config;
  
  switch (type) {
    case 'MyRequest':
      return new MyRequest({
        baseURL: clientConfig.baseURL,
        timeout: clientConfig.timeout,
        headers: clientConfig.headers,
        retry: clientConfig.errorHandling?.retry,
        retryCount: clientConfig.errorHandling?.retryCount,
        retryDelay: clientConfig.errorHandling?.retryDelay,
      });
      
    case 'MyMiniRequest':
      return new MyMiniRequest({
        baseURL: clientConfig.baseURL,
        timeout: clientConfig.timeout,
        headers: clientConfig.headers,
      });
      
    default:
      throw new Error(`Unsupported HTTP client type: ${type}`);
  }
}

/**
 * 获取可用的 HTTP 客户端类型列表
 */
export function getAvailableClientTypes(): HttpClientType[] {
  return ['MyRequest', 'MyMiniRequest'];
}

/**
 * 检查 HTTP 客户端类型是否支持
 */
export function isClientTypeSupported(type: string): type is HttpClientType {
  return getAvailableClientTypes().includes(type as HttpClientType);
}