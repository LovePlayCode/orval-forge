#!/bin/bash

# OrvalForge 发布脚本
# 该脚本用于发布所有包到 npm

set -e

echo "🚀 开始 OrvalForge 发布流程..."

# 检查是否在 main 分支
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
  echo "⚠️  警告: 当前不在 main 分支 (当前分支: $current_branch)"
  read -p "是否继续? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 发布已取消"
    exit 1
  fi
fi

# 检查工作区是否干净
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️  警告: 工作区有未提交的更改"
  git status --short
  read -p "是否继续? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 发布已取消"
    exit 1
  fi
fi

# 清理旧的构建文件
echo "🧹 清理旧的构建文件..."
pnpm run clean

# 安装依赖
echo "📦 安装依赖..."
pnpm install

# 运行测试
echo "🧪 运行测试..."
pnpm run test:run || {
  echo "❌ 测试失败，发布已取消"
  exit 1
}

# 运行 lint
echo "🔍 运行代码检查..."
pnpm run lint || {
  echo "❌ 代码检查失败，发布已取消"
  exit 1
}

# 运行类型检查
echo "📝 运行类型检查..."
pnpm run type-check || {
  echo "❌ 类型检查失败，发布已取消"
  exit 1
}

# 构建所有包
echo "🔨 构建所有包..."
pnpm run build || {
  echo "❌ 构建失败，发布已取消"
  exit 1
}

# 使用 changeset 发布
echo "📤 发布到 npm..."
pnpm changeset publish || {
  echo "❌ 发布失败"
  exit 1
}

# 推送 tags
echo "🏷️  推送 git tags..."
git push --follow-tags

echo "✅ 发布成功!"
echo "🎉 所有包已成功发布到 npm"
