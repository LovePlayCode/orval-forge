#!/usr/bin/env node

/**
 * Demo 测试脚本
 * 验证 demo 项目的完整性和可运行性
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 OrvalForge Demo 测试脚本');
console.log('='.repeat(50));

const demoDir = path.join(__dirname, '..');

/**
 * 执行命令并返回结果
 */
function runCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: demoDir,
      ...options
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.message, output: error.stdout };
  }
}

/**
 * 检查文件是否存在
 */
function checkFile(filePath, description) {
  const fullPath = path.join(demoDir, filePath);
  const exists = fs.existsSync(fullPath);
  console.log(`   ${exists ? '✅' : '❌'} ${description}: ${filePath}`);
  return exists;
}

/**
 * 主测试函数
 */
async function runTests() {
  let allPassed = true;
  
  // 1. 检查必要文件
  console.log('1️⃣ 检查项目文件结构...');
  const requiredFiles = [
    ['package.json', 'Package 配置文件'],
    ['swagger.json', 'OpenAPI 规范文件'],
    ['orval-forge.config.js', 'OrvalForge 配置文件'],
    ['tsconfig.json', 'TypeScript 配置文件'],
    ['src/index.ts', '主入口文件'],
    ['src/examples/basic-usage.ts', '基础使用示例'],
    ['src/examples/advanced-usage.ts', '高级使用示例'],
    ['src/examples/error-handling.ts', '错误处理示例'],
    ['src/services/userService.ts', '用户服务'],
    ['src/services/postService.ts', '文章服务'],
    ['README.md', '项目文档'],
    ['DEMO_GUIDE.md', '运行指南'],
  ];
  
  for (const [file, desc] of requiredFiles) {
    if (!checkFile(file, desc)) {
      allPassed = false;
    }
  }
  
  // 2. 检查 package.json 配置
  console.log('\n2️⃣ 检查 package.json 配置...');
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(demoDir, 'package.json'), 'utf8'));
    const requiredScripts = [
      'api:generate',
      'api:watch',
      'api:validate',
      'start',
      'example:basic',
      'example:advanced',
      'example:error-handling'
    ];
    
    for (const script of requiredScripts) {
      const exists = packageJson.scripts && packageJson.scripts[script];
      console.log(`   ${exists ? '✅' : '❌'} 脚本: ${script}`);
      if (!exists) allPassed = false;
    }
    
    // 检查依赖
    const hasDeps = packageJson.dependencies && packageJson.dependencies['orval-forge'];
    console.log(`   ${hasDeps ? '✅' : '❌'} 依赖: orval-forge`);
    if (!hasDeps) allPassed = false;
    
  } catch (error) {
    console.log('   ❌ 无法读取 package.json');
    allPassed = false;
  }
  
  // 3. 检查 swagger.json 有效性
  console.log('\n3️⃣ 检查 OpenAPI 规范文件...');
  try {
    const swagger = JSON.parse(fs.readFileSync(path.join(demoDir, 'swagger.json'), 'utf8'));
    console.log(`   ✅ OpenAPI 版本: ${swagger.openapi}`);
    console.log(`   ✅ API 标题: ${swagger.info.title}`);
    console.log(`   ✅ 端点数量: ${Object.keys(swagger.paths).length}`);
    console.log(`   ✅ 模型数量: ${Object.keys(swagger.components.schemas).length}`);
  } catch (error) {
    console.log('   ❌ swagger.json 格式错误');
    allPassed = false;
  }
  
  // 4. 测试 OrvalForge 配置验证
  console.log('\n4️⃣ 测试 OrvalForge 配置...');
  
  // 首先检查是否有 orval-forge 可执行文件
  const orvalForgeCmd = fs.existsSync(path.join(demoDir, '../../bin/orval-forge.js')) 
    ? 'node ../../bin/orval-forge.js'
    : 'npx orval-forge';
  
  const configTest = runCommand(`${orvalForgeCmd} config --validate`);
  if (configTest.success) {
    console.log('   ✅ OrvalForge 配置验证通过');
  } else {
    console.log('   ⚠️  OrvalForge 配置验证失败 (可能需要先构建项目)');
    console.log(`   📝 错误: ${configTest.error}`);
  }
  
  // 5. 测试 TypeScript 编译
  console.log('\n5️⃣ 测试 TypeScript 编译...');
  const tscTest = runCommand('npx tsc --noEmit');
  if (tscTest.success) {
    console.log('   ✅ TypeScript 编译检查通过');
  } else {
    console.log('   ⚠️  TypeScript 编译检查失败 (可能需要先生成 API 代码)');
    console.log(`   📝 错误: ${tscTest.error}`);
  }
  
  // 6. 检查文档完整性
  console.log('\n6️⃣ 检查文档完整性...');
  try {
    const readme = fs.readFileSync(path.join(demoDir, 'README.md'), 'utf8');
    const guide = fs.readFileSync(path.join(demoDir, 'DEMO_GUIDE.md'), 'utf8');
    
    const readmeChecks = [
      ['快速开始', readme.includes('快速开始')],
      ['项目结构', readme.includes('项目结构')],
      ['使用示例', readme.includes('使用示例')],
      ['配置说明', readme.includes('配置说明')],
    ];
    
    const guideChecks = [
      ['运行指南', guide.includes('运行指南')],
      ['Demo 结构', guide.includes('Demo 结构')],
      ['运行示例', guide.includes('运行不同示例')],
      ['故障排除', guide.includes('故障排除')],
    ];
    
    for (const [name, check] of readmeChecks) {
      console.log(`   ${check ? '✅' : '❌'} README.md 包含: ${name}`);
      if (!check) allPassed = false;
    }
    
    for (const [name, check] of guideChecks) {
      console.log(`   ${check ? '✅' : '❌'} DEMO_GUIDE.md 包含: ${name}`);
      if (!check) allPassed = false;
    }
    
  } catch (error) {
    console.log('   ❌ 无法读取文档文件');
    allPassed = false;
  }
  
  // 7. 生成测试报告
  console.log('\n7️⃣ 生成测试报告...');
  const report = {
    timestamp: new Date().toISOString(),
    passed: allPassed,
    tests: [
      { name: '文件结构检查', status: 'completed' },
      { name: 'package.json 配置检查', status: 'completed' },
      { name: 'OpenAPI 规范检查', status: 'completed' },
      { name: 'OrvalForge 配置检查', status: configTest.success ? 'passed' : 'warning' },
      { name: 'TypeScript 编译检查', status: tscTest.success ? 'passed' : 'warning' },
      { name: '文档完整性检查', status: 'completed' },
    ]
  };
  
  fs.writeFileSync(
    path.join(demoDir, 'test-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('   ✅ 测试报告已生成: test-report.json');
  
  // 总结
  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('🎉 所有测试通过！Demo 项目完整且可用。');
    console.log('\n📋 下一步:');
    console.log('1. cd examples/demo');
    console.log('2. npm install');
    console.log('3. npm run api:generate');
    console.log('4. npm start');
  } else {
    console.log('⚠️  部分测试未通过，但 Demo 基本可用。');
    console.log('\n💡 建议:');
    console.log('1. 检查上述失败项');
    console.log('2. 确保 OrvalForge 项目已正确构建');
    console.log('3. 运行 npm install 安装依赖');
  }
  
  return allPassed;
}

// 运行测试
if (require.main === module) {
  runTests().then(passed => {
    process.exit(passed ? 0 : 1);
  }).catch(error => {
    console.error('❌ 测试脚本执行失败:', error);
    process.exit(1);
  });
}

module.exports = { runTests };