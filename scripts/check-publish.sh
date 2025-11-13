#!/bin/bash

# OrvalForge 发布前检查脚本
# 检查所有包是否准备好发布

set -e

echo "🔍 检查发布准备情况..."

failed=0

# 检查每个包
packages=(
  "packages/types"
  "packages/core"
  "packages/cli"
  "packages/my-request"
  "packages/my-mini-request"
  "packages/orval-forge"
)

for package in "${packages[@]}"; do
  echo ""
  echo "📦 检查 $package..."
  
  # 检查 package.json
  if [ ! -f "$package/package.json" ]; then
    echo "  ❌ 缺少 package.json"
    failed=1
    continue
  fi
  
  # 检查 dist 目录
  if [ ! -d "$package/dist" ]; then
    echo "  ⚠️  缺少 dist 目录 (需要先构建)"
    failed=1
  else
    echo "  ✅ dist 目录存在"
  fi
  
  # 检查 README.md
  if [ ! -f "$package/README.md" ]; then
    echo "  ⚠️  缺少 README.md"
  else
    echo "  ✅ README.md 存在"
  fi
  
  # 检查 LICENSE
  if [ ! -f "$package/LICENSE" ] && [ ! -f "LICENSE" ]; then
    echo "  ⚠️  缺少 LICENSE 文件"
  else
    echo "  ✅ LICENSE 存在"
  fi
  
  # 检查 package.json 字段
  name=$(node -p "require('./$package/package.json').name")
  version=$(node -p "require('./$package/package.json').version")
  main=$(node -p "require('./$package/package.json').main")
  types=$(node -p "require('./$package/package.json').types")
  
  echo "  📝 包名: $name"
  echo "  📝 版本: $version"
  echo "  📝 入口: $main"
  echo "  📝 类型: $types"
  
  # 检查入口文件是否存在
  if [ ! -f "$package/$main" ]; then
    echo "  ❌ 入口文件不存在: $main"
    failed=1
  fi
  
  if [ ! -f "$package/$types" ]; then
    echo "  ❌ 类型文件不存在: $types"
    failed=1
  fi
done

echo ""
if [ $failed -eq 0 ]; then
  echo "✅ 所有检查通过，可以发布!"
  exit 0
else
  echo "❌ 发现问题，请先修复后再发布"
  exit 1
fi
