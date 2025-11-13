# ✅ OrvalForge 发布配置完成（Orval 风格）

## 🎉 配置摘要

已成功配置基于 **Release PR** 的发布流程，完全模仿 Orval 的发布方式。

## 📦 新增/更新的文件

### 1. GitHub Actions 工作流

#### `.github/workflows/publish.yml` (已更新)
- **触发**: 合并以 `release/v` 开头的 PR
- **功能**: 
  - 构建所有包
  - 发布到 npm
  - 创建 git tag
  - 创建 GitHub Release

#### `.github/workflows/version.yml` (新建)
- **触发**: 手动触发（workflow_dispatch）
- **功能**:
  - 根据输入创建 release 分支
  - 更新所有包版本
  - 自动创建 Release PR

#### `.github/workflows/ci.yml` (保留)
- **触发**: PR 和 push
- **功能**: 运行测试、lint、类型检查

### 2. 发布脚本

#### `scripts/create-release.sh` (新建) ⭐
- **用途**: 本地创建 release 的主要工具
- **功能**:
  - 交互式选择版本类型
  - 更新所有包版本
  - 生成 CHANGELOG
  - 创建并推送 release 分支

#### `scripts/check-publish.sh` (保留)
- 发布前检查

#### `scripts/publish.sh` (保留)
- Changesets 方式发布（备选）

#### `scripts/version.sh` (保留)
- Changesets 方式版本更新（备选）

### 3. 文档

#### 主要发布文档（Release PR 方式）

1. **`HOW_TO_PUBLISH.md`** (新建) 🌟
   - 最简单的发布指南
   - 推荐新手首读
   - 包含常见问题

2. **`RELEASE_GUIDE.md`** (新建)
   - 详细步骤说明
   - 发布流程图
   - 版本选择指南

3. **`PUBLISHING_ORVAL_STYLE.md`** (新建)
   - 完整技术文档
   - GitHub Actions 详解
   - 高级用法和配置

4. **`RELEASE_WORKFLOW_COMPARISON.md`** (新建)
   - Release PR vs Changesets 对比
   - 适用场景分析
   - 如何选择和切换

#### 辅助文档

5. **`DOCS_INDEX.md`** (新建)
   - 所有文档的索引
   - 快速导航
   - 文档结构说明

6. **`RELEASE_SETUP_COMPLETE.md`** (本文件)
   - 配置完成总结
   - 使用说明

#### 原有文档（保留，作为备选方案）

- `PUBLISHING.md` - Changesets 完整指南
- `QUICK_PUBLISH.md` - Changesets 快速指南
- `NPM_PUBLISH_SETUP.md` - 配置说明

### 4. package.json 更新

根目录 `package.json` 脚本已更新：

```json
{
  "scripts": {
    "release:create": "./scripts/create-release.sh",
    "release:check": "./scripts/check-publish.sh"
  }
}
```

移除了 changesets 相关脚本（但保留了 changesets 功能作为备选）。

### 5. README 更新

主 README 已更新发布部分，突出 Release PR 方式。

## 🚀 如何使用

### 第一次发布前

1. **设置 NPM Token**
   ```bash
   # 创建 token: https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   # 在 GitHub 添加 Secret: NPM_TOKEN
   ```

2. **更新仓库地址**
   ```bash
   find packages -name "package.json" -exec sed -i '' 's/your-org/YOUR_ORG/g' {} \;
   ```

3. **验证构建**
   ```bash
   pnpm build
   ./scripts/check-publish.sh
   ```

### 日常发布流程

```bash
# 方式一：使用脚本（推荐）
./scripts/create-release.sh
# 然后在 GitHub 创建 PR 并合并

# 方式二：使用 GitHub Actions
# 在 Actions 页面手动触发 "Create Release PR"

# 方式三：完全手动
git checkout -b release/v1.0.0
npm version 1.0.0 --no-git-tag-version
pnpm -r --filter './packages/*' exec npm version 1.0.0 --no-git-tag-version
git add . && git commit -m "chore: release v1.0.0"
git push origin release/v1.0.0
# 然后创建 PR
```

## 📊 与 Orval 的对比

| 特性 | Orval | OrvalForge |
|------|-------|------------|
| 包管理器 | Yarn | pnpm |
| Node 版本 | 24 | 18+ |
| 发布触发 | PR 合并 (release/v*) | ✅ 相同 |
| 版本管理 | 手动更新 | ✅ 相同 |
| Tag 创建 | 自动 | ✅ 相同 |
| GitHub Release | 自动 | ✅ 相同 |
| 工作流结构 | 简洁清晰 | ✅ 相同 |

## 🎯 优势

与之前的 Changesets 方式相比：

✅ **更简单**: 3 步完成发布  
✅ **更清晰**: 一个 PR 代表一次发布  
✅ **更可控**: 精确控制发布时机  
✅ **更直观**: 合并 PR = 发布  
✅ **与 Orval 一致**: 降低学习成本

## 📚 文档阅读顺序

### 对于新用户

1. [README.md](./README.md) - 了解项目
2. [HOW_TO_PUBLISH.md](./HOW_TO_PUBLISH.md) - 学习发布

### 对于贡献者

1. [HOW_TO_PUBLISH.md](./HOW_TO_PUBLISH.md) - 快速上手
2. [RELEASE_GUIDE.md](./RELEASE_GUIDE.md) - 详细步骤
3. [PUBLISHING_ORVAL_STYLE.md](./PUBLISHING_ORVAL_STYLE.md) - 深入理解

### 对于维护者

1. [PUBLISHING_ORVAL_STYLE.md](./PUBLISHING_ORVAL_STYLE.md) - 技术细节
2. [RELEASE_WORKFLOW_COMPARISON.md](./RELEASE_WORKFLOW_COMPARISON.md) - 方案对比
3. [NPM_PUBLISH_SETUP.md](./NPM_PUBLISH_SETUP.md) - 配置说明

## 🔄 备选方案

虽然推荐使用 Release PR 方式，但 Changesets 仍然完全可用：

```bash
# 使用 Changesets 方式
pnpm changeset
pnpm changeset version
pnpm changeset publish
```

详见：
- [PUBLISHING.md](./PUBLISHING.md)
- [RELEASE_WORKFLOW_COMPARISON.md](./RELEASE_WORKFLOW_COMPARISON.md)

## ✅ 检查清单

发布前确认：

- [ ] GitHub Actions 已启用
- [ ] NPM_TOKEN 已设置
- [ ] 仓库地址已更新
- [ ] 所有包可以构建
- [ ] 测试全部通过
- [ ] 代码检查通过

运行检查：
```bash
./scripts/check-publish.sh
```

## 🆘 需要帮助？

- **快速问题**: 查看 [HOW_TO_PUBLISH.md](./HOW_TO_PUBLISH.md) 的 FAQ
- **详细问题**: 查看 [PUBLISHING_ORVAL_STYLE.md](./PUBLISHING_ORVAL_STYLE.md)
- **找文档**: 查看 [DOCS_INDEX.md](./DOCS_INDEX.md)
- **提 Issue**: https://github.com/YOUR-ORG/orval-forge/issues

## 🎉 总结

OrvalForge 现在使用**与 Orval 完全相同的发布流程**：

1. ✅ 基于 Release PR
2. ✅ 简单的 3 步发布
3. ✅ 自动化的 CI/CD
4. ✅ 清晰的文档

**现在就试试吧**！

```bash
./scripts/create-release.sh
```

---

配置完成时间: $(date)  
配置版本: Orval-style Release PR  
推荐开始: [HOW_TO_PUBLISH.md](./HOW_TO_PUBLISH.md)
