# OrvalForge

基于 Orval 的企业级 API 客户端代码生成工具集。

## 📦 包列表

| 包名 | 版本 | 描述 |
|------|------|------|
| [@orval-forge/types](./packages/types) | [![npm](https://img.shields.io/npm/v/@orval-forge/types.svg)](https://www.npmjs.com/package/@orval-forge/types) | 类型定义 |
| [@orval-forge/core](./packages/core) | [![npm](https://img.shields.io/npm/v/@orval-forge/core.svg)](https://www.npmjs.com/package/@orval-forge/core) | 核心代码生成引擎 |
| [@orval-forge/cli](./packages/cli) | [![npm](https://img.shields.io/npm/v/@orval-forge/cli.svg)](https://www.npmjs.com/package/@orval-forge/cli) | 命令行工具 |
| [@orval-forge/my-request](./packages/my-request) | [![npm](https://img.shields.io/npm/v/@orval-forge/my-request.svg)](https://www.npmjs.com/package/@orval-forge/my-request) | HTTP 客户端（完整版） |
| [@orval-forge/my-mini-request](./packages/my-mini-request) | [![npm](https://img.shields.io/npm/v/@orval-forge/my-mini-request.svg)](https://www.npmjs.com/package/@orval-forge/my-mini-request) | HTTP 客户端（轻量版） |
| [orval-forge](./packages/orval-forge) | [![npm](https://img.shields.io/npm/v/orval-forge.svg)](https://www.npmjs.com/package/orval-forge) | 主包（聚合所有功能） |

## 🚀 快速开始

### 安装

```bash
# 使用 pnpm
pnpm add orval-forge

# 使用 npm
npm install orval-forge

# 使用 yarn
yarn add orval-forge
```

### 使用

```bash
# 生成 API 客户端代码
orval-forge generate --config orval.config.ts
```

## 🛠️ 开发

### 环境要求

- Node.js ≥ 18.0.0
- pnpm 8.15.0

### 安装依赖

```bash
pnpm install
```

### 构建

```bash
# 构建所有包
pnpm build

# 构建单个包
pnpm --filter @orval-forge/core build
```

### 测试

```bash
# 运行所有测试
pnpm test

# 运行单个包的测试
pnpm --filter @orval-forge/core test
```

### 开发模式

```bash
# 监听模式构建
pnpm dev
```

## 📝 发布

查看 [HOW_TO_PUBLISH.md](./HOW_TO_PUBLISH.md) 了解详细的发布流程。

### 快速发布

1. 访问 GitHub Actions → Prepare Release
2. 输入版本号并运行工作流
3. 审查并合并自动创建的 PR
4. 自动发布到 npm！

## 📚 文档

- [快速发布指南](./HOW_TO_PUBLISH.md) - 最简单的发布步骤
- [实施指南](./IMPLEMENTATION_GUIDE.md) - GitHub Actions 配置说明
- [Orval 方案分析](./ORVAL_RELEASE_ANALYSIS.md) - 深度技术分析
- [示例指南](./EXAMPLES_GUIDE.md) - 示例项目说明
- [快速入门](./GETTING_STARTED.md) - 新手指南

## 🤝 贡献

欢迎贡献！请查看我们的贡献指南。

## 📄 许可证

[MIT](./LICENSE)

## 🔗 相关链接

- [Orval 官方文档](https://orval.dev/)
- [OpenAPI 规范](https://swagger.io/specification/)
- [npm 组织页面](https://www.npmjs.com/org/orval-forge)

---

**由 OrvalForge Team 维护** | [GitHub](https://github.com/your-org/orval-forge)
