# @orval-forge/cli

OrvalForge 命令行工具，提供便捷的 API 代码生成命令。

## 📦 安装

```bash
# 全局安装
npm install -g @orval-forge/cli

# 项目内安装
npm install --save-dev @orval-forge/cli
```

## 🚀 使用

### 基本命令

```bash
# 初始化配置文件
orval-forge init

# 生成 API 代码
orval-forge generate

# 监听模式
orval-forge generate --watch

# 预览模式
orval-forge generate --dry-run
```

### 配置管理

```bash
# 显示配置
orval-forge config --show

# 验证配置
orval-forge config --validate
```

### 查看信息

```bash
# 查看版本和信息
orval-forge info
```

## 📝 在 package.json 中使用

```json
{
  "scripts": {
    "api:init": "orval-forge init",
    "api:generate": "orval-forge generate",
    "api:watch": "orval-forge generate --watch",
    "dev": "npm run api:generate && npm start"
  }
}
```

## 🔧 命令选项

### `orval-forge init`

初始化配置文件。

选项：
- `--type <type>` - HTTP 客户端类型 (MyRequest/MyMiniRequest)
- `--format <format>` - 配置文件格式 (js/ts/json)

### `orval-forge generate`

生成 API 代码。

选项：
- `--config <path>` - 配置文件路径
- `--watch` - 监听模式
- `--dry-run` - 预览模式（不实际生成）

### `orval-forge config`

配置管理。

选项：
- `--show` - 显示当前配置
- `--validate` - 验证配置文件

## 📚 文档

查看 [主文档](../../README.md) 了解完整使用指南。

## 🔗 相关包

- [@orval-forge/core](../core) - 核心引擎
- [@orval-forge/types](../types) - 类型定义
- [orval-forge](../orval-forge) - 主包

## 📄 许可证

MIT
