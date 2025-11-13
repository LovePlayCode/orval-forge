#!/bin/bash

# OrvalForge 创建发布脚本
# 用于手动创建版本更新和 Release PR
# 参考 Orval 的发布流程设计

set -e

echo "🚀 OrvalForge Release Creator"
echo "参考 Orval 发布流程 - github.com/orval-labs/orval"
echo ""

# 检查是否在 main 分支
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
  echo "❌ 错误: 必须在 main 分支创建 release"
  echo "当前分支: $current_branch"
  echo ""
  read -p "是否切换到 main 分支并拉取最新代码? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git checkout main
    git pull origin main
  else
    exit 1
  fi
fi

# 检查工作区是否干净
if [ -n "$(git status --porcelain)" ]; then
  echo "❌ 错误: 工作区有未提交的更改"
  git status --short
  exit 1
fi

# 获取当前版本
current_version=$(node -p "require('./package.json').version")
echo "📦 当前版本: $current_version"
echo ""

# 提示输入版本类型
echo "请选择版本类型:"
echo "  1) patch  - 修复版本 (例如: $current_version -> x.x.$(echo $current_version | cut -d. -f3 | awk '{print $1+1}'))"
echo "  2) minor  - 次版本 (例如: $current_version -> x.$(echo $current_version | cut -d. -f2 | awk '{print $1+1}').0)"
echo "  3) major  - 主版本 (例如: $current_version -> $(echo $current_version | cut -d. -f1 | awk '{print $1+1}').0.0)"
echo "  4) custom - 自定义版本号"
echo ""
read -p "选择 (1-4): " choice

case $choice in
  1)
    version_type="patch"
    ;;
  2)
    version_type="minor"
    ;;
  3)
    version_type="major"
    ;;
  4)
    read -p "输入版本号 (例如: 1.2.0): " new_version
    version_type="custom"
    ;;
  *)
    echo "❌ 无效选择"
    exit 1
    ;;
esac

# 更新版本号
echo ""
echo "🔄 更新版本号..."

if [ "$version_type" = "custom" ]; then
  # 使用自定义版本
  npm version $new_version --no-git-tag-version
  pnpm -r --filter './packages/*' exec npm version $new_version --no-git-tag-version
else
  # 使用版本类型
  new_version=$(npm version $version_type --no-git-tag-version | sed 's/v//')
  pnpm -r --filter './packages/*' exec npm version $version_type --no-git-tag-version
fi

echo "✅ 版本已更新为: $new_version"

# 更新 lockfile
echo ""
echo "📦 更新 pnpm-lock.yaml..."
pnpm install --no-frozen-lockfile

# 生成 CHANGELOG
echo ""
echo "📝 更新 CHANGELOG..."
changelog_entry="## v$new_version\n\nReleased on $(date +'%Y-%m-%d')\n\n### Changes\n\n- Version bump to $new_version\n\n"
if [ -f CHANGELOG.md ]; then
  # 在现有 CHANGELOG 前添加新条目
  echo -e "$changelog_entry$(cat CHANGELOG.md)" > CHANGELOG.md
else
  # 创建新的 CHANGELOG
  echo -e "# Changelog\n\n$changelog_entry" > CHANGELOG.md
fi

# 创建 release 分支
branch_name="release/v$new_version"
echo ""
echo "🌿 创建 release 分支: $branch_name"
git checkout -b $branch_name

# 提交更改
echo ""
echo "💾 提交更改..."
git add .
git commit -m "chore: release v$new_version"

# 推送分支
echo ""
read -p "是否推送到远程仓库? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  git push origin $branch_name
  echo ""
  echo "✅ Release 分支已推送"
  echo ""
  echo "📋 下一步:"
  echo "  1. 访问 GitHub 创建 Pull Request"
  echo "  2. PR 标题: chore: release v$new_version"
  echo "  3. 从 $branch_name 到 main"
  echo "  4. Review 并合并 PR"
  echo "  5. 合并后会自动发布到 npm 并创建 GitHub Release"
  echo ""
  echo "🔗 GitHub PR 链接:"
  echo "  https://github.com/YOUR-ORG/orval-forge/compare/main...$branch_name"
else
  echo ""
  echo "✅ 更改已在本地提交到分支: $branch_name"
  echo ""
  echo "📋 后续步骤:"
  echo "  1. git push origin $branch_name"
  echo "  2. 在 GitHub 创建 Pull Request"
  echo "  3. Review 并合并 PR"
fi

echo ""
echo "🎉 Release 准备完成!"
