# OrvalForge Examples - 快速开始

> 💡 **推荐方式**：使用 `orval-forge` 命令行工具运行示例

## 🎯 核心命令

在任何示例目录下运行：

```bash
# 基于 orval-forge.config.js 生成 API 代码
pnpm generate

# 检查配置（dry-run）
pnpm generate:check  # demo 和 petstore

# 查看当前配置
orval-forge config

# 查看帮助
orval-forge --help
```

---

## 📦 所有示例项目

### 1. Demo - 完整功能演示

**目录**: `examples/demo`

**特点**:
- ✅ 完整的 OrvalForge 配置示例
- ✅ 包含所有扩展配置（httpClient, interceptors, errorHandling）
- ✅ 多个使用示例代码
- ✅ 使用 JSONPlaceholder 作为测试 API

**运行方式**:

```bash
cd examples/demo

# 1. 安装依赖
pnpm install

# 2. 生成 API 代码
pnpm generate

# 3. 查看生成的文件
ls -la generated/
# - api.ts
# - models/

# 4. 运行示例
pnpm simple                # 简单示例
pnpm example:basic         # 基础用法
pnpm example:advanced      # 高级用法
pnpm example:error-handling # 错误处理
```

**配置文件**: `orval-forge.config.js`

---

### 2. Petstore - 企业级示例

**目录**: `examples/petstore`

**特点**:
- ✅ 基于 Petstore Swagger 规范
- ✅ 企业级配置示例
- ✅ 包含缓存、日志等高级配置
- ✅ split 模式生成多个文件

**运行方式**:

```bash
cd examples/petstore

# 1. 安装依赖
pnpm install

# 2. 生成 API 代码
pnpm generate

# 3. 查看生成的文件
ls -la generated/api/
# - endpoints.ts
# - models/

# 4. 验证生成
pnpm test
```

**配置文件**: `orval-forge.config.js`

---

### 3. Simple - 最小示例

**目录**: `examples/simple`

**特点**:
- ✅ 最简配置
- ✅ 适合快速上手
- ✅ 仅包含必要配置

**运行方式**:

```bash
cd examples/simple

# 1. 安装依赖
pnpm install

# 2. 生成 API 代码
pnpm generate

# 3. 查看生成的文件
ls -la generated/
```

**配置文件**: `orval-forge.config.js`

---

## 🔧 配置文件说明

所有示例都使用 `orval-forge.config.js` 配置文件，包含两部分：

### 1. Orval 原生配置

```javascript
orval: {
  [projectName]: {
    input: './swagger.json',           // OpenAPI 规范文件
    output: {
      mode: 'split',                   // split | single | tags
      target: './generated/api.ts',    // API 输出路径
      schemas: './generated/models',   // 类型输出路径
      clean: true,                     // 生成前清理
    },
  },
}
```

### 2. OrvalForge 扩展配置

```javascript
httpClient: {
  type: 'MyRequest',                   // MyRequest | MyMiniRequest
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: { /* ... */ },
  interceptors: {
    request: true,
    response: true,
  },
  errorHandling: {
    retry: true,
    retryCount: 3,
    retryDelay: 1000,
  },
}
```

---

## 📝 常用命令参考

```bash
# 生成 API 代码（基于 orval-forge.config.js）
pnpm generate
# 或直接使用
orval-forge generate

# 检查配置（不生成文件）
orval-forge generate --dry-run --verbose

# 查看当前配置
orval-forge config

# 查看 OrvalForge 信息
orval-forge info

# 清理生成的文件
pnpm clean

# 初始化新配置（可选）
orval-forge init --client MyRequest --input ./swagger.json
```

---

## 🎓 学习路径

**建议学习顺序**：

1. **Simple** - 了解基本配置和生成流程
2. **Demo** - 学习完整功能和高级配置
3. **Petstore** - 学习企业级配置和最佳实践

---

## 💡 实用技巧

### 1. 指定配置文件路径

```bash
orval-forge generate --config ./my-config.js
```

### 2. 查看详细输出

```bash
orval-forge generate --verbose
```

### 3. 测试配置而不生成

```bash
orval-forge generate --dry-run
```

### 4. 查看生成的代码结构

```bash
# demo 示例
tree examples/demo/generated

# petstore 示例  
tree examples/petstore/generated/api
```

---

## 🐛 故障排除

### 问题 1: 命令找不到

**错误**: `orval-forge: command not found`

**解决**:
```bash
# 确保在根目录构建了项目
cd /path/to/orval-forge
pnpm install
pnpm build

# 在示例目录安装依赖
cd examples/demo
pnpm install
```

### 问题 2: 生成失败

**解决**:
```bash
# 使用 dry-run 检查配置
orval-forge generate --dry-run --verbose

# 查看当前配置
orval-forge config
```

### 问题 3: 找不到配置文件

**解决**:
```bash
# 确保在示例目录下有 orval-forge.config.js
ls -la orval-forge.config.js

# 或指定配置文件路径
orval-forge generate --config ./orval-forge.config.js
```

---

## 📚 更多信息

- 📖 **完整指南**: 查看各示例目录下的 README.md
- 📖 **Demo 详细说明**: `examples/demo/DEMO_GUIDE.md`
- 📖 **Demo 快速开始**: `examples/demo/QUICK_START.md`
- 🔗 **Orval 文档**: https://orval.dev
- 🐛 **问题反馈**: GitHub Issues

---

## 🎉 快速体验

最快的体验方式：

```bash
# 1. 克隆项目
cd /path/to/orval-forge

# 2. 安装并构建
pnpm install && pnpm build

# 3. 进入 demo 示例
cd examples/demo

# 4. 安装依赖
pnpm install

# 5. 生成 API
pnpm generate

# 6. 查看生成的代码
cat generated/api.ts

# 7. 运行示例
pnpm simple
```

就这么简单！🚀
