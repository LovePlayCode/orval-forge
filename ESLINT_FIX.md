# ESLint 修复说明

## 问题

GitHub Actions 和本地运行 `pnpm run lint` 时报错：
```
ESLint couldn't find the config "@typescript-eslint/recommended" to extend from
```

## 根本原因

pnpm 默认使用符号链接模式（`node-linker=isolated`），ESLint 无法通过符号链接正确解析插件配置。

## 解决方案

### 方案 1: 修改 pnpm 配置（已应用）

在 `.npmrc` 中设置：
```ini
node-linker=hoisted
```

这会让 pnpm 使用传统的 node_modules 提升模式，ESLint 可以正确找到插件。

**需要重新安装依赖**：
```bash
# 清理并重新安装
rm -rf node_modules packages/*/node_modules examples/*/node_modules
pnpm install
```

### 方案 2: 在根目录统一运行 ESLint（已应用）

修改根 `package.json` 的 lint 脚本：
```json
{
  "scripts": {
    "lint": "eslint 'packages/*/src/**/*.ts' 'examples/*/src/**/*.ts'",
    "lint:fix": "eslint 'packages/*/src/**/*.ts' 'examples/*/src/**/*.ts' --fix"
  }
}
```

### 验证

重新安装后测试：
```bash
pnpm install
pnpm run lint
```

应该能够正常运行而不报错。
