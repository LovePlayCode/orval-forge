/**
 * MyMiniRequest Mutator for Orval
 * 这是一个轻量级的 mutator，适用于简单场景
 */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// 创建轻量级 axios 实例
export const myMiniRequestInstance = axios.create({
  baseURL: process.env.API_BASE_URL || '',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 简单的请求拦截器
myMiniRequestInstance.interceptors.request.use(
  (config) => {
    console.log('MyMiniRequest: 发送请求', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 简单的响应拦截器
myMiniRequestInstance.interceptors.response.use(
  (response) => {
    console.log('MyMiniRequest: 收到响应', response.status);
    return response;
  },
  (error) => {
    console.error('MyMiniRequest: 请求失败', error.message);
    return Promise.reject(error);
  }
);

/**
 * Orval 自定义实例函数（轻量级版本）
 */
export const customInstance = () => {
  const wx = {
    request: () => {},
  };
  return wx.request();
};

export default customInstance;
