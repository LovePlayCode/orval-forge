#!/usr/bin/env node

import { program } from 'commander';
import { OrvalForgeGenerator } from '@orval-forge/core';
import type { OrvalForgeConfig, HttpClientType } from '@orval-forge/types';
import * as fs from 'fs';
import * as path from 'path';
// 直接导入 package.json（TypeScript/Node.js 原生支持）
import packageJson from '../../package.json';

/**
 * 查找配置文件
 */
async function findConfigFile(): Promise<string | null> {
  const configFiles = [
    'orval-forge.config.js',
    'orval-forge.config.json',
    'orval-forge.config.ts',
  ];

  for (const configFile of configFiles) {
    if (fs.existsSync(configFile)) {
      return path.resolve(configFile);
    }
  }

  return null;
}

/**
 * 加载配置文件
 */
async function loadConfig(configPath: string): Promise<OrvalForgeConfig> {
  try {
    if (configPath.endsWith('.json')) {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(configContent);
    } else {
      // 对于 .js 和 .ts 文件，需要动态 require
      const configModule = await import(path.resolve(configPath));
      return configModule.default || configModule;
    }
  } catch (error) {
    throw new Error(`Failed to load config from ${configPath}: ${error}`);
  }
}

/**
 * 获取可用的 HTTP 客户端类型
 */
function getAvailableClientTypes(): HttpClientType[] {
  return ['MyRequest', 'MyMiniRequest'];
}

/**
 * CLI 主程序
 */
async function main() {
  program
    .name('orval-forge')
    .description(
      '🔥 OrvalForge - A powerful wrapper around Orval with custom HTTP client integration'
    )
    .version(packageJson.version);

  // generate 命令
  program
    .command('generate')
    .alias('g')
    .description('Generate API code from OpenAPI/Swagger specification')
    .option('-c, --config <path>', 'Path to config file')
    .option('-w, --watch', 'Watch for changes and regenerate')
    .option(
      '--dry-run',
      'Show what would be generated without actually generating'
    )
    .option('--verbose', 'Show detailed output')
    .action(async (options) => {
      try {
        console.log('🔥 OrvalForge CLI - Generate Command');

        if (options.verbose) {
          console.log('Options:', options);
        }

        const configPath = options.config || (await findConfigFile());

        if (!configPath) {
          console.error(
            '❌ No config file found. Please create orval-forge.config.js or specify path with -c'
          );
          process.exit(1);
        }

        if (options.dryRun) {
          console.log('🔍 Dry run mode - analyzing configuration...');
          const config = await loadConfig(configPath);
          console.log('📋 Configuration loaded successfully:');
          console.log(`   - HTTP Client: ${config.httpClient.type}`);
          console.log(
            `   - Orval Configs: ${Object.keys(config.orval).join(', ')}`
          );
          console.log('✅ Configuration is valid');
          return;
        }

        // 加载配置并生成代码
        const config = await loadConfig(configPath);

        const generator = new OrvalForgeGenerator(config);

        if (options.watch) {
          console.log('👀 Watch mode enabled');
          // TODO: 实现文件监听功能
          console.log('⚠️  Watch mode is not implemented yet');
          return;
        }

        await generator.generate(configPath);
      } catch (error) {
        console.error(
          '❌ Generation failed:',
          error instanceof Error ? error.message : String(error)
        );
        if (options.verbose) {
          console.error('Full error:', error);
        }
        process.exit(1);
      }
    });

  // init 命令
  program
    .command('init')
    .description('Initialize a new OrvalForge configuration')
    .option(
      '--client <type>',
      'HTTP client type (MyRequest, MyMiniRequest)',
      'MyRequest'
    )
    .option('--output <path>', 'Output directory', './generated')
    .option('--input <path>', 'OpenAPI specification path or URL')
    .action(async (options) => {
      try {
        console.log('🚀 OrvalForge CLI - Init Command');

        const availableClients = getAvailableClientTypes();
        if (!availableClients.includes(options.client as HttpClientType)) {
          console.error(`❌ Invalid client type: ${options.client}`);
          console.error(`Available types: ${availableClients.join(', ')}`);
          process.exit(1);
        }

        if (!options.input) {
          console.error(
            '❌ Input specification is required. Use --input <path>'
          );
          process.exit(1);
        }

        const configTemplate: OrvalForgeConfig = {
          orval: {
            api: {
              input: options.input,
              output: {
                target: `${options.output}/api.ts`,
                mode: 'single',
                client: 'axios',
              },
            },
          },
          httpClient: {
            type: options.client as HttpClientType,
            baseURL: 'https://api.example.com',
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

        const configPath = 'orval-forge.config.js';
        const configContent = `// OrvalForge Configuration
// Generated by OrvalForge CLI

module.exports = ${JSON.stringify(configTemplate, null, 2)};
`;

        fs.writeFileSync(configPath, configContent);
        console.log(`✅ Configuration file created: ${configPath}`);
        console.log(
          '📝 You can now edit the configuration and run: orval-forge generate'
        );
      } catch (error) {
        console.error(
          '❌ Init failed:',
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    });

  // config 命令
  program
    .command('config')
    .description('Show current configuration')
    .option('-c, --config <path>', 'Path to config file')
    .action(async (options) => {
      try {
        console.log('⚙️  OrvalForge CLI - Config Command');

        const configPath = options.config || (await findConfigFile());

        if (!configPath) {
          console.error('❌ No config file found');
          process.exit(1);
        }

        const config = await loadConfig(configPath);
        console.log('📋 Current configuration:');
        console.log(JSON.stringify(config, null, 2));
      } catch (error) {
        console.error(
          '❌ Config command failed:',
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    });

  // info 命令
  program
    .command('info')
    .description('Show OrvalForge information')
    .action(() => {
      console.log('ℹ️  OrvalForge Information');
      console.log(`Version: ${packageJson.version}`);
      console.log(
        `Available HTTP Clients: ${getAvailableClientTypes().join(', ')}`
      );
      console.log('');
      console.log(
        '📚 Documentation: https://github.com/your-username/orval-forge'
      );
      console.log(
        '🐛 Issues: https://github.com/your-username/orval-forge/issues'
      );
    });

  // 解析命令行参数
  program.parse(process.argv);

  // 如果没有提供命令，显示帮助
  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
}

// 导出主函数和工具函数
export { main, findConfigFile, loadConfig, getAvailableClientTypes };

// 如果直接运行此文件，执行主函数
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ CLI failed:', error);
    process.exit(1);
  });
}
