# 📋 本地开发指南

> **重要说明**: OrvalForge 目前还未发布到 npm，所有示例和 demo 都需要在本地开发环境中运行。

## 🚀 快速开始

### 一键设置和运行 Demo

```bash
# 1. 克隆项目
git clone <repository-url>
cd orval-forge

# 2. 一键设置和运行 demo
npm run demo:setup
cd examples/demo
npm start
```

## 🔧 详细设置步骤

### 1. 构建主项目

```bash
# 安装依赖
npm install

# 构建项目（生成 dist/ 和 CLI）
npm run build

# 验证构建
npm run cli:test
```

### 2. 运行 Demo

```bash
# 方法一：使用设置脚本
cd examples/demo
node setup.js
npm start

# 方法二：手动设置
cd examples/demo
npm run setup              # 自动构建主项目和安装依赖
npm run api:generate       # 生成 API 代码
npm start                  # 运行完整演示
```

## 📁 本地开发文件结构

```
orval-forge/
├── src/                   # 源代码
├── dist/                  # 构建输出
├── bin/orval-forge.js     # CLI 入口
├── examples/
│   └── demo/
│       ├── setup.js       # 本地环境设置脚本
│       ├── package.json   # 使用 "file:../.." 引用本地包
│       └── ...
└── package.json           # 主项目配置
```

## 🛠️ 开发工作流

### 修改源代码后的流程

```bash
# 1. 重新构建
npm run build

# 2. 重新生成 demo API（如果需要）
cd examples/demo
npm run api:generate

# 3. 测试更改
npm start
```

### CLI 开发和测试

```bash
# 测试 CLI 功能
npm run cli:test-full

# 直接运行 CLI
node bin/orval-forge.js --help
node bin/orval-forge.js generate --config examples/demo/orval-forge.config.js
```

## 📦 package.json 配置说明

### 主项目 package.json

```json
{
  "bin": {
    "orval-forge": "./bin/orval-forge.js"
  },
  "scripts": {
    "demo:setup": "node examples/demo/setup.js",
    "demo:run": "npm run demo:setup && cd examples/demo && npm start"
  }
}
```

### Demo 项目 package.json

```json
{
  "dependencies": {
    "orval-forge": "file:../.."  // 引用本地包
  },
  "scripts": {
    "setup": "cd ../../ && npm run build && cd examples/demo && npm install",
    "api:generate": "node ../../bin/orval-forge.js generate"  // 直接使用本地 CLI
  }
}
```

## 🧪 测试和验证

```bash
# 测试完整流程
npm run demo:test

# 测试 CLI 功能
npm run cli:test-full

# 验证生成的代码
cd examples/demo
npm run api:validate
```

## ⚠️ 注意事项

1. **依赖管理**: Demo 使用 `"file:../.."` 引用本地 OrvalForge 包
2. **CLI 路径**: 所有 CLI 命令使用 `node ../../bin/orval-forge.js` 直接调用
3. **构建顺序**: 必须先构建主项目，再运行 demo
4. **文件监听**: 修改主项目代码后需要重新构建

## 🚀 发布后的变化

当 OrvalForge 发布到 npm 后，用户就可以：

```bash
# 全局安装
npm install -g orval-forge

# 或项目内安装
npm install orval-forge --save-dev

# 直接使用 CLI
orval-forge generate
```

但在开发阶段，需要按照本文档的本地开发方式进行。