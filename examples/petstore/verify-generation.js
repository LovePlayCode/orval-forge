#!/usr/bin/env node

/**
 * 验证 OrvalForge 代码生成功能
 * 检查是否成功根据 OpenAPI 规范生成了正确的 TypeScript API 接口函数
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 OrvalForge 代码生成验证');
console.log('='.repeat(50));

// 验证配置
const GENERATED_DIR = './generated';
const API_DIR = path.join(GENERATED_DIR, 'api');
const MODELS_DIR = path.join(API_DIR, 'models');
const ENDPOINTS_FILE = path.join(API_DIR, 'endpoints.ts');

// 预期的文件和内容检查
const EXPECTED_CHECKS = [
  {
    name: '生成目录存在',
    check: () => fs.existsSync(GENERATED_DIR),
    required: true,
  },
  {
    name: 'API 目录存在',
    check: () => fs.existsSync(API_DIR),
    required: true,
  },
  {
    name: 'Models 目录存在',
    check: () => fs.existsSync(MODELS_DIR),
    required: true,
  },
  {
    name: 'Endpoints 文件存在',
    check: () => fs.existsSync(ENDPOINTS_FILE),
    required: true,
  },
  {
    name: 'Endpoints 文件包含 listPets 函数',
    check: () => {
      if (!fs.existsSync(ENDPOINTS_FILE)) return false;
      const content = fs.readFileSync(ENDPOINTS_FILE, 'utf8');
      return content.includes('listPets') || content.includes('export const listPets') || content.includes('export function listPets');
    },
    required: true,
  },
  {
    name: 'Endpoints 文件包含 createPet 函数',
    check: () => {
      if (!fs.existsSync(ENDPOINTS_FILE)) return false;
      const content = fs.readFileSync(ENDPOINTS_FILE, 'utf8');
      return content.includes('createPet') || content.includes('export const createPet') || content.includes('export function createPet');
    },
    required: true,
  },
  {
    name: 'Endpoints 文件包含 showPetById 函数',
    check: () => {
      if (!fs.existsSync(ENDPOINTS_FILE)) return false;
      const content = fs.readFileSync(ENDPOINTS_FILE, 'utf8');
      return content.includes('showPetById') || content.includes('export const showPetById') || content.includes('export function showPetById');
    },
    required: true,
  },
  {
    name: 'Endpoints 文件包含 updatePet 函数',
    check: () => {
      if (!fs.existsSync(ENDPOINTS_FILE)) return false;
      const content = fs.readFileSync(ENDPOINTS_FILE, 'utf8');
      return content.includes('updatePet') || content.includes('export const updatePet') || content.includes('export function updatePet');
    },
    required: true,
  },
  {
    name: 'Endpoints 文件包含 deletePet 函数',
    check: () => {
      if (!fs.existsSync(ENDPOINTS_FILE)) return false;
      const content = fs.readFileSync(ENDPOINTS_FILE, 'utf8');
      return content.includes('deletePet') || content.includes('export const deletePet') || content.includes('export function deletePet');
    },
    required: true,
  },
  {
    name: 'Endpoints 文件包含 listUsers 函数',
    check: () => {
      if (!fs.existsSync(ENDPOINTS_FILE)) return false;
      const content = fs.readFileSync(ENDPOINTS_FILE, 'utf8');
      return content.includes('listUsers') || content.includes('export const listUsers') || content.includes('export function listUsers');
    },
    required: true,
  },
  {
    name: 'Endpoints 文件包含 createUser 函数',
    check: () => {
      if (!fs.existsSync(ENDPOINTS_FILE)) return false;
      const content = fs.readFileSync(ENDPOINTS_FILE, 'utf8');
      return content.includes('createUser') || content.includes('export const createUser') || content.includes('export function createUser');
    },
    required: true,
  },
  {
    name: 'Endpoints 文件包含 getUserById 函数',
    check: () => {
      if (!fs.existsSync(ENDPOINTS_FILE)) return false;
      const content = fs.readFileSync(ENDPOINTS_FILE, 'utf8');
      return content.includes('getUserById') || content.includes('export const getUserById') || content.includes('export function getUserById');
    },
    required: true,
  },
  {
    name: 'Models 目录包含类型定义文件',
    check: () => {
      if (!fs.existsSync(MODELS_DIR)) return false;
      const files = fs.readdirSync(MODELS_DIR);
      return files.some(file => file.endsWith('.ts'));
    },
    required: true,
  },
  {
    name: 'Pet 类型定义存在',
    check: () => {
      if (!fs.existsSync(MODELS_DIR)) return false;
      const files = fs.readdirSync(MODELS_DIR);
      const indexFile = path.join(MODELS_DIR, 'index.ts');
      
      // 检查是否有 Pet 相关的类型定义
      if (fs.existsSync(indexFile)) {
        const content = fs.readFileSync(indexFile, 'utf8');
        return content.includes('Pet') || content.includes('IPet');
      }
      
      // 或者检查是否有单独的 Pet 文件
      return files.some(file => file.toLowerCase().includes('pet'));
    },
    required: true,
  },
  {
    name: 'User 类型定义存在',
    check: () => {
      if (!fs.existsSync(MODELS_DIR)) return false;
      const files = fs.readdirSync(MODELS_DIR);
      const indexFile = path.join(MODELS_DIR, 'index.ts');
      
      // 检查是否有 User 相关的类型定义
      if (fs.existsSync(indexFile)) {
        const content = fs.readFileSync(indexFile, 'utf8');
        return content.includes('User') || content.includes('IUser');
      }
      
      // 或者检查是否有单独的 User 文件
      return files.some(file => file.toLowerCase().includes('user'));
    },
    required: true,
  },
  {
    name: 'TypeScript 语法正确',
    check: () => {
      if (!fs.existsSync(ENDPOINTS_FILE)) return false;
      const content = fs.readFileSync(ENDPOINTS_FILE, 'utf8');
      
      // 基本的 TypeScript 语法检查
      const hasImports = content.includes('import');
      const hasExports = content.includes('export');
      const hasTypes = content.includes(':') && (content.includes('Promise') || content.includes('=>'));
      
      return hasImports && hasExports && hasTypes;
    },
    required: false,
  },
];

// 执行验证
let passedCount = 0;
let failedCount = 0;
let requiredFailedCount = 0;

console.log('📋 执行验证检查...\n');

for (const { name, check, required } of EXPECTED_CHECKS) {
  try {
    const result = check();
    const status = result ? '✅' : '❌';
    const requiredText = required ? '[必需]' : '[可选]';
    
    console.log(`${status} ${requiredText} ${name}`);
    
    if (result) {
      passedCount++;
    } else {
      failedCount++;
      if (required) {
        requiredFailedCount++;
      }
    }
  } catch (error) {
    console.log(`❌ [必需] ${name} - 检查时出错: ${error.message}`);
    failedCount++;
    if (required) {
      requiredFailedCount++;
    }
  }
}

console.log('\n' + '='.repeat(50));
console.log('📊 验证结果统计:');
console.log(`   通过: ${passedCount} 项`);
console.log(`   失败: ${failedCount} 项`);
console.log(`   必需项失败: ${requiredFailedCount} 项`);

// 显示生成的文件结构
console.log('\n📁 生成的文件结构:');
if (fs.existsSync(GENERATED_DIR)) {
  showDirectoryTree(GENERATED_DIR, '', 0);
} else {
  console.log('   (无生成文件)');
}

// 显示示例代码片段
console.log('\n📝 生成代码示例:');
if (fs.existsSync(ENDPOINTS_FILE)) {
  const content = fs.readFileSync(ENDPOINTS_FILE, 'utf8');
  const lines = content.split('\n').slice(0, 20); // 显示前20行
  lines.forEach((line, index) => {
    console.log(`   ${(index + 1).toString().padStart(2, ' ')}| ${line}`);
  });
  if (content.split('\n').length > 20) {
    console.log('   ...(更多内容省略)');
  }
} else {
  console.log('   (无法读取生成的代码)');
}

// 最终结果
console.log('\n' + '='.repeat(50));
if (requiredFailedCount === 0) {
  console.log('🎉 验证通过！OrvalForge 成功生成了 TypeScript API 接口函数！');
  console.log('\n✨ 生成的功能包括:');
  console.log('   • Pet 相关 API (增删改查)');
  console.log('   • User 相关 API (查询、创建)');
  console.log('   • 完整的 TypeScript 类型定义');
  console.log('   • 基于 OpenAPI 规范的函数签名');
  
  process.exit(0);
} else {
  console.log(`❌ 验证失败！有 ${requiredFailedCount} 个必需项未通过。`);
  console.log('\n🔧 可能的解决方案:');
  console.log('   1. 检查 OrvalForge 是否正确安装');
  console.log('   2. 确认配置文件格式正确');
  console.log('   3. 运行 "npm run generate" 重新生成代码');
  console.log('   4. 检查 swagger.json 文件是否有效');
  
  process.exit(1);
}

/**
 * 显示目录树结构
 */
function showDirectoryTree(dir, prefix = '', depth = 0) {
  if (depth > 3) return; // 限制深度避免过深
  
  try {
    const items = fs.readdirSync(dir).sort();
    
    items.forEach((item, index) => {
      const itemPath = path.join(dir, item);
      const isLast = index === items.length - 1;
      const currentPrefix = isLast ? '└── ' : '├── ';
      const nextPrefix = isLast ? '    ' : '│   ';
      
      console.log(`   ${prefix}${currentPrefix}${item}`);
      
      if (fs.statSync(itemPath).isDirectory()) {
        showDirectoryTree(itemPath, prefix + nextPrefix, depth + 1);
      }
    });
  } catch (error) {
    console.log(`   ${prefix}(无法读取目录: ${error.message})`);
  }
}