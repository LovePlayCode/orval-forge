# 📚 OrvalForge 文档索引

快速找到你需要的文档。

## 🚀 快速开始

| 文档 | 说明 | 推荐度 |
|------|------|--------|
| [README.md](./README.md) | 项目主文档，功能介绍 | ⭐⭐⭐⭐⭐ |
| [GETTING_STARTED.md](./GETTING_STARTED.md) | 快速入门指南 | ⭐⭐⭐⭐⭐ |

## 📦 发布相关

### 推荐阅读顺序

1. **[HOW_TO_PUBLISH.md](./HOW_TO_PUBLISH.md)** ⭐ 推荐首读
   - 最简单的发布指南
   - 3 步发布流程
   - 常见问题解答

2. **[RELEASE_GUIDE.md](./RELEASE_GUIDE.md)**
   - 详细发布步骤
   - 发布流程图
   - 版本选择指南

3. **[RELEASE_WORKFLOW_COMPARISON.md](./RELEASE_WORKFLOW_COMPARISON.md)**
   - Release PR vs Changesets 对比
   - 适用场景分析
   - 如何选择发布方式

4. **[PUBLISHING_ORVAL_STYLE.md](./PUBLISHING_ORVAL_STYLE.md)**
   - 完整技术文档
   - GitHub Actions 配置
   - 高级用法

### 备选发布方式

| 文档 | 说明 |
|------|------|
| [PUBLISHING.md](./PUBLISHING.md) | Changesets 发布方式（完整版） |
| [QUICK_PUBLISH.md](./QUICK_PUBLISH.md) | Changesets 发布方式（快速版） |

### 配置说明

| 文档 | 说明 |
|------|------|
| [NPM_PUBLISH_SETUP.md](./NPM_PUBLISH_SETUP.md) | 发布配置完成清单 |
| [.changeset/README.md](./.changeset/README.md) | Changesets 使用说明 |

## 💻 开发指南

| 文档 | 说明 |
|------|------|
| [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) | 本地开发指南 |
| [LOCAL_DEVELOPMENT_SUCCESS.md](./LOCAL_DEVELOPMENT_SUCCESS.md) | 本地开发成功案例 |
| [MONOREPO_QUICK_START.md](./MONOREPO_QUICK_START.md) | Monorepo 快速开始 |
| [MONOREPO_UPGRADE_SUCCESS.md](./MONOREPO_UPGRADE_SUCCESS.md) | Monorepo 升级成功记录 |

## 📖 使用指南

| 文档 | 说明 |
|------|------|
| [HTTP_CLIENT_INJECTION_GUIDE.md](./HTTP_CLIENT_INJECTION_GUIDE.md) | HTTP 客户端注入指南 |
| [EXAMPLES_GUIDE.md](./EXAMPLES_GUIDE.md) | 示例项目指南 |
| [EXAMPLES_QUICK_START.md](./EXAMPLES_QUICK_START.md) | 示例快速开始 |

## 🔧 配置文件

| 文件 | 说明 |
|------|------|
| `.npmrc` | npm 配置 |
| `.npmignore` | npm 发布忽略文件 |
| `turbo.json` | Turborepo 配置 |
| `pnpm-workspace.yaml` | pnpm workspace 配置 |
| `.changeset/config.json` | Changesets 配置 |

## 🤖 GitHub Actions

| 文件 | 说明 |
|------|------|
| `.github/workflows/ci.yml` | 持续集成 |
| `.github/workflows/publish.yml` | 自动发布（Release PR） |
| `.github/workflows/version.yml` | 创建 Release PR |

## 🛠️ 脚本

| 脚本 | 说明 | 使用 |
|------|------|------|
| `scripts/create-release.sh` | 创建 release（推荐） | `./scripts/create-release.sh` |
| `scripts/check-publish.sh` | 发布前检查 | `./scripts/check-publish.sh` |
| `scripts/publish.sh` | 手动发布（Changesets） | `./scripts/publish.sh` |
| `scripts/version.sh` | 更新版本（Changesets） | `./scripts/version.sh` |

## 📋 其他文档

| 文档 | 说明 |
|------|------|
| [DEMO_IMPROVEMENT_SUMMARY.md](./DEMO_IMPROVEMENT_SUMMARY.md) | Demo 改进总结 |
| [MONOREPO_UPGRADE_PLAN.md](./MONOREPO_UPGRADE_PLAN.md) | Monorepo 升级计划 |
| [LICENSE](./LICENSE) | MIT 许可证 |

## 🎯 常见任务快速导航

### 我想...

#### 📥 安装和使用 OrvalForge
→ 阅读 [README.md](./README.md) 和 [GETTING_STARTED.md](./GETTING_STARTED.md)

#### 🚀 发布新版本
→ 阅读 [HOW_TO_PUBLISH.md](./HOW_TO_PUBLISH.md)

#### 🔧 本地开发
→ 阅读 [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md)

#### 📖 查看示例
→ 阅读 [EXAMPLES_GUIDE.md](./EXAMPLES_GUIDE.md)

#### 🔍 理解 HTTP 客户端
→ 阅读 [HTTP_CLIENT_INJECTION_GUIDE.md](./HTTP_CLIENT_INJECTION_GUIDE.md)

#### ⚙️ 配置发布流程
→ 阅读 [PUBLISHING_ORVAL_STYLE.md](./PUBLISHING_ORVAL_STYLE.md)

#### 🤔 选择发布方式
→ 阅读 [RELEASE_WORKFLOW_COMPARISON.md](./RELEASE_WORKFLOW_COMPARISON.md)

#### 🆘 遇到发布问题
→ 查看 [HOW_TO_PUBLISH.md](./HOW_TO_PUBLISH.md) 的"常见问题"部分

## 📊 文档结构

```
OrvalForge/
├── 📘 主文档
│   ├── README.md
│   ├── GETTING_STARTED.md
│   └── DOCS_INDEX.md (本文件)
│
├── 🚀 发布文档（Release PR 方式 - 推荐）
│   ├── HOW_TO_PUBLISH.md ⭐
│   ├── RELEASE_GUIDE.md
│   ├── PUBLISHING_ORVAL_STYLE.md
│   └── RELEASE_WORKFLOW_COMPARISON.md
│
├── 📦 发布文档（Changesets 方式 - 备选）
│   ├── PUBLISHING.md
│   ├── QUICK_PUBLISH.md
│   └── .changeset/README.md
│
├── 💻 开发文档
│   ├── LOCAL_DEVELOPMENT.md
│   ├── MONOREPO_QUICK_START.md
│   └── HTTP_CLIENT_INJECTION_GUIDE.md
│
├── 📖 示例文档
│   ├── EXAMPLES_GUIDE.md
│   └── EXAMPLES_QUICK_START.md
│
└── 📋 配置和工具
    ├── NPM_PUBLISH_SETUP.md
    ├── .github/workflows/
    └── scripts/
```

## 🔗 外部资源

- [Orval 官方文档](https://orval.dev/)
- [npm 发布指南](https://docs.npmjs.com/cli/v9/commands/npm-publish)
- [Semantic Versioning](https://semver.org/)
- [pnpm Workspace](https://pnpm.io/workspaces)
- [Turborepo 文档](https://turbo.build/repo/docs)

---

**提示**: 如果你是第一次使用 OrvalForge，建议按以下顺序阅读：

1. [README.md](./README.md)
2. [GETTING_STARTED.md](./GETTING_STARTED.md)
3. [HOW_TO_PUBLISH.md](./HOW_TO_PUBLISH.md)（如果要发布）
