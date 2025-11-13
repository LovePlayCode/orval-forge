# 🚀 快速发布指南

最简化的 OrvalForge 发布流程。

## ⚡ 5 步发布

### 1️⃣ 创建 Changeset

完成功能后，记录变更：

```bash
pnpm changeset
```

按提示选择：
- 哪些包需要发布
- 版本类型（major/minor/patch）
- 变更描述

然后提交：

```bash
git add .changeset
git commit -m "chore: add changeset"
git push
```

### 2️⃣ 更新版本

准备发布时：

```bash
./scripts/version.sh
```

检查更新后提交：

```bash
git add .
git commit -m "chore: release packages"
git push
```

### 3️⃣ 发布

执行完整发布流程：

```bash
./scripts/publish.sh
```

这个脚本会自动：
- ✅ 运行所有检查（测试、lint、类型检查）
- 🔨 构建所有包
- 📤 发布到 npm
- 🏷️ 推送 git tags

### 4️⃣ 验证

检查发布结果：

```bash
# 查看 npm 上的包
npm view @orval-forge/core
npm view orval-forge

# 在新项目中测试
mkdir test-orval-forge
cd test-orval-forge
npm init -y
npm install orval-forge
```

### 5️⃣ 完成！

🎉 恭喜！你的包已成功发布到 npm！

## 📋 发布前检查

运行这个脚本检查是否准备好发布：

```bash
./scripts/check-publish.sh
```

## 🔄 常用命令

```bash
# 创建 changeset
pnpm changeset

# 查看待发布的 changesets
ls .changeset/*.md

# 更新版本
pnpm changeset version

# 构建所有包
pnpm build

# 发布（不推荐直接用，使用脚本更安全）
pnpm changeset publish
```

## 🆘 遇到问题？

### 发布失败

1. 检查 npm 登录状态：
```bash
npm whoami
```

2. 重新登录：
```bash
npm login
```

3. 检查权限：
```bash
npm org ls @orval-forge
```

### 版本冲突

如果版本号已存在：
```bash
# 手动编辑 package.json 更新版本号
# 然后重新发布
```

### 构建失败

```bash
# 清理并重新构建
pnpm clean
pnpm install
pnpm build
```

## 📚 详细文档

查看 [PUBLISHING.md](./PUBLISHING.md) 了解完整的发布流程和最佳实践。

## 🎯 版本选择指南

- **Patch (1.0.0 → 1.0.1)**: Bug 修复、文档更新
- **Minor (1.0.0 → 1.1.0)**: 新功能、向后兼容
- **Major (1.0.0 → 2.0.0)**: 破坏性更改、API 变更

## 💡 提示

- 每次功能开发完成后立即创建 changeset
- 积累多个 changesets 后一起发布
- 发布前在本地测试包的使用
- 使用 GitHub Actions 自动化发布（推送到 main 分支即可）
