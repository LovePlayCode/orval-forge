# 📦 OrvalForge NPM 发布配置完成

## ✅ 已完成的配置

### 1. 基础配置文件

- ✅ `.npmrc` - npm 发布配置
- ✅ `.npmignore` - 发布时忽略的文件
- ✅ `LICENSE` - MIT 许可证
- ✅ `.changeset/config.json` - Changesets 配置

### 2. 包配置完善

所有包的 `package.json` 已包含：

- ✅ `name`, `version`, `description`
- ✅ `author`, `license`
- ✅ `repository`, `homepage`, `bugs`
- ✅ `keywords` (SEO 优化)
- ✅ `engines` (Node.js 版本要求)
- ✅ `main`, `types` (入口文件)
- ✅ `files` (发布的文件列表)
- ✅ `publishConfig` (发布配置)
- ✅ `prepublishOnly` 钩子

包列表：
- `@orval-forge/types`
- `@orval-forge/core`
- `@orval-forge/cli`
- `@orval-forge/my-request`
- `@orval-forge/my-mini-request`
- `orval-forge` (主包)

### 3. 发布脚本

#### `scripts/check-publish.sh`
检查所有包是否准备好发布：
```bash
./scripts/check-publish.sh
```

#### `scripts/version.sh`
更新包版本号：
```bash
./scripts/version.sh
```

#### `scripts/publish.sh`
完整的发布流程（包含所有检查）：
```bash
./scripts/publish.sh
```

### 4. GitHub Actions CI/CD

#### `.github/workflows/ci.yml`
持续集成：
- 在 PR 和 push 时运行
- 测试 Node.js 18 和 20
- 运行 lint、type-check、build、test

#### `.github/workflows/publish.yml`
自动发布：
- 在 main 分支有 changesets 时触发
- 自动创建 Release PR
- 合并后自动发布到 npm

### 5. 文档

#### `PUBLISHING.md`
完整的发布指南，包含：
- 前置要求
- 详细发布流程
- Changesets 使用
- 自动化发布
- 常见问题解答

#### `QUICK_PUBLISH.md`
快速发布指南（5 步发布）

#### 各包的 README.md
每个包都有独立的 README，说明：
- 安装方法
- 使用示例
- 特性列表
- 相关链接

### 6. package.json 脚本

根目录新增脚本：
```json
{
  "changeset:add": "changeset",
  "version-packages": "changeset version",
  "release": "turbo run build && changeset publish",
  "publish:check": "./scripts/check-publish.sh",
  "publish:version": "./scripts/version.sh",
  "publish:release": "./scripts/publish.sh"
}
```

## 🚀 如何发布

### 方式一：自动发布（推荐）

1. 开发完成后创建 changeset：
```bash
pnpm changeset
```

2. 提交并推送到 main 分支：
```bash
git add .
git commit -m "feat: add new feature"
git push
```

3. GitHub Actions 会自动：
   - 创建 Release PR
   - 合并后自动发布到 npm

### 方式二：手动发布

1. 创建 changeset：
```bash
pnpm changeset
```

2. 更新版本：
```bash
./scripts/version.sh
```

3. 提交版本更新：
```bash
git add .
git commit -m "chore: release packages"
git push
```

4. 发布：
```bash
./scripts/publish.sh
```

## 🔧 发布前准备

### 1. NPM 账号设置

```bash
# 登录 npm
npm login

# 验证
npm whoami
```

### 2. GitHub Secrets 配置

在 GitHub 仓库设置中添加：
- `NPM_TOKEN` - npm automation token

获取 NPM Token：
1. 访问 https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. 创建 "Automation" 类型的 token
3. 复制 token 到 GitHub Secrets

### 3. 首次发布

如果是首次发布，需要：

1. 在 npm 创建组织（如果使用 @scope）：
```bash
npm org create @orval-forge
```

2. 更新所有 package.json 中的仓库地址：
```json
{
  "repository": {
    "url": "https://github.com/YOUR-ORG/orval-forge.git"
  }
}
```

3. 构建所有包：
```bash
pnpm build
```

4. 检查发布准备：
```bash
./scripts/check-publish.sh
```

## 📋 发布检查清单

使用脚本自动检查：
```bash
./scripts/check-publish.sh
```

手动检查：
- [ ] 所有包已构建 (`pnpm build`)
- [ ] 测试通过 (`pnpm test:run`)
- [ ] Lint 通过 (`pnpm lint`)
- [ ] 类型检查通过 (`pnpm type-check`)
- [ ] README.md 已更新
- [ ] CHANGELOG 已生成
- [ ] 版本号正确
- [ ] LICENSE 文件存在
- [ ] Git 工作区干净

## 📦 包依赖关系

```
orval-forge (主包)
├── @orval-forge/core
│   └── @orval-forge/types
├── @orval-forge/cli
│   ├── @orval-forge/core
│   └── @orval-forge/types
├── @orval-forge/my-request
│   └── @orval-forge/types
├── @orval-forge/my-mini-request
│   └── @orval-forge/types
└── @orval-forge/types (基础包)
```

发布顺序（自动处理）：
1. `@orval-forge/types`
2. `@orval-forge/my-request`, `@orval-forge/my-mini-request`, `@orval-forge/core`
3. `@orval-forge/cli`
4. `orval-forge`

## 🎯 版本策略

遵循 [Semantic Versioning](https://semver.org/)：

- **Patch (1.0.0 → 1.0.1)**: Bug 修复、文档更新
- **Minor (1.0.0 → 1.1.0)**: 新功能、向后兼容
- **Major (1.0.0 → 2.0.0)**: 破坏性更改

## 📚 相关文档

- [PUBLISHING.md](./PUBLISHING.md) - 完整发布指南
- [QUICK_PUBLISH.md](./QUICK_PUBLISH.md) - 快速发布指南
- [README.md](./README.md) - 项目文档

## 🆘 需要帮助？

- 查看 [PUBLISHING.md](./PUBLISHING.md) 的常见问题部分
- 提交 Issue: https://github.com/YOUR-ORG/orval-forge/issues
- 查看 Changesets 文档: https://github.com/changesets/changesets

## ✨ 最佳实践

1. **小步提交**: 每个功能完成后立即创建 changeset
2. **描述清晰**: changeset 描述要清晰，会自动成为 CHANGELOG
3. **测试充分**: 发布前确保所有测试通过
4. **版本语义**: 正确选择版本类型（major/minor/patch）
5. **本地测试**: 使用 `npm pack` 在本地测试包
6. **自动化优先**: 使用 GitHub Actions 自动化发布流程

## 🎉 发布成功后

1. 验证包已发布：
```bash
npm view @orval-forge/core
npm view orval-forge
```

2. 在新项目中测试：
```bash
mkdir test-project
cd test-project
npm init -y
npm install orval-forge
```

3. 创建 Release Notes（可选）

4. 发布公告（可选）

---

配置完成！现在你可以开始发布 OrvalForge 包了 🚀
