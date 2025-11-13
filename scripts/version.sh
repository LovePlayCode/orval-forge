#!/bin/bash

# OrvalForge 版本更新脚本
# 该脚本用于更新包版本并生成 changelog

set -e

echo "📝 开始版本更新流程..."

# 检查是否有 changeset 文件
if [ -z "$(ls -A .changeset/*.md 2>/dev/null | grep -v 'README.md' | grep -v 'config.json')" ]; then
  echo "⚠️  没有找到 changeset 文件"
  echo "请先运行 'pnpm changeset' 创建一个 changeset"
  exit 1
fi

# 显示待处理的 changesets
echo "📋 待处理的 changesets:"
ls -1 .changeset/*.md | grep -v 'README.md' | xargs -I {} basename {}

# 更新版本
echo "🔄 更新包版本..."
pnpm changeset version

# 安装依赖以更新 lockfile
echo "📦 更新 lockfile..."
pnpm install

# 显示更改的文件
echo "📄 已更改的文件:"
git status --short

# 提示提交更改
echo ""
echo "✅ 版本更新完成!"
echo "📝 请检查更改的文件，然后提交:"
echo "   git add ."
echo "   git commit -m 'chore: release packages'"
echo "   git push"
