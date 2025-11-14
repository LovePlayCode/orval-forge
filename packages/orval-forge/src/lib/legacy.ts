import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { OrvalForgeGenerator } from '@orval-forge/core';
import type { OrvalForgeConfig } from '@orval-forge/types';

/**
 * 生成 API 代码 (向后兼容的函数)
 */
export async function generateApi(config: OrvalForgeConfig, configPath?: string): Promise<void> {
  try {
    console.log('🔥 OrvalForge: Starting code generation...');
    
    let finalConfigPath = configPath;
    
    // 如果没有提供配置路径，创建临时配置文件
    if (!finalConfigPath) {
      const tempDir = os.tmpdir();
      const tempConfigPath = path.join(tempDir, `orval-forge-${Date.now()}.config.js`);
      
      // 将配置对象写入临时文件
      const configContent = `module.exports = ${JSON.stringify(config, null, 2)};`;
      fs.writeFileSync(tempConfigPath, configContent);
      
      finalConfigPath = tempConfigPath;
      
      // 确保在完成后清理临时文件
      process.on('exit', () => {
        try {
          if (fs.existsSync(tempConfigPath)) {
            fs.unlinkSync(tempConfigPath);
          }
        } catch (error) {
          // 忽略清理错误
        }
      });
    }
    
    // 使用新的生成器
    const generator = new OrvalForgeGenerator(config);
    await generator.generate(finalConfigPath);
    
  } catch (error) {
    console.error('❌ OrvalForge: Code generation failed:', error);
    throw error;
  }
}

/**
 * 创建 OrvalForge 实例 (向后兼容的函数)
 */
export function createOrvalForge(config: OrvalForgeConfig): OrvalForgeGenerator {
  return new OrvalForgeGenerator(config);
}