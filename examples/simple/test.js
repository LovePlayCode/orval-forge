#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 简单示例验证');
console.log('================');

// 检查生成的文件
const checks = [
  {
    name: '生成目录存在',
    check: () => fs.existsSync('./generated'),
  },
  {
    name: 'API 文件存在',
    check: () => fs.existsSync('./generated/api.ts'),
  },
  {
    name: 'Models 目录存在',
    check: () => fs.existsSync('./generated/models'),
  },
  {
    name: '包含 getUsers 函数',
    check: () => {
      if (!fs.existsSync('./generated/api.ts')) return false;
      const content = fs.readFileSync('./generated/api.ts', 'utf8');
      return content.includes('getUsers');
    },
  },
  {
    name: '包含 createUser 函数',
    check: () => {
      if (!fs.existsSync('./generated/api.ts')) return false;
      const content = fs.readFileSync('./generated/api.ts', 'utf8');
      return content.includes('createUser');
    },
  },
  {
    name: '包含 getUserById 函数',
    check: () => {
      if (!fs.existsSync('./generated/api.ts')) return false;
      const content = fs.readFileSync('./generated/api.ts', 'utf8');
      return content.includes('getUserById');
    },
  },
];

let passed = 0;
let failed = 0;

checks.forEach(({ name, check }) => {
  const result = check();
  console.log(`${result ? '✅' : '❌'} ${name}`);
  if (result) {
    passed++;
  } else {
    failed++;
  }
});

console.log('\n📊 结果统计:');
console.log(`   通过: ${passed}`);
console.log(`   失败: ${failed}`);

if (failed === 0) {
  console.log('\n🎉 验证通过！');
  process.exit(0);
} else {
  console.log('\n❌ 验证失败！');
  process.exit(1);
}