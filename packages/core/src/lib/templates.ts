import { writeFileSync, mkdirSync, existsSync } from 'fs';
// import { dirname } from 'path';
import type { OrvalForgeConfig } from '@orval-forge/types';

/**
 * 生成自定义模板
 */
export async function generateCustomTemplates(
  config: OrvalForgeConfig
): Promise<void> {
  const { httpClient, output } = config;

  if (!output?.templatePath) {
    return;
  }

  console.log('📝 OrvalForge: Generating custom templates...');

  // 确保模板目录存在
  if (!existsSync(output.templatePath)) {
    mkdirSync(output.templatePath, { recursive: true });
  }

  // 根据 HTTP 客户端类型生成不同的模板
  switch (httpClient.type) {
    case 'MyRequest':
      await generateMyRequestTemplates(config);
      break;
    case 'MyMiniRequest':
      await generateMyMiniRequestTemplates(config);
      break;
    default:
      throw new Error(`Unsupported HTTP client type: ${httpClient.type}`);
  }

  console.log('✅ OrvalForge: Custom templates generated');
}

/**
 * 生成 MyRequest 模板
 */
async function generateMyRequestTemplates(
  config: OrvalForgeConfig
): Promise<void> {
  const templatePath = config.output!.templatePath!;

  // API 客户端模板
  const apiTemplate = `
import { MyRequest } from '@orval-forge/my-request';
import type { ApiResponse } from '@orval-forge/types';

// 创建 HTTP 客户端实例
const httpClient = new MyRequest({
  baseURL: '{{baseURL}}',
  timeout: {{timeout}},
  headers: {
    {{#headers}}
    '{{@key}}': '{{.}}',
    {{/headers}}
  },
});

{{#operations}}
{{#operation}}
/**
 * {{summary}}
 * {{description}}
 */
export async function {{operationId}}(
  {{#allParams}}
  {{paramName}}: {{dataType}}{{#hasMore}},{{/hasMore}}
  {{/allParams}}
): Promise<ApiResponse<{{returnType}}>> {
  return httpClient.{{httpMethod.toLowerCase()}}(
    '{{path}}'{{#hasBodyParams}},
    {
      {{#bodyParams}}
      {{paramName}},
      {{/bodyParams}}
    }{{/hasBodyParams}}{{#hasQueryParams}},
    {
      {{#queryParams}}
      {{paramName}},
      {{/queryParams}}
    }{{/hasQueryParams}}
  );
}

{{/operation}}
{{/operations}}
`;

  writeFileSync(`${templatePath}/api-client.mustache`, apiTemplate);

  // 类型定义模板
  const typesTemplate = `
{{#models}}
{{#model}}
/**
 * {{description}}
 */
export interface {{classname}} {
  {{#vars}}
  {{#description}}
  /** {{description}} */
  {{/description}}
  {{name}}{{^required}}?{{/required}}: {{datatype}};
  {{/vars}}
}

{{/model}}
{{/models}}
`;

  writeFileSync(`${templatePath}/types.mustache`, typesTemplate);
}

/**
 * 生成 MyMiniRequest 模板
 */
async function generateMyMiniRequestTemplates(
  config: OrvalForgeConfig
): Promise<void> {
  const templatePath = config.output!.templatePath!;

  // 简化的 API 客户端模板
  const apiTemplate = `
import { MyMiniRequest } from '@orval-forge/my-mini-request';

// 创建轻量级 HTTP 客户端实例
const httpClient = new MyMiniRequest({
  baseURL: '{{baseURL}}',
  timeout: {{timeout}},
});

{{#operations}}
{{#operation}}
export const {{operationId}} = async (
  {{#allParams}}
  {{paramName}}: {{dataType}}{{#hasMore}},{{/hasMore}}
  {{/allParams}}
) => {
  return httpClient.{{httpMethod.toLowerCase()}}('{{path}}'{{#hasBodyParams}}, {
    {{#bodyParams}}{{paramName}},{{/bodyParams}}
  }{{/hasBodyParams}});
};

{{/operation}}
{{/operations}}
`;

  writeFileSync(`${templatePath}/mini-api-client.mustache`, apiTemplate);
}

/**
 * 生成通用工具模板
 */
export function generateUtilityTemplates(templatePath: string): void {
  // 错误处理工具
  const errorHandlerTemplate = `
import type { ApiError } from '@orval-forge/types';

export function handleApiError(error: ApiError): void {
  console.error('API Error:', {
    message: error.message,
    status: error.status,
    code: error.code,
    config: error.config,
  });

  // 可以在这里添加全局错误处理逻辑
  // 例如：显示错误提示、重定向到错误页面等
}

export function isApiError(error: any): error is ApiError {
  return error && typeof error.status === 'number';
}
`;

  writeFileSync(`${templatePath}/error-handler.ts`, errorHandlerTemplate);

  // 请求拦截器模板
  const interceptorTemplate = `
import type { RequestConfig, ApiResponse } from '@orval-forge/types';

// 请求拦截器
export function requestInterceptor(config: RequestConfig): RequestConfig {
  // 添加认证 token
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: \`Bearer \${token}\`,
    };
  }

  // 添加请求时间戳
  config.headers = {
    ...config.headers,
    'X-Request-Time': Date.now().toString(),
  };

  return config;
}

// 响应拦截器
export function responseInterceptor(response: ApiResponse): ApiResponse {
  // 处理响应数据
  console.log('Response received:', {
    status: response.status,
    url: response.config?.url,
    duration: Date.now() - parseInt(response.config?.headers?.['X-Request-Time'] || '0'),
  });

  return response;
}
`;

  writeFileSync(`${templatePath}/interceptors.ts`, interceptorTemplate);
}
