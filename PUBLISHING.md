# 📦 OrvalForge 发布指南

本文档介绍如何发布 OrvalForge 包到 npm。

## 📋 目录

- [前置要求](#前置要求)
- [发布流程](#发布流程)
- [使用 Changesets](#使用-changesets)
- [自动化发布](#自动化发布)
- [手动发布](#手动发布)
- [常见问题](#常见问题)

## 🔧 前置要求

### 1. NPM 账号和权限

确保你有 npm 账号并且有权限发布 `@orval-forge` scope 下的包：

```bash
# 登录 npm
npm login

# 验证登录状态
npm whoami

# 查看你的组织
npm org ls @orval-forge
```

### 2. 环境配置

```bash
# 安装依赖
pnpm install

# 确保所有包都能正常构建
pnpm run build

# 运行测试
pnpm run test:run

# 运行代码检查
pnpm run lint
```

### 3. Git 配置

确保你在 `main` 分支，并且工作区是干净的：

```bash
git checkout main
git pull origin main
git status  # 应该显示 "nothing to commit, working tree clean"
```

## 🚀 发布流程

### 推荐流程（使用 Changesets）

OrvalForge 使用 [Changesets](https://github.com/changesets/changesets) 来管理版本和发布。

#### 1. 创建 Changeset

当你完成一个功能或修复后，创建一个 changeset：

```bash
pnpm changeset
```

这会启动一个交互式 CLI，让你：
- 选择要发布的包
- 选择版本类型（major/minor/patch）
- 描述这次更改

示例：
```
🦋  Which packages would you like to include?
  ◯ @orval-forge/types
  ◉ @orval-forge/core
  ◉ @orval-forge/cli
  ◯ @orval-forge/my-request
  ◯ @orval-forge/my-mini-request
  ◯ orval-forge

🦋  Which packages should have a major bump?
  ◯ @orval-forge/core
  ◯ @orval-forge/cli

🦋  Which packages should have a minor bump?
  ◉ @orval-forge/core
  ◉ @orval-forge/cli

🦋  Please enter a summary for this change (this will be in the changelogs).
  Summary: Add support for custom HTTP headers in config
```

#### 2. 提交 Changeset

```bash
git add .changeset
git commit -m "chore: add changeset for custom headers feature"
git push
```

#### 3. 更新版本

当准备发布时，运行版本更新脚本：

```bash
# 使用脚本（推荐）
./scripts/version.sh

# 或手动执行
pnpm changeset version
pnpm install  # 更新 lockfile
```

这会：
- 消费所有 changesets
- 更新包的版本号
- 更新 CHANGELOG.md
- 删除已消费的 changesets

#### 4. 提交版本更新

```bash
git add .
git commit -m "chore: release packages"
git push
```

#### 5. 发布到 NPM

```bash
# 使用脚本（推荐，包含完整检查）
./scripts/publish.sh

# 或手动执行
pnpm run build
pnpm changeset publish
git push --follow-tags
```

## 🤖 自动化发布

### GitHub Actions

项目配置了 GitHub Actions 自动发布流程（`.github/workflows/publish.yml`）。

#### 设置步骤：

1. **添加 NPM Token**

在 GitHub 仓库设置中添加 NPM token：
- 去 https://www.npmjs.com/settings/YOUR_USERNAME/tokens
- 创建一个 "Automation" 类型的 token
- 在 GitHub 仓库的 Settings > Secrets > Actions 中添加 `NPM_TOKEN`

2. **触发发布**

当你将包含 changeset 的代码推送到 `main` 分支时，会自动：
- 运行 CI 检查（测试、lint、类型检查）
- 构建所有包
- 创建 Release PR 或直接发布

3. **Release PR 流程**

GitHub Action 会创建一个 "Release" PR，包含：
- 更新后的版本号
- 更新后的 CHANGELOG
- 所有将要发布的包

合并这个 PR 后，会自动发布到 npm。

### 本地自动化脚本

我们提供了三个脚本来简化发布流程：

#### `scripts/check-publish.sh`

发布前检查，确保所有包都准备好：

```bash
./scripts/check-publish.sh
```

检查项：
- ✅ package.json 存在
- ✅ dist 目录存在（已构建）
- ✅ README.md 存在
- ✅ LICENSE 存在
- ✅ 入口文件存在
- ✅ 类型文件存在

#### `scripts/version.sh`

更新包版本：

```bash
./scripts/version.sh
```

功能：
- 检查是否有待处理的 changesets
- 更新所有包的版本号
- 生成/更新 CHANGELOG
- 更新 lockfile

#### `scripts/publish.sh`

完整的发布流程：

```bash
./scripts/publish.sh
```

功能：
- ✅ 检查分支（建议在 main）
- ✅ 检查工作区状态
- 🧹 清理旧构建
- 📦 安装依赖
- 🧪 运行测试
- 🔍 运行 lint
- 📝 运行类型检查
- 🔨 构建所有包
- 📤 发布到 npm
- 🏷️ 推送 git tags

## 📝 手动发布

如果你不想使用 Changesets，也可以手动发布：

### 1. 更新版本号

手动编辑每个包的 `package.json`，更新版本号。

### 2. 更新 CHANGELOG

在每个包的 CHANGELOG.md 中添加更新内容。

### 3. 构建和发布

```bash
# 构建所有包
pnpm run build

# 进入每个包目录发布
cd packages/types
npm publish --access public

cd ../core
npm publish --access public

cd ../cli
npm publish --access public

cd ../my-request
npm publish --access public

cd ../my-mini-request
npm publish --access public

cd ../orval-forge
npm publish --access public
```

### 4. 创建 Git Tag

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

## 🔍 发布前检查清单

在发布前，确保完成以下检查：

- [ ] 所有测试通过 (`pnpm test:run`)
- [ ] 代码检查通过 (`pnpm lint`)
- [ ] 类型检查通过 (`pnpm type-check`)
- [ ] 所有包都已构建 (`pnpm build`)
- [ ] CHANGELOG 已更新
- [ ] 版本号正确
- [ ] README 和文档已更新
- [ ] 在本地测试包的使用
- [ ] 工作区干净（无未提交的更改）

## 🛠️ 版本策略

我们遵循 [Semantic Versioning](https://semver.org/)：

- **Major (1.0.0 → 2.0.0)**: 破坏性更改
  - API 变更
  - 移除功能
  - 不兼容的更改

- **Minor (1.0.0 → 1.1.0)**: 新功能
  - 新增 API
  - 新增功能
  - 向后兼容

- **Patch (1.0.0 → 1.0.1)**: 修复
  - Bug 修复
  - 文档更新
  - 性能优化

## 📦 包的发布顺序

由于包之间存在依赖关系，建议按以下顺序发布：

1. `@orval-forge/types` (无依赖)
2. `@orval-forge/my-request` (依赖 types)
3. `@orval-forge/my-mini-request` (依赖 types)
4. `@orval-forge/core` (依赖 types)
5. `@orval-forge/cli` (依赖 core, types)
6. `orval-forge` (依赖所有包)

**注意**: 使用 Changesets 时，它会自动处理依赖顺序。

## ❓ 常见问题

### Q: 如何回滚发布？

```bash
# 不推荐删除已发布的版本，而是发布新的修复版本
# 如果必须回滚（24小时内）：
npm unpublish @orval-forge/core@1.0.1

# 推荐：发布新版本修复问题
pnpm changeset
# 选择 patch，描述修复内容
pnpm changeset version
pnpm run release
```

### Q: 发布失败了怎么办？

检查常见问题：
1. NPM token 是否正确
2. 包名是否已存在
3. 版本号是否重复
4. 网络连接是否正常
5. 是否有权限发布到 scope

### Q: 如何发布 beta 版本？

```bash
# 手动更新版本号为 beta
# 例如：1.0.0-beta.1

# 发布时指定 tag
cd packages/core
npm publish --tag beta --access public
```

### Q: 如何测试包在发布前？

```bash
# 1. 本地打包
cd packages/core
npm pack

# 2. 在其他项目中安装
cd /path/to/test-project
npm install /path/to/orval-forge/packages/core/orval-forge-core-1.0.0.tgz

# 或使用 npm link
cd packages/core
npm link

cd /path/to/test-project
npm link @orval-forge/core
```

### Q: 如何发布到私有 registry？

修改 `.npmrc`：

```
registry=https://your-private-registry.com/
//your-private-registry.com/:_authToken=${NPM_TOKEN}
```

或在 `package.json` 中配置：

```json
{
  "publishConfig": {
    "registry": "https://your-private-registry.com/"
  }
}
```

## 📚 相关资源

- [Changesets 文档](https://github.com/changesets/changesets)
- [npm 发布指南](https://docs.npmjs.com/cli/v9/commands/npm-publish)
- [Semantic Versioning](https://semver.org/)
- [pnpm workspace](https://pnpm.io/workspaces)

## 🤝 贡献

如果你发现本文档有任何问题或需要补充，欢迎提交 PR！
