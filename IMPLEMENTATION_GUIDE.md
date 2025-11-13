# OrvalForge 发布方案实施指南

本文档提供基于 Orval 发布方案的实施指南（阶段 1：基础适配）。

## 📋 前置条件检查

在开始实施前，请确保满足以下条件：

- [ ] GitHub 仓库已创建并推送代码
- [ ] npm 账号已注册并验证邮箱
- [ ] 拥有仓库的 write 权限
- [ ] 本地环境安装 Node.js ≥18.0.0
- [ ] 本地环境安装 pnpm 8.15.0

## 🔧 配置步骤

### 步骤 1: 生成 npm Token

1. 登录 [npmjs.com](https://www.npmjs.com/)
2. 点击头像 → **Access Tokens**
3. 点击 **Generate New Token** → 选择 **Automation**
4. 复制生成的 token（格式：`npm_xxxxxxxxxxxx`）

### 步骤 2: 配置 GitHub Secrets

1. 进入 GitHub 仓库页面
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 添加以下 secret：
   - **Name**: `NPM_TOKEN`
   - **Value**: 粘贴步骤 1 生成的 token
5. 点击 **Add secret**

### 步骤 3: 启用 GitHub Actions

1. 在仓库页面点击 **Actions** 标签
2. 如果显示提示，点击 **I understand my workflows, go ahead and enable them**
3. 确认看到以下两个工作流：
   - **Prepare Release**
   - **Publish Release**

### 步骤 4: 验证配置

运行以下命令验证本地环境：

```bash
# 检查 Node.js 版本
node --version  # 应该 ≥ v18.0.0

# 检查 pnpm 版本
pnpm --version  # 应该是 8.15.0

# 安装依赖
pnpm install

# 构建所有包
pnpm run build

# 运行测试
pnpm run test:run
```

## 🚀 发布流程

### 完整发布流程

```
准备发布 → 代码审查 → 合并 PR → 自动发布
```

### 详细步骤

#### 1. 触发准备发布工作流

1. 进入 GitHub 仓库页面
2. 点击 **Actions** 标签
3. 在左侧选择 **Prepare Release** 工作流
4. 点击 **Run workflow** 下拉菜单
5. 填写参数：
   - **Version number**: 输入版本号，如 `1.0.1`
   - **Release type**: 选择发布类型（patch/minor/major）
6. 点击 **Run workflow** 按钮

#### 2. 等待工作流执行

工作流将自动执行以下任务：

- ✅ 更新所有包的版本号
- ✅ 更新 `pnpm-lock.yaml`
- ✅ 构建所有包
- ✅ 运行所有测试
- ✅ 创建 `release/v1.0.1` 分支
- ✅ 自动创建 PR

#### 3. 审查 Pull Request

1. 收到 PR 创建通知后，点击链接查看
2. 检查以下内容：
   - [ ] 所有 `package.json` 版本号是否正确更新
   - [ ] `pnpm-lock.yaml` 是否同步更新
   - [ ] CI 检查是否全部通过
   - [ ] 没有意外的文件变更
3. 如有需要，手动编辑 CHANGELOG.md 添加版本说明
4. 如有需要，补充 breaking changes 文档

#### 4. 合并 Pull Request

1. 确认所有检查通过后，点击 **Merge pull request**
2. 选择合并方式（推荐 **Squash and merge**）
3. 点击 **Confirm merge**

#### 5. 自动发布

PR 合并后，**Publish Release** 工作流将自动触发：

- ✅ 重新构建所有包
- ✅ 运行测试验证
- ✅ 发布所有公共包到 npm
- ✅ 创建 Git Tag（如 `v1.0.1`）
- ✅ 创建 GitHub Release

#### 6. 验证发布结果

1. 检查 npm 包是否发布成功：
   ```bash
   npm view @orval-forge/core version
   npm view @orval-forge/cli version
   npm view orval-forge version
   ```

2. 检查 GitHub Release 是否创建：
   - 进入仓库的 **Releases** 页面
   - 确认看到新版本的 Release

3. 检查 Git Tag 是否创建：
   ```bash
   git fetch --tags
   git tag -l
   ```

## 🔍 故障排查

### 问题 1: Prepare Release 工作流失败

**可能原因**:
- 依赖安装失败
- 构建错误
- 测试失败

**解决方法**:
1. 查看 Actions 日志定位具体错误
2. 在本地运行相同命令复现问题：
   ```bash
   pnpm install --frozen-lockfile
   pnpm run build
   pnpm run test:run
   ```
3. 修复错误后重新触发工作流

### 问题 2: Publish Release 工作流未触发

**可能原因**:
- PR 分支名称不符合 `release/v*` 格式
- PR 未合并（仅关闭）

**解决方法**:
1. 检查 PR 分支名称是否以 `release/v` 开头
2. 确认 PR 已合并而非关闭
3. 手动重新触发工作流（如有必要）

### 问题 3: npm 发布失败

**可能原因**:
- `NPM_TOKEN` 配置错误
- npm 包已存在相同版本
- 包名未在 npm 注册

**解决方法**:
1. 验证 `NPM_TOKEN` 是否正确配置
2. 检查 npm 上是否已有同版本包：
   ```bash
   npm view @orval-forge/core versions
   ```
3. 如需重新发布，需要升级版本号

### 问题 4: 权限错误

**错误信息**: `Resource not accessible by integration`

**解决方法**:
1. 检查仓库设置 → **Actions** → **General**
2. 在 **Workflow permissions** 中选择：
   - **Read and write permissions**
3. 勾选 **Allow GitHub Actions to create and approve pull requests**
4. 保存设置后重新运行工作流

## 📊 工作流对比

### 旧流程（基于脚本）

```bash
# 1. 本地运行脚本
./scripts/create-release.sh

# 2. 手动输入版本号

# 3. 手动推送分支
git push origin release/v1.0.1

# 4. 手动创建 PR

# 5. 合并后手动发布...
```

**问题**:
- ❌ 依赖本地环境
- ❌ 手动步骤多，容易出错
- ❌ 无法自动化验证
- ❌ 发布过程不透明

### 新流程（基于 GitHub Actions）

```
触发工作流 → 自动创建 PR → 审查 → 合并 → 自动发布
```

**优势**:
- ✅ 完全自动化
- ✅ CI 环境一致性
- ✅ 自动运行测试
- ✅ 发布过程可追溯
- ✅ 失败自动回滚（PR 未合并）

## 🎯 最佳实践

### 1. 版本号管理

遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范：

- **patch** (1.0.**1**): 修复 bug，向后兼容
- **minor** (1.**1**.0): 新增功能，向后兼容
- **major** (**2**.0.0): 破坏性更新，不向后兼容

### 2. 发布前检查

- [ ] 所有测试通过
- [ ] 代码已经过 code review
- [ ] 文档已更新
- [ ] CHANGELOG 已补充
- [ ] 破坏性变更已记录

### 3. 发布频率建议

- **开发阶段**: 每周发布一次 patch 版本
- **稳定阶段**: 每 2-4 周发布一次 minor 版本
- **重大更新**: 提前至少 1 周通知用户

### 4. 紧急修复流程

如需紧急发布 hotfix：

1. 创建 `hotfix/vX.X.X` 分支（从最新 tag 创建）
2. 修复问题并提交
3. 手动触发 Prepare Release 工作流
4. 快速审查并合并
5. 自动发布

## 📝 补充说明

### 与 Orval 方案的差异

本实施方案（阶段 1）与 Orval 原方案的主要差异：

| 特性 | Orval 方案 | 本项目方案 | 原因 |
|------|-----------|-----------|------|
| 包管理器 | Yarn 4 + Corepack | pnpm 8 | 保持现有工具栈 |
| 构建工具 | tsdown | tsc | 避免引入额外依赖 |
| 版本管理 | release-it + workspaces 插件 | 手动 + GitHub Actions | 简化配置 |
| CHANGELOG | 自动生成 | 手动维护 | 阶段 1 暂不引入 release-it |
| Node 版本 | ≥24 | ≥18 | 降低环境要求 |

### 未来升级路径

如果需要更高级的功能，可以考虑：

**阶段 2: 引入 release-it**
- 自动生成 CHANGELOG
- 钩子机制支持
- 更灵活的版本管理

**阶段 3: 完全对齐 Orval**
- 迁移到 Yarn 4
- 使用 tsdown 构建
- 使用 @release-it-plugins/workspaces

详见 `ORVAL_RELEASE_ANALYSIS.md` 第四部分。

## 🆘 获取帮助

如遇到问题：

1. 查看 [GitHub Actions 日志](../../actions)
2. 查看本文档的故障排查部分
3. 查看 `ORVAL_RELEASE_ANALYSIS.md` 深度分析文档
4. 提交 Issue 描述问题

---

**最后更新**: 2025-11-13  
**文档版本**: 1.0.0
