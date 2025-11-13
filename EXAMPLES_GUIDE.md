# 🚀 OrvalForge Examples 运行指南

> 如何运行 OrvalForge 项目中的各种示例

## 📋 可用示例

OrvalForge 提供了多个示例项目，展示不同的使用场景：

### 1. **Demo 示例** (`examples/demo/`) - 完整功能演示
- **功能**: 博客 API 的完整演示，包含用户和文章管理
- **特性**: 多种使用模式、错误处理、服务封装
- **HTTP 客户端**: MyRequest (功能丰富)

### 2. **Petstore 示例** (`examples/petstore/`) - 经典 API 演示  
- **功能**: Swagger Petstore API 生成示例
- **特性**: 标准 REST API、验证脚本
- **HTTP 客户端**: MyRequest

### 3. **Simple 示例** (`examples/simple/`) - 最小化示例
- **功能**: 简单的 API 生成和使用
- **特性**: 最小配置、快速上手
- **HTTP 客户端**: MyMiniRequest (轻量级)

## 🛠️ 运行步骤

### 前置条件

确保您已经构建了 OrvalForge 的所有包：

```bash
# 在项目根目录
cd /Users/nathenieli/codebuddy/orval-forge
pnpm install
pnpm build
```

### 方式一：使用 Turborepo (推荐)

```bash
# 在项目根目录运行所有示例
pnpm examples:build    # 构建所有示例
pnpm examples:test     # 测试所有示例
pnpm examples:dev      # 开发模式运行示例
```

### 方式二：单独运行示例

#### 1. Demo 示例 (完整功能)

```bash
# 方法 A: 使用 pnpm workspace
cd /Users/nathenieli/codebuddy/orval-forge
pnpm --filter orval-forge-demo install
pnpm --filter orval-forge-demo start

# 方法 B: 直接进入目录
cd examples/demo
pnpm install
pnpm start
```

可用命令：
```bash
pnpm api:info          # 查看 OrvalForge 信息
pnpm api:check         # 检查配置（干运行）
pnpm api:generate      # 生成 API 代码
pnpm start             # 运行简单演示
pnpm example:basic     # 运行基础用法示例  
pnpm example:advanced  # 运行高级用法示例
pnpm example:all       # 运行所有示例
```

#### 2. Petstore 示例 (经典 API)

```bash
cd examples/petstore
pnpm install
pnpm generate          # 生成 API 代码
pnpm test             # 验证生成结果
```

#### 3. Simple 示例 (快速开始)

```bash
cd examples/simple  
pnpm install
pnpm generate         # 生成 API 代码
pnpm test            # 运行测试
```

## 🔧 故障排除

### 问题 1: 找不到 orval-forge 包

**错误信息**: `Cannot resolve dependency 'orval-forge'`

**解决方案**: 
```bash
# 在项目根目录重新安装依赖
cd /Users/nathenieli/codebuddy/orval-forge
pnpm install
pnpm build

# 然后运行示例
cd examples/demo
pnpm install
```

### 问题 2: CLI 命令找不到

**错误信息**: `Command not found: orval-forge`

**解决方案**: 示例中使用完整路径调用 CLI：
```bash
# 使用相对路径调用 CLI
node ../../packages/cli/dist/lib/cli.js generate

# 或者在根目录创建全局链接
cd /Users/nathenieli/codebuddy/orval-forge
pnpm link --global packages/cli
```

### 问题 3: TypeScript 编译错误

**错误信息**: 类型导入错误

**解决方案**: 确保依赖正确安装：
```bash
# 清理并重新安装
cd examples/demo
rm -rf node_modules package-lock.json
pnpm install
pnpm api:generate
```

### 问题 4: 生成的代码有错误

**解决方案**: 检查配置文件：
```bash
# 验证配置
pnpm api:check

# 查看详细信息
pnpm api:config
```

## 📝 示例详解

### Demo 示例结构

```
examples/demo/
├── src/
│   ├── simple-demo.ts           # 简单演示
│   ├── examples/
│   │   ├── basic-usage.ts       # 基础用法
│   │   ├── advanced-usage.ts    # 高级用法
│   │   └── error-handling.ts    # 错误处理
│   └── services/
│       ├── userService.ts       # 用户服务封装
│       └── postService.ts       # 文章服务封装
├── orval-forge.config.js        # OrvalForge 配置
├── swagger.json                 # OpenAPI 规范
└── package.json                 # 项目配置
```

### 配置文件示例

```javascript
// orval-forge.config.js
module.exports = {
  orval: {
    blogApi: {
      input: './swagger.json',
      output: {
        target: './src/generated/api.ts',
        mode: 'single',
        client: 'axios',
      },
    },
  },
  httpClient: {
    type: 'MyRequest',
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  },
};
```

## 🎯 学习路径

### 1. 新手：从 Simple 示例开始
```bash
cd examples/simple
pnpm install
pnpm generate
pnpm test
```

### 2. 进阶：尝试 Demo 示例
```bash  
cd examples/demo
pnpm install
pnpm start                    # 快速演示
pnpm example:basic           # 学习基础用法
pnpm example:advanced        # 学习高级功能
```

### 3. 专家：研究 Petstore 示例
```bash
cd examples/petstore  
pnpm install
pnpm generate
pnpm test
# 查看 verify-generation.js 了解验证逻辑
```

## 💡 最佳实践

1. **始终先运行配置检查**: `pnpm api:check`
2. **使用干运行模式验证**: `pnpm api:generate --dry-run`
3. **定期清理生成文件**: `pnpm clean`
4. **查看生成的代码**: 检查 `src/generated/` 目录
5. **自定义配置**: 修改 `orval-forge.config.js` 文件

## 🔗 相关资源

- 📚 [OrvalForge 文档](../README.md)
- 🛠️ [CLI 使用指南](../docs/CLI.md)  
- 🎯 [配置参考](../docs/CONFIGURATION.md)
- 🚀 [最佳实践](../docs/BEST_PRACTICES.md)

---

**🎉 开始探索 OrvalForge 的强大功能吧！**