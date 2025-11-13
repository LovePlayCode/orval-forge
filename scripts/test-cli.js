#!/usr/bin/env node

/**
 * CLI 测试脚本
 * 用于验证 CLI 功能是否正常工作
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 OrvalForge CLI 测试脚本');
console.log('='.repeat(50));

// 测试构建
console.log('1. 构建项目...');
try {
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ 构建成功');
} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}

// 测试 CLI 基本命令
console.log('2. 测试 CLI 基本命令...');

const testCommands = [
  {
    name: '显示帮助',
    command: 'node bin/orval-forge.js --help',
    shouldContain: ['Usage:', 'Commands:', 'Options:'],
  },
  {
    name: '显示版本',
    command: 'node bin/orval-forge.js --version',
    shouldContain: ['1.0.0'],
  },
  {
    name: '显示信息',
    command: 'node bin/orval-forge.js info',
    shouldContain: ['OrvalForge Information', 'Available HTTP Clients'],
  },
];

for (const test of testCommands) {
  try {
    console.log(`   测试: ${test.name}`);
    const output = execSync(test.command, { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    // 检查输出是否包含预期内容
    const hasExpectedContent = test.shouldContain.every(content => 
      output.includes(content)
    );
    
    if (hasExpectedContent) {
      console.log(`   ✅ ${test.name} 通过`);
    } else {
      console.log(`   ❌ ${test.name} 失败 - 输出内容不符合预期`);
      console.log('   实际输出:', output);
    }
  } catch (error) {
    console.error(`   ❌ ${test.name} 失败:`, error.message);
  }
}

// 测试初始化命令
console.log('3. 测试初始化命令...');
const testDir = path.join(__dirname, '../test-temp');

// 创建临时测试目录
if (fs.existsSync(testDir)) {
  fs.rmSync(testDir, { recursive: true });
}
fs.mkdirSync(testDir);

try {
  // 切换到测试目录
  process.chdir(testDir);
  
  // 测试初始化
  console.log('   测试: 初始化配置文件');
  execSync('node ../bin/orval-forge.js init --type MyRequest --format js', {
    stdio: 'pipe'
  });
  
  // 检查配置文件是否创建
  const configFile = path.join(testDir, 'orval-forge.config.js');
  if (fs.existsSync(configFile)) {
    console.log('   ✅ 配置文件创建成功');
    
    // 检查配置文件内容
    const configContent = fs.readFileSync(configFile, 'utf8');
    if (configContent.includes('MyRequest') && configContent.includes('module.exports')) {
      console.log('   ✅ 配置文件内容正确');
    } else {
      console.log('   ❌ 配置文件内容不正确');
    }
  } else {
    console.log('   ❌ 配置文件未创建');
  }
  
  // 测试配置验证
  console.log('   测试: 配置验证');
  try {
    const output = execSync('node ../bin/orval-forge.js config --validate', {
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    if (output.includes('Configuration is valid')) {
      console.log('   ✅ 配置验证通过');
    } else {
      console.log('   ❌ 配置验证失败');
      console.log('   输出:', output);
    }
  } catch (error) {
    console.log('   ⚠️  配置验证失败 (可能是因为缺少 swagger 文件):', error.message);
  }
  
} catch (error) {
  console.error('   ❌ 初始化测试失败:', error.message);
} finally {
  // 清理测试目录
  process.chdir(__dirname);
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true });
  }
}

console.log('='.repeat(50));
console.log('🎉 CLI 测试完成！');

console.log('');
console.log('📋 后续测试建议:');
console.log('1. 手动运行: npm run cli:test');
console.log('2. 创建实际的 swagger.json 文件测试完整流程');
console.log('3. 测试监听模式: orval-forge generate --watch');
console.log('4. 测试不同配置格式: --format ts, --format json');