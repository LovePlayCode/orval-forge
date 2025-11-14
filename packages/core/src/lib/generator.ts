import { generate as orvalGenerate } from 'orval';
import type { OrvalForgeConfig } from '@orval-forge/types';
import { generateCustomTemplates } from './templates';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

/**
 * OrvalForge 代码生成器
 */
export class OrvalForgeGenerator {
  private config: OrvalForgeConfig;

  constructor(config: OrvalForgeConfig) {
    this.config = config;
  }

  /**
   * 生成 API 代码
   */
  async generate(_configPath?: string): Promise<void> {
    try {
      console.log('🔥 OrvalForge: Starting code generation...');

      // 1. 验证配置
      this.validateConfig();

      // 2. 准备 Orval 配置
      const orvalConfig = this.prepareOrvalConfig();

      // 3. 生成自定义模板
      if (this.config.output?.templatePath) {
        await generateCustomTemplates(this.config);
      }

      // 4. 运行 Orval 生成
      // 始终使用临时配置文件，确保 orval 能正确识别配置
      await this.generateWithTempConfig(orvalConfig);

      // 5. 后处理生成的代码
      await this.postProcessGeneration();

      console.log('✅ OrvalForge: Code generation completed successfully!');
    } catch (error) {
      console.error('❌ OrvalForge: Code generation failed:', error);
      throw error;
    }
  }

  /**
   * 验证配置
   */
  private validateConfig(): void {
    if (!this.config.orval) {
      throw new Error('Orval configuration is required');
    }

    if (!this.config.httpClient) {
      throw new Error('HTTP client configuration is required');
    }

    const supportedTypes = ['MyRequest', 'MyMiniRequest'];
    if (!supportedTypes.includes(this.config.httpClient.type)) {
      throw new Error(
        `Unsupported HTTP client type: ${this.config.httpClient.type}`
      );
    }
  }

  /**
   * 准备 Orval 配置
   */
  private prepareOrvalConfig(): any {
    const { orval } = this.config;

    // 验证 orval 配置
    if (!orval || Object.keys(orval).length === 0) {
      throw new Error('Orval configuration is empty or invalid');
    }

    // 处理相对路径，转换为绝对路径
    const processedOrval: any = {};

    Object.entries(orval).forEach(([key, config]) => {
      if (!config.input) {
        throw new Error(`Config "${key}" requires an input`);
      }
      if (!config.output) {
        throw new Error(`Config "${key}" requires an output`);
      }
      if (!config.output.target) {
        throw new Error(`Config "${key}" output requires a target`);
      }

      // 处理路径，确保使用绝对路径
      const processedConfig = { ...config };

      // 处理 input 路径
      if (
        typeof processedConfig.input === 'string' &&
        !path.isAbsolute(processedConfig.input)
      ) {
        processedConfig.input = path.resolve(
          process.cwd(),
          processedConfig.input
        );
      }

      // 处理 output 路径
      if (processedConfig.output) {
        const output = { ...processedConfig.output };

        if (output.target && !path.isAbsolute(output.target)) {
          output.target = path.resolve(process.cwd(), output.target);
        }

        if (output.schemas && !path.isAbsolute(output.schemas)) {
          output.schemas = path.resolve(process.cwd(), output.schemas);
        }

        // 注入 mutator 配置（如果用户没有配置）
        const mutatorPath = this.getMutatorPath(this.config.httpClient.type);
        if (!output.override) {
          output.override = {};
        }
        if (!output.override.mutator && mutatorPath) {
          output.override.mutator = {
            path: mutatorPath,
            name: 'customInstance',
          };
          console.log(
            `📦 OrvalForge: 注入 HTTP 客户端 mutator: ${this.config.httpClient.type}`
          );
        }

        processedConfig.output = output;
      }

      processedOrval[key] = processedConfig;
    });

    console.log(
      '📋 OrvalForge: Using orval configuration:',
      Object.keys(processedOrval)
    );
    console.log('📋 OrvalForge: Working directory:', process.cwd());
    return processedOrval;
  }

  /**
   * 后处理生成的代码
   */
  private async postProcessGeneration(): Promise<void> {
    console.log('🔧 OrvalForge: Post-processing generated code...');

    // TODO: 实现后处理逻辑
    // 1. 替换默认的 HTTP 客户端为自定义客户端
    // 2. 添加自定义的类型定义
    // 3. 优化生成的代码格式
    // 4. 添加自定义注释和文档

    console.log('✨ OrvalForge: Post-processing completed');
  }

  /**
   * 使用临时配置文件生成
   */
  private async generateWithTempConfig(orvalConfig: any): Promise<void> {
    const tempDir = os.tmpdir();
    const tempConfigPath = path.join(tempDir, `orval-${Date.now()}.config.js`);

    try {
      // 创建临时配置文件
      const configContent = `module.exports = ${JSON.stringify(orvalConfig, null, 2)};`;
      fs.writeFileSync(tempConfigPath, configContent);

      console.log('📝 OrvalForge: Created temporary config file');

      // 使用临时配置文件生成
      await orvalGenerate(tempConfigPath);
    } finally {
      // 清理临时文件
      try {
        if (fs.existsSync(tempConfigPath)) {
          fs.unlinkSync(tempConfigPath);
        }
      } catch (error) {
        // 忽略清理错误
        console.warn(
          '⚠️ OrvalForge: Failed to cleanup temp config file:',
          error
        );
      }
    }
  }

  /**
   * 根据 httpClient.type 获取内置 mutator 文件的绝对路径
   */
  private getMutatorPath(clientType: string): string | null {
    const mutatorMap: Record<string, string> = {
      MyRequest: 'my-request.ts',
      MyMiniRequest: 'my-mini-request.ts',
    };

    const mutatorFile = mutatorMap[clientType];
    if (!mutatorFile) {
      return null;
    }

    // 返回项目根目录的 mutators 文件夹中的文件路径
    // 从当前文件向上找到项目根目录
    const mutatorPath = path.resolve(
      __dirname,
      '../../../../mutators',
      mutatorFile
    );
    return mutatorPath;
  }

  /**
   * 获取配置
   */
  getConfig(): OrvalForgeConfig {
    return this.config;
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<OrvalForgeConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig,
      httpClient: {
        ...this.config.httpClient,
        ...newConfig.httpClient,
      },
      output: {
        ...this.config.output,
        ...newConfig.output,
      },
      generation: {
        ...this.config.generation,
        ...newConfig.generation,
      },
    };
  }
}
