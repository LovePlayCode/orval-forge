#!/usr/bin/env node

/**
 * OrvalForge Demo 本地开发环境设置脚本
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 开始设置 OrvalForge Demo 本地开发环境...\n');

const rootDir = path.resolve(__dirname, '../..');
const demoDir = __dirname;

try {
  // 1. 构建主项目
  console.log('📦 构建 OrvalForge 主项目...');
  process.chdir(rootDir);
  execSync('npm install', { stdio: 'inherit' });
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ 主项目构建完成\n');

  // 2. 检查 CLI 是否可用
  console.log('🔍 检查 CLI 可用性...');
  const cliPath = path.join(rootDir, 'bin/orval-forge.js');
  if (!fs.existsSync(cliPath)) {
    throw new Error('CLI 文件不存在，请确保主项目构建成功');
  }
  
  // 测试 CLI
  execSync(`node "${cliPath}" --help`, { stdio: 'pipe' });
  console.log('✅ CLI 检查通过\n');

  // 3. 安装 demo 依赖
  console.log('📦 安装 Demo 项目依赖...');
  process.chdir(demoDir);
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Demo 依赖安装完成\n');

  // 4. 生成 API 代码测试
  console.log('🔧 测试 API 代码生成...');
  execSync('npm run api:generate', { stdio: 'inherit' });
  console.log('✅ API 代码生成测试通过\n');

  // 5. 检查生成的文件
  const generatedDir = path.join(demoDir, 'generated');
  if (fs.existsSync(generatedDir)) {
    const files = fs.readdirSync(generatedDir);
    console.log('📁 生成的文件:');
    files.forEach(file => console.log(`  - ${file}`));
    console.log('');
  }

  console.log('🎉 OrvalForge Demo 环境设置完成！');
  console.log('');
  console.log('📋 可用命令:');
  console.log('  npm start              - 运行完整演示');
  console.log('  npm run example:basic  - 运行基础示例');
  console.log('  npm run api:watch      - 监听模式');
  console.log('  npm run dev            - 开发模式');
  console.log('');
  console.log('📚 查看文档: cat README.md');
  console.log('🚀 开始体验: npm start');

} catch (error) {
  console.error('❌ 设置过程中发生错误:');
  console.error(error.message);
  process.exit(1);
}