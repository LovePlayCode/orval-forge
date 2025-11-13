# 🚀 如何发布 OrvalForge

> **一句话总结**: GitHub Actions 触发 → 审查 PR → 合并 PR → 完成！

## ⚡ 最快发布方式（3 步）

### 方式 1: GitHub Actions 自动化（推荐）

1. 访问 GitHub → **Actions** → **Prepare Release**
2. 点击 **Run workflow**，输入版本号
3. 审查并合并自动创建的 PR → 自动发布！

### 方式 2: 本地脚本（备用）

```bash
# 第 1 步：创建 release
./scripts/create-release.sh

# 第 2 步：在 GitHub 创建 PR（从 release/vX.X.X 到 main）

# 第 3 步：合并 PR，自动发布！
```

就这么简单！🎉

## 📖 第一次发布？

### 前置准备（只需一次）

#### 1. 设置 NPM Token

```bash
# 登录 npm
npm login

# 获取 token
# 访问: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
# 创建 "Automation" 类型的 token

# 在 GitHub 仓库添加 Secret
# 路径: Settings → Secrets and variables → Actions → New repository secret
# Name: NPM_TOKEN
# Value: <你刚创建的 token>
```

#### 2. 更新仓库地址

编辑所有 `packages/*/package.json`，将 `your-org` 改为你的组织名：

```bash
# 批量替换
find packages -name "package.json" -exec sed -i '' 's/your-org/YOUR_ORG_NAME/g' {} \;
```

#### 3. 验证构建

```bash
pnpm install
pnpm build
./scripts/check-publish.sh
```

看到 "✅ 所有检查通过，可以发布!" 就可以了。

## 🎯 详细发布步骤（GitHub Actions 方式）

### 步骤 1：触发 Prepare Release 工作流

1. 访问 GitHub 仓库页面
2. 点击 **Actions** 标签
3. 在左侧选择 **Prepare Release** 工作流
4. 点击右侧 **Run workflow** 下拉菜单
5. 填写参数：
   - **Version number**: 输入版本号（如 `1.0.1`）
   - **Release type**: 选择发布类型
     - `patch` - 修复版本 (1.0.0 → 1.0.1)
     - `minor` - 次版本 (1.0.0 → 1.1.0)
     - `major` - 主版本 (1.0.0 → 2.0.0)
6. 点击绿色 **Run workflow** 按钮

工作流会自动：
- ✅ 更新所有包的版本号
- ✅ 更新 pnpm-lock.yaml
- ✅ 构建所有包
- ✅ 运行测试
- ✅ 创建 release 分支
- ✅ 自动创建 Pull Request

### 步骤 1（备选）：运行本地发布脚本

```bash
./scripts/create-release.sh
```

脚本会问你几个问题：

```
请选择版本类型:
  1) patch  - 修复版本 (1.0.0 → 1.0.1)
  2) minor  - 次版本 (1.0.0 → 1.1.0)
  3) major  - 主版本 (1.0.0 → 2.0.0)
  4) custom - 自定义版本号

选择 (1-4): 
```

**选择建议**:
- 修复 bug → 选 `1` (patch)
- 新功能 → 选 `2` (minor)
- 破坏性更改 → 选 `3` (major)
- Beta 版本 → 选 `4`，输入 `1.0.0-beta.1`

脚本会自动：
- ✅ 更新所有包的版本号
- ✅ 更新 CHANGELOG
- ✅ 创建 release 分支
- ✅ 提交更改
- ✅ 推送到 GitHub（如果你选择 yes）

### 步骤 2：创建 Pull Request

访问 GitHub 仓库，你会看到一个提示：

```
branch release/v1.1.0 had recent pushes
[Compare & pull request]
```

点击按钮，或者访问：
```
https://github.com/YOUR-ORG/orval-forge/compare/main...release/v1.1.0
```

填写 PR 信息：
- **Title**: `chore: release v1.1.0`（脚本已创建）
- **Base**: `main`
- **Compare**: `release/v1.1.0`

### 步骤 3：Review 并合并

1. 检查版本号是否正确
2. 检查 CHANGELOG 是否符合预期
3. 等待 CI 检查通过（可选）
4. 点击 "Merge pull request"

### 步骤 4：等待自动发布

合并 PR 后，GitHub Actions 会自动：

1. ✅ 构建所有 6 个包
2. ✅ 发布到 npm
3. ✅ 创建 git tag (`v1.1.0`)
4. ✅ 创建 GitHub Release

查看发布进度：
```
https://github.com/YOUR-ORG/orval-forge/actions
```

大约 2-5 分钟完成。

### 步骤 5：验证发布

```bash
# 检查包是否发布成功
npm view orval-forge

# 检查版本
npm view orval-forge version

# 在新项目中测试
mkdir test-orval-forge
cd test-orval-forge
npm init -y
npm install orval-forge
```

## 🎨 版本号选择

### 遵循语义化版本

**格式**: `主版本.次版本.修订版本`

| 版本类型 | 何时使用 | 示例 |
|---------|---------|------|
| **Patch** | Bug 修复、文档更新、性能优化 | 1.0.0 → 1.0.1 |
| **Minor** | 新功能、向后兼容的更改 | 1.0.0 → 1.1.0 |
| **Major** | 破坏性更改、API 不兼容 | 1.0.0 → 2.0.0 |

### 特殊版本

```bash
# Beta 版本
1.0.0-beta.1

# Alpha 版本
1.0.0-alpha.1

# Release Candidate
1.0.0-rc.1
```

## 🔍 常见问题

### Q: 合并 PR 后没有自动发布？

**检查清单**:
- [ ] 分支名是否以 `release/v` 开头？
- [ ] PR 是合并而不是关闭？
- [ ] GitHub Actions 是否启用？
- [ ] NPM_TOKEN 是否正确设置？

查看 Actions 日志：`https://github.com/YOUR-ORG/orval-forge/actions`

### Q: 发布失败了怎么办？

1. 查看 GitHub Actions 的错误日志
2. 常见错误：
   - **NPM token 无效**: 重新创建 token 并更新 GitHub Secret
   - **包名已存在**: 检查版本号是否重复
   - **权限不足**: 确保你是 npm 组织的成员

### Q: 如何发布紧急修复？

```bash
# 1. 在 main 分支修复 bug
git checkout main
git pull
# 修复代码...
git commit -m "fix: urgent bug fix"
git push

# 2. 创建 patch release
./scripts/create-release.sh
# 选择 "1) patch"

# 3. 立即创建并合并 PR
```

### Q: 发布错了怎么办？

**不要**使用 `npm unpublish`，而是发布新版本：

```bash
# 发布修复版本
./scripts/create-release.sh
# 选择 patch，修复后重新发布
```

### Q: 如何回滚到之前的版本？

```bash
# 用户可以安装指定版本
npm install orval-forge@1.0.0

# 或者发布新版本恢复更改
./scripts/create-release.sh
```

## 📦 发布的包列表

每次发布会同时发布 6 个包：

1. `@orval-forge/types` - 类型定义
2. `@orval-forge/core` - 核心引擎
3. `@orval-forge/cli` - 命令行工具
4. `@orval-forge/my-request` - HTTP 客户端（完整版）
5. `@orval-forge/my-mini-request` - HTTP 客户端（轻量版）
6. `orval-forge` - 主包（聚合包）

**所有包的版本号保持一致**。

## 🛠️ 实用命令

```bash
# 检查发布准备
./scripts/check-publish.sh

# 本地构建测试
pnpm build

# 运行所有检查
pnpm test:run && pnpm lint && pnpm type-check

# 清理并重新构建
pnpm clean && pnpm install && pnpm build
```

## 📚 更多文档

- **[实施指南](./IMPLEMENTATION_GUIDE.md)** - GitHub Actions 工作流详细配置说明
- **[Orval 方案分析](./ORVAL_RELEASE_ANALYSIS.md)** - release-it + tsdown + GitHub Actions 深度分析
- **[快速发布指南](./RELEASE_GUIDE.md)** - 详细步骤和流程图
- **[发布流程对比](./RELEASE_WORKFLOW_COMPARISON.md)** - Release PR vs Changesets
- **[配置说明](./NPM_PUBLISH_SETUP.md)** - 初次发布配置

## 💡 最佳实践

1. **发布前测试**: 确保所有测试通过
2. **小步迭代**: 频繁发布小版本比大版本好
3. **清晰描述**: CHANGELOG 描述清晰易懂
4. **语义版本**: 严格遵循语义化版本规范
5. **验证发布**: 发布后在新项目中测试

## 🎉 总结

发布 OrvalForge 只需 3 步：

1. **运行脚本**: `./scripts/create-release.sh`
2. **创建 PR**: 在 GitHub 上创建 Pull Request
3. **合并 PR**: 合并后自动发布

简单、快速、可靠！

---

**现在就试试吧**！🚀

```bash
./scripts/create-release.sh
```
