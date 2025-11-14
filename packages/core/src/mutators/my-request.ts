/**
 * MyRequest Mutator for Orval
 * 这个文件作为 orval 的 mutator，提供功能丰富的 HTTP 客户端
 */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

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
    // 可以在这里添加认证 token 等
    // const token = getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    console.error('MyRequest: 请求错误', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
myRequestInstance.interceptors.response.use(
  (response) => {
    console.log('MyRequest: 收到响应', response.status);
    return response;
  },
  (error) => {
    console.error('MyRequest: 响应错误', error);

    // 统一错误处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('未授权，请重新登录');
          break;
        case 403:
          console.error('没有权限访问');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器错误');
          break;
        default:
          console.error('请求失败');
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Orval 自定义实例函数
 */
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  const source = axios.CancelToken.source();
  const promise = myRequestInstance({
    ...config,
    ...options,
    cancelToken: source.token,
  });

  // @ts-expect-error: Adding cancel method to promise
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

export default customInstance;
