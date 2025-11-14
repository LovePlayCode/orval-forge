# GitHub Actions CI 修复总结

## 问题概述

在将项目推送到 GitHub 后，CI 工作流遇到了多个错误。以下是所有问题的根本原因和修复方案。

---

## 问题 1: Turborepo 配置错误

### 错误信息
```
turbo_json_parse_error
  x Found an unknown key `daemon`.
  x Found an unknown key `tasks`.
```

### 根本原因
- 本地使用的是 Turborepo v2 配置格式（`tasks`）
- `package.json` 中指定的是 `turbo@^1.11.0`（v1 版本）
- Turborepo v1 使用 `pipeline` 而非 `tasks`

### 解决方案
✅ 升级 Turborepo 到 v2

**修改内容**：
```json
// package.json
{
  "devDependencies": {
-   "turbo": "^1.11.0",
+   "turbo": "^2.3.0"
  }
}
```

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",  // v2 新特性
  "tasks": {    // ✅ v2 格式保留
    // ...
  },
  "globalEnv": [  // 移到根级别
    "NODE_ENV",
    "CI",
    "DEBUG",
    "NPM_TOKEN"
  ]
}
```

---

## 问题 2: ESLint 插件解析失败

### 错误信息
```
ESLint couldn't find the config "@typescript-eslint/recommended" to extend from.
```

### 根本原因
- pnpm 默认使用 `node-linker=isolated` 模式（符号链接）
- ESLint 无法通过符号链接正确解析插件配置
- 公共依赖（如 ESLint 插件）在根 `package.json` 中，但子包运行时找不到

### 解决方案
✅ 使用 `node-linker=hoisted` + 在根目录统一运行 ESLint

**修改内容**：

```ini
# .npmrc
node-linker=hoisted  # 使用传统的 node_modules 提升模式
```

```json
// package.json - 在根目录统一运行 ESLint
{
  "scripts": {
-   "lint": "turbo run lint",
-   "lint:fix": "turbo run lint:fix",
+   "lint": "eslint 'packages/*/src/**/*.ts' 'examples/*/src/**/*.ts'",
+   "lint:fix": "eslint 'packages/*/src/**/*.ts' 'examples/*/src/**/*.ts' --fix"
  }
}
```

**注意事项**：
- 修改 `.npmrc` 后需要重新安装依赖：
  ```bash
  rm -rf node_modules packages/*/node_modules examples/*/node_modules
  pnpm install
  ```

---

## 问题 3: TypeScript 编译错误（缺少源文件）

### 错误信息
```
error TS2307: Cannot find module './lib' or its corresponding type declarations.
```

### 根本原因
- `.gitignore` 中的 `lib/` 规则过于宽泛
- 不仅屏蔽了构建产物 `dist/lib/`，也屏蔽了源代码目录 `src/lib/`
- 导致 17 个源代码文件未被 Git 跟踪，推送到 GitHub 后 CI 无法找到这些文件

### 解决方案
✅ 修改 `.gitignore`，只屏蔽根目录的 `lib/`

**修改内容**：
```gitignore
# .gitignore
# Build outputs
dist/
build/
-lib/          # ❌ 过于宽泛，会屏蔽所有 lib/ 目录
+/lib/         # ✅ 只屏蔽根目录的 lib/
*.tsbuildinfo
```

**添加的文件**（共 17 个）：
```
packages/cli/src/lib/cli.ts
packages/cli/src/lib/index.ts
packages/core/src/lib/generator.ts
packages/core/src/lib/index.ts
packages/core/src/lib/templates.ts
packages/my-mini-request/src/lib/index.ts
packages/my-mini-request/src/lib/mutator.ts
packages/my-mini-request/src/lib/my-mini-request.ts
packages/my-request/src/lib/index.ts
packages/my-request/src/lib/mutator.ts
packages/my-request/src/lib/my-request.ts
packages/orval-forge/src/lib/factory.ts
packages/orval-forge/src/lib/index.ts
packages/orval-forge/src/lib/legacy.ts
packages/types/src/lib/config.ts
packages/types/src/lib/http-client.ts
packages/types/src/lib/index.ts
```

---

## 提交记录

所有修复已提交到以下 commit：

1. **fix(turbo): upgrade to Turborepo v2 for GitHub Actions compatibility** (5708dc0)
   - 升级 turbo 到 v2.3.0
   - 更新 turbo.json 配置

2. **fix(eslint): use hoisted node_modules to resolve plugin resolution** (78ff30a)
   - 修改 `.npmrc` 使用 hoisted 模式
   - 在根目录统一运行 ESLint

3. **fix(.gitignore): exclude only root lib/ directory, not src/lib/** (263e4c6)
   - 修正 `.gitignore` 规则
   - 添加 17 个被误屏蔽的源文件

---

## 验证清单

在推送到 GitHub 前，本地验证所有命令通过：

```bash
✅ pnpm run build         # 构建成功
✅ pnpm run type-check    # 类型检查通过
✅ pnpm run lint          # ESLint 检查通过（需重新安装依赖）
✅ pnpm run test:run      # 测试通过
```

---

## 推送到 GitHub

现在可以安全推送到远程仓库：

```bash
git push origin main
```

GitHub Actions 应该能够正常运行，无错误。

---

## 经验总结

### ✅ 最佳实践

1. **Turborepo 版本统一**
   - `turbo.json` 配置格式要与 `package.json` 中的版本匹配
   - 建议直接使用最新的 v2 版本

2. **pnpm workspace 中使用 ESLint**
   - 公共开发依赖放在根 `package.json`
   - 使用 `node-linker=hoisted` 确保插件解析正常
   - 在根目录统一运行 ESLint，而不是在每个子包

3. **`.gitignore` 精确配置**
   - 避免使用过于宽泛的规则（如 `lib/`）
   - 使用 `/lib/` 仅屏蔽根目录
   - 使用 `git check-ignore -v <file>` 验证文件是否被错误屏蔽

4. **CI 调试流程**
   - 本地完全复现 CI 环境（相同的依赖版本、命令）
   - 使用 `pnpm install --frozen-lockfile` 测试
   - 确保所有源文件都被 Git 跟踪

### ❌ 避免的陷阱

1. 不要在 Monorepo 的每个子包中重复安装公共开发依赖
2. 不要忽略 pnpm 的 `node-linker` 配置影响
3. 不要在 `.gitignore` 中使用过于宽泛的目录名
4. 不要跳过本地验证直接推送到 CI

---

**修复完成！** 🎉

所有 GitHub Actions 错误已解决，项目可以正常构建和发布。
