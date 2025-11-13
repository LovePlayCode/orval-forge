# 📦 OrvalForge 发布指南（Orval 风格）

本项目采用与 Orval 相同的发布流程，基于 **Release PR** 的方式进行版本管理和发布。

## 🎯 发布流程概览

```
开发完成 → 创建 Release PR → Review & 合并 → 自动发布到 npm → 自动创建 GitHub Release
```

## 🚀 发布步骤

### 方式一：使用脚本（推荐）

#### 1. 运行创建 release 脚本

```bash
./scripts/create-release.sh
```

脚本会引导你：
1. 选择版本类型（patch/minor/major/custom）
2. 自动更新所有包的版本号
3. 更新 CHANGELOG
4. 创建 release 分支
5. 提交并推送更改

#### 2. 创建 Pull Request

脚本执行完成后，访问 GitHub 创建 PR：
- **From**: `release/v1.0.0` 
- **To**: `main`
- **Title**: `chore: release v1.0.0`

#### 3. Review 并合并

Review 更改后，合并 PR。

#### 4. 自动发布

合并 PR 后，GitHub Actions 会自动：
- ✅ 构建所有包
- ✅ 发布到 npm
- ✅ 创建 git tag
- ✅ 创建 GitHub Release

### 方式二：GitHub Actions 手动触发

#### 1. 触发 Version 工作流

1. 访问 GitHub Actions 页面
2. 选择 "Create Release PR" 工作流
3. 点击 "Run workflow"
4. 输入版本号和类型

#### 2. 等待 PR 创建

工作流会自动创建一个 Release PR。

#### 3. Review 并合并

Review 后合并 PR，自动发布。

### 方式三：完全手动

如果你想完全手动控制：

```bash
# 1. 确保在 main 分支且工作区干净
git checkout main
git pull origin main

# 2. 创建 release 分支
git checkout -b release/v1.0.0

# 3. 更新版本号
npm version 1.0.0 --no-git-tag-version
pnpm -r --filter './packages/*' exec npm version 1.0.0 --no-git-tag-version

# 4. 更新 lockfile
pnpm install --no-frozen-lockfile

# 5. 更新 CHANGELOG（可选）
# 手动编辑 CHANGELOG.md

# 6. 提交更改
git add .
git commit -m "chore: release v1.0.0"

# 7. 推送分支
git push origin release/v1.0.0

# 8. 在 GitHub 创建 PR (release/v1.0.0 → main)

# 9. 合并 PR，自动发布
```

## 📋 发布前检查

在创建 Release PR 之前：

```bash
# 确保所有测试通过
pnpm test:run

# 确保代码检查通过
pnpm lint

# 确保类型检查通过
pnpm type-check

# 确保所有包可以构建
pnpm build

# 运行发布检查脚本
./scripts/check-publish.sh
```

## 🔧 GitHub Workflows 说明

### 1. CI 工作流 (`.github/workflows/ci.yml`)

**触发条件**: 推送到 main/develop 或创建 PR

**功能**:
- 在 Node.js 18 和 20 上运行测试
- 运行 lint
- 运行类型检查
- 构建所有包

### 2. Version 工作流 (`.github/workflows/version.yml`)

**触发条件**: 手动触发（workflow_dispatch）

**功能**:
- 根据输入的版本号更新所有包
- 生成 CHANGELOG
- 创建 release 分支
- 自动创建 Release PR

**使用方法**:
1. 访问 GitHub Actions
2. 选择 "Create Release PR"
3. 点击 "Run workflow"
4. 输入版本号（如 1.0.0）
5. 选择版本类型（patch/minor/major）

### 3. Publish 工作流 (`.github/workflows/publish.yml`)

**触发条件**: 合并以 `release/v` 开头的 PR 到 main

**功能**:
- 构建所有包
- 发布所有包到 npm
- 创建 git tag
- 创建 GitHub Release

## 🔑 首次发布准备

### 1. 设置 NPM Token

```bash
# 1. 登录 npm
npm login

# 2. 创建 Automation Token
# 访问: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
# 创建 "Automation" 类型的 token

# 3. 在 GitHub 添加 Secret
# Settings → Secrets → Actions → New repository secret
# Name: NPM_TOKEN
# Value: 你的 npm token
```

### 2. 更新仓库地址

将所有 `package.json` 中的仓库地址改为实际地址：

```bash
# 批量替换
find packages -name "package.json" -exec sed -i '' 's/your-org/YOUR_ACTUAL_ORG/g' {} \;
find packages -name "package.json" -exec sed -i '' 's/orval-forge/YOUR_REPO_NAME/g' {} \;
```

### 3. 验证包名可用

```bash
npm view @orval-forge/core  # 应该返回 404
npm view orval-forge        # 应该返回 404
```

### 4. 构建测试

```bash
pnpm clean
pnpm install
pnpm build
./scripts/check-publish.sh
```

## 📊 版本号规范

遵循 [Semantic Versioning](https://semver.org/)：

- **Major (1.0.0 → 2.0.0)**: 破坏性更改
  - API 接口变更
  - 移除已有功能
  - 不兼容的更新

- **Minor (1.0.0 → 1.1.0)**: 新功能
  - 新增 API
  - 新增功能
  - 向后兼容

- **Patch (1.0.0 → 1.0.1)**: 修复
  - Bug 修复
  - 文档更新
  - 性能优化

## 🔄 Release PR 命名规范

- **分支名**: `release/v{version}`
  - 例如: `release/v1.0.0`, `release/v1.2.3`

- **PR 标题**: `chore: release v{version}`
  - 例如: `chore: release v1.0.0`

- **Commit 消息**: `chore: release v{version}`

## 📦 发布的包

每次发布会同时发布以下包：

1. `@orval-forge/types` - 类型定义
2. `@orval-forge/my-request` - HTTP 客户端（完整版）
3. `@orval-forge/my-mini-request` - HTTP 客户端（轻量版）
4. `@orval-forge/core` - 核心引擎
5. `@orval-forge/cli` - 命令行工具
6. `orval-forge` - 主包

所有包的版本号保持一致。

## 🎯 发布后验证

```bash
# 1. 验证包已发布
npm view @orval-forge/core
npm view orval-forge

# 2. 验证版本正确
npm view @orval-forge/core version
npm view orval-forge version

# 3. 验证 GitHub Release 已创建
# 访问: https://github.com/YOUR-ORG/orval-forge/releases

# 4. 在新项目中测试安装
mkdir test-orval-forge
cd test-orval-forge
npm init -y
npm install orval-forge
node -e "console.log(require('orval-forge'))"
```

## 🆘 常见问题

### Q: Release PR 合并后没有触发发布？

**A**: 检查以下几点：
1. 分支名是否以 `release/v` 开头
2. PR 是否已成功合并（不是关闭）
3. GitHub Actions 是否启用
4. NPM_TOKEN 是否正确设置

### Q: 发布失败了怎么办？

**A**: 查看 GitHub Actions 日志：
1. 进入 Actions 页面
2. 查看失败的工作流
3. 检查错误日志
4. 常见问题：
   - NPM token 过期或无效
   - 包名已被占用
   - 版本号重复
   - 网络问题

### Q: 如何发布 beta 版本？

**A**: 使用带 beta 标签的版本号：

```bash
# 手动方式
./scripts/create-release.sh
# 选择 custom，输入: 1.0.0-beta.1

# 或直接手动
npm version 1.0.0-beta.1 --no-git-tag-version
```

### Q: 如何回滚发布？

**A**: npm 不建议回滚，而是发布新版本修复：

```bash
# 不推荐（24小时内可以）
npm unpublish @orval-forge/core@1.0.1

# 推荐：发布修复版本
./scripts/create-release.sh
# 选择 patch，修复问题后发布新版本
```

## 📚 参考资料

- [Semantic Versioning](https://semver.org/)
- [npm publish 文档](https://docs.npmjs.com/cli/v9/commands/npm-publish)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [pnpm workspace](https://pnpm.io/workspaces)

## 🎉 总结

OrvalForge 的发布流程：

1. **开发**: 完成功能开发
2. **测试**: 确保所有测试通过
3. **创建 Release**: 运行 `./scripts/create-release.sh`
4. **创建 PR**: 从 `release/vX.X.X` 到 `main`
5. **Review**: Review 代码变更
6. **合并**: 合并 PR
7. **自动发布**: GitHub Actions 自动发布到 npm
8. **验证**: 检查包是否成功发布

简单、清晰、可控！🚀
