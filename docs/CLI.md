# 🔥 OrvalForge CLI

OrvalForge 提供了强大的命令行工具，让你可以轻松地生成和管理 API 代码。

## 📦 安装

### 全局安装

```bash
npm install -g orval-forge
```

### 项目内安装

```bash
npm install orval-forge --save-dev
```

## 🚀 快速开始

### 1. 初始化配置

```bash
# 创建默认配置文件
orval-forge init

# 指定客户端类型和配置格式
orval-forge init --type MyMiniRequest --format ts

# 强制覆盖已存在的配置文件
orval-forge init --force
```

### 2. 生成 API 代码

```bash
# 使用默认配置文件生成
orval-forge generate

# 指定配置文件
orval-forge generate -c ./custom-config.js

# 监听模式 - 文件变化时自动重新生成
orval-forge generate --watch

# 预览模式 - 只检查配置不实际生成
orval-forge generate --dry-run
```

## 📋 命令详解

### `orval-forge init`

初始化 OrvalForge 配置文件。

**选项：**
- `-t, --type <client>`: HTTP 客户端类型 (`MyRequest` | `MyMiniRequest`)，默认 `MyRequest`
- `-f, --format <format>`: 配置文件格式 (`js` | `ts` | `json`)，默认 `js`
- `--force`: 强制覆盖已存在的配置文件

**示例：**
```bash
# 创建 JavaScript 配置文件，使用 MyRequest 客户端
orval-forge init

# 创建 TypeScript 配置文件，使用 MyMiniRequest 客户端
orval-forge init --type MyMiniRequest --format ts

# 创建 JSON 配置文件
orval-forge init --format json
```

### `orval-forge generate` (别名: `g`)

生成 API 代码。

**选项：**
- `-c, --config <path>`: 指定配置文件路径
- `-w, --watch`: 监听文件变化，自动重新生成
- `--dry-run`: 预览模式，只验证配置不实际生成
- `--verbose`: 显示详细输出

**示例：**
```bash
# 基本生成
orval-forge generate

# 使用自定义配置
orval-forge generate -c ./configs/my-config.js

# 监听模式
orval-forge generate --watch

# 预览配置
orval-forge generate --dry-run --verbose
```

### `orval-forge config`

配置管理命令。

**选项：**
- `--show`: 显示当前配置
- `--validate`: 验证配置文件
- `-c, --config <path>`: 指定配置文件路径

**示例：**
```bash
# 显示当前配置
orval-forge config --show

# 验证配置文件
orval-forge config --validate

# 验证指定配置文件
orval-forge config --validate -c ./custom-config.js
```

### `orval-forge info`

显示 OrvalForge 信息。

**示例：**
```bash
orval-forge info
```

输出：
```
🔥 OrvalForge Information
Version: 1.0.0
Description: A powerful wrapper around Orval with custom HTTP client integration

📦 Available HTTP Clients:
   - MyRequest
   - MyMiniRequest

📚 Documentation: https://github.com/your-username/orval-forge#readme
```

## 🛠️ 在 package.json 中使用

### 添加脚本命令

```json
{
  "scripts": {
    "api:init": "orval-forge init",
    "api:generate": "orval-forge generate",
    "api:watch": "orval-forge generate --watch",
    "api:check": "orval-forge generate --dry-run",
    "api:config": "orval-forge config --show",
    "api:validate": "orval-forge config --validate"
  }
}
```

### 使用示例

```bash
# 初始化配置
npm run api:init

# 生成 API 代码
npm run api:generate

# 开发模式 - 监听变化
npm run api:watch

# 检查配置
npm run api:check

# 显示配置
npm run api:config

# 验证配置
npm run api:validate
```

## 📁 配置文件支持

OrvalForge CLI 支持多种配置文件格式和命名：

### 支持的文件名
- `orval-forge.config.js`
- `orval-forge.config.ts`
- `orval-forge.config.json`
- `.orval-forgerc`
- `.orval-forgerc.json`
- `.orval-forgerc.js`

### 配置文件查找顺序
1. 命令行指定的路径 (`-c, --config`)
2. `orval-forge.config.js`
3. `orval-forge.config.ts`
4. `orval-forge.config.json`
5. `.orval-forgerc`
6. `.orval-forgerc.json`
7. `.orval-forgerc.js`

## 🔄 监听模式

使用 `--watch` 选项可以启用文件监听，当以下文件发生变化时会自动重新生成：

- 配置文件
- OpenAPI/Swagger 规范文件（本地文件）

```bash
# 启用监听模式
orval-forge generate --watch

# 输出示例：
# 🔥 OrvalForge CLI - Generate Command
# ✅ Initial generation completed!
# 👀 Watching for changes...
# 📝 File changed: ./swagger.json
# 🔄 Regenerating...
# ✅ Regeneration completed!
```

按 `Ctrl+C` 退出监听模式。

## 🎯 实际使用场景

### 场景 1: 新项目 API 集成

```bash
# 1. 初始化配置
orval-forge init --type MyRequest --format ts

# 2. 编辑配置文件，设置 OpenAPI 规范文件路径

# 3. 生成 API 代码
orval-forge generate

# 4. 在项目中使用生成的 API
```

### 场景 2: 开发环境实时更新

```bash
# 启动监听模式
orval-forge generate --watch

# 当 swagger.json 更新时，API 代码会自动重新生成
```

### 场景 3: CI/CD 集成

```json
{
  "scripts": {
    "prebuild": "orval-forge generate",
    "build": "tsc && webpack",
    "api:validate": "orval-forge config --validate"
  }
}
```

### 场景 4: 多环境配置

```bash
# 开发环境
orval-forge generate -c ./configs/dev.config.js

# 生产环境
orval-forge generate -c ./configs/prod.config.js

# 测试环境
orval-forge generate -c ./configs/test.config.js
```

## ❓ 常见问题

### Q: 如何指定自定义配置文件？
A: 使用 `-c` 或 `--config` 选项：
```bash
orval-forge generate -c ./my-config.js
```

### Q: 如何在不生成代码的情况下验证配置？
A: 使用 `--dry-run` 选项：
```bash
orval-forge generate --dry-run
```

### Q: 监听模式下如何查看详细日志？
A: 使用 `--verbose` 选项：
```bash
orval-forge generate --watch --verbose
```

### Q: 如何查看当前支持的 HTTP 客户端类型？
A: 使用 `info` 命令：
```bash
orval-forge info
```

### Q: 配置文件有语法错误如何调试？
A: 使用配置验证命令：
```bash
orval-forge config --validate --verbose
```

## 🔧 高级用法

### 自定义配置文件路径

```bash
# 使用相对路径
orval-forge generate -c ./configs/api.config.js

# 使用绝对路径
orval-forge generate -c /path/to/config.js
```

### 结合其他工具

```json
{
  "scripts": {
    "api:generate": "orval-forge generate",
    "api:format": "prettier --write src/api/**/*.ts",
    "api:lint": "eslint src/api --fix",
    "api:full": "npm run api:generate && npm run api:format && npm run api:lint"
  }
}
```

### 条件生成

```bash
# 只在配置有效时生成
orval-forge config --validate && orval-forge generate
```

这样，OrvalForge CLI 就可以完美集成到你的开发工作流中，提供灵活而强大的 API 代码生成能力！