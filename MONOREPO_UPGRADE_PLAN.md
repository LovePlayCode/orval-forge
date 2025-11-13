# 🚀 OrvalForge Monorepo 升级方案

> 参考 Orval 项目的成熟 Monorepo 管理方式，为 OrvalForge 设计现代化的项目架构

## 📊 当前项目分析

### 现有结构
```
orval-forge/
├── src/                      # 单一源码目录
├── examples/                 # 示例项目
├── docs/                     # 文档
├── bin/orval-forge.js        # CLI 入口
├── dist/                     # 构建输出
└── package.json              # 单一包配置
```

### 存在的问题
1. **单一包结构**：核心功能、CLI、HTTP 客户端混在一起
2. **扩展困难**：添加新的 HTTP 客户端或功能需要修改核心包
3. **依赖管理**：所有依赖都在一个 package.json 中
4. **示例维护**：examples 与主项目耦合，难以独立测试
5. **发布复杂**：无法独立发布不同功能模块

## 🎯 升级目标

### 参考 Orval 的优秀实践
1. **Yarn Workspaces + Turborepo** 管理多包
2. **模块化架构**：按功能拆分独立包
3. **统一工具链**：ESLint、Prettier、TypeScript、Vitest
4. **完善的 CI/CD** 和代码质量保证
5. **独立发布**：支持按需安装和使用

## 📐 新架构设计

### 目录结构
```
orval-forge/
├── .github/                  # GitHub Actions 工作流
├── .husky/                   # Git hooks
├── .vscode/                  # VSCode 配置
├── docs/                     # 项目文档
├── packages/                 # 核心包（Monorepo 主要代码）
│   ├── core/                 # 核心逻辑包
│   ├── cli/                  # CLI 工具包
│   ├── my-request/           # MyRequest HTTP 客户端
│   ├── my-mini-request/      # MyMiniRequest 轻量客户端
│   ├── axios-adapter/        # Axios 适配器（可选）
│   ├── fetch-adapter/        # Fetch 适配器（可选）
│   └── types/                # 共享类型定义
├── examples/                 # 使用示例
│   ├── basic/                # 基础使用示例
│   ├── advanced/             # 高级功能示例
│   ├── react-app/            # React 应用示例
│   ├── vue-app/              # Vue 应用示例
│   └── node-app/             # Node.js 应用示例
├── tests/                    # 集成测试
├── tools/                    # 构建和开发工具
├── .gitignore
├── .prettierrc.json
├── .eslintrc.js
├── commitlint.config.js
├── turbo.json                # Turborepo 配置
├── tsconfig.base.json        # 基础 TypeScript 配置
├── package.json              # 根包配置（工作空间）
├── pnpm-workspace.yaml       # pnpm 工作空间配置
└── README.md
```

### 包架构设计

#### 1. 核心包 (`packages/`)

##### `@orval-forge/core`
```typescript
// packages/core/package.json
{
  "name": "@orval-forge/core",
  "version": "1.0.0",
  "description": "OrvalForge core code generation engine",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "dependencies": {
    "orval": "^6.31.0"
  }
}
```

**功能**：
- 核心代码生成逻辑
- 配置解析和验证
- 模板管理
- 与 Orval 的集成

##### `@orval-forge/cli`
```typescript
// packages/cli/package.json
{
  "name": "@orval-forge/cli",
  "version": "1.0.0",
  "description": "OrvalForge command line interface",
  "bin": {
    "orval-forge": "./dist/cli.js"
  },
  "dependencies": {
    "@orval-forge/core": "workspace:*",
    "commander": "^11.0.0",
    "chokidar": "^3.5.3"
  }
}
```

**功能**：
- CLI 命令解析
- 文件监听
- 配置管理命令

##### `@orval-forge/my-request`
```typescript
// packages/my-request/package.json
{
  "name": "@orval-forge/my-request",
  "version": "1.0.0",
  "description": "Full-featured HTTP client for OrvalForge",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "dependencies": {
    "@orval-forge/types": "workspace:*",
    "axios": "^1.6.0"
  }
}
```

**功能**：
- 功能丰富的 HTTP 客户端
- 请求/响应拦截器
- 错误处理和重试
- 缓存支持

##### `@orval-forge/my-mini-request`
```typescript
// packages/my-mini-request/package.json
{
  "name": "@orval-forge/my-mini-request",
  "version": "1.0.0",
  "description": "Lightweight HTTP client for OrvalForge",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "dependencies": {
    "@orval-forge/types": "workspace:*"
  }
}
```

**功能**：
- 轻量级 HTTP 客户端
- 基础请求功能
- 最小依赖

##### `@orval-forge/types`
```typescript
// packages/types/package.json
{
  "name": "@orval-forge/types",
  "version": "1.0.0",
  "description": "Shared TypeScript types for OrvalForge",
  "main": "dist/index.js",
  "types": "dist/index.d.ts"
}
```

**功能**：
- 共享类型定义
- 配置接口
- HTTP 客户端接口

##### `orval-forge` (主包)
```typescript
// packages/orval-forge/package.json
{
  "name": "orval-forge",
  "version": "1.0.0",
  "description": "A powerful wrapper around Orval with custom HTTP client integration",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "dependencies": {
    "@orval-forge/core": "workspace:*",
    "@orval-forge/my-request": "workspace:*",
    "@orval-forge/my-mini-request": "workspace:*",
    "@orval-forge/types": "workspace:*"
  }
}
```

**功能**：
- 统一入口包
- 重新导出所有核心功能
- 向后兼容

### 根包配置

#### `package.json`
```json
{
  "name": "orval-forge-workspaces",
  "version": "1.0.0",
  "private": true,
  "description": "OrvalForge monorepo workspace",
  "packageManager": "pnpm@8.15.0",
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean",
    "clean:all": "pnpm clean && rm -rf node_modules",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "turbo run build && changeset publish",
    "examples:build": "turbo run build --filter=./examples/*",
    "examples:test": "turbo run test --filter=./examples/*"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.0",
    "@commitlint/cli": "^18.0.0",
    "@commitlint/config-conventional": "^18.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0",
    "prettier": "^3.0.0",
    "turbo": "^1.11.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  },
  "workspaces": [
    "packages/*",
    "examples/*"
  ]
}
```

#### `turbo.json`
```json
{
  "globalEnv": ["NODE_ENV", "CI", "DEBUG"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["src/**/*.ts", "package.json", "tsconfig.json"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["src/**/*.ts", "tests/**/*.ts", "**/*.test.ts"],
      "outputs": []
    },
    "lint": {
      "dependsOn": ["^build"],
      "inputs": ["src/**/*.ts", "**/*.js", "**/*.json"],
      "outputs": []
    },
    "type-check": {
      "dependsOn": ["^build"],
      "inputs": ["src/**/*.ts", "tsconfig.json"],
      "outputs": []
    },
    "clean": {
      "cache": false
    }
  }
}
```

#### `pnpm-workspace.yaml`
```yaml
packages:
  - 'packages/*'
  - 'examples/*'
  - 'tests/*'
```

## 🔄 迁移步骤

### 阶段 1：基础架构搭建
1. **初始化 Monorepo**
   ```bash
   # 1. 安装 pnpm
   npm install -g pnpm
   
   # 2. 初始化工作空间
   pnpm init
   
   # 3. 创建 pnpm-workspace.yaml
   # 4. 设置 turbo.json
   # 5. 配置 TypeScript、ESLint、Prettier
   ```

2. **创建包目录结构**
   ```bash
   mkdir -p packages/{core,cli,my-request,my-mini-request,types,orval-forge}
   mkdir -p examples/{basic,advanced,react-app,vue-app,node-app}
   mkdir -p tests tools
   ```

### 阶段 2：代码迁移
1. **拆分现有代码**
   - `src/core/` → `packages/core/src/`
   - `src/cli/` → `packages/cli/src/`
   - `src/clients/MyRequest/` → `packages/my-request/src/`
   - `src/clients/MyMiniRequest/` → `packages/my-mini-request/src/`
   - `src/types/` → `packages/types/src/`

2. **更新导入路径**
   - 将相对导入改为包导入
   - 使用 `workspace:*` 引用本地包

### 阶段 3：工具链配置
1. **配置构建工具**
   - 每个包独立的 `tsconfig.json`
   - 统一的 `tsconfig.base.json`
   - Turborepo 任务配置

2. **配置代码质量工具**
   - ESLint 规则
   - Prettier 配置
   - Husky + lint-staged
   - Commitlint

### 阶段 4：示例和测试
1. **重构示例项目**
   - 每个示例独立的 package.json
   - 使用本地包依赖
   - 独立的构建和测试

2. **添加测试**
   - 单元测试（每个包）
   - 集成测试（tests 目录）
   - 示例测试

### 阶段 5：发布配置
1. **配置 Changesets**
   - 版本管理
   - 自动生成 CHANGELOG
   - 独立发布

2. **配置 CI/CD**
   - GitHub Actions
   - 自动化测试
   - 自动发布

## 📈 升级后的优势

### 1. 模块化架构
- **独立开发**：每个包可以独立开发和测试
- **按需使用**：用户可以只安装需要的包
- **扩展性强**：添加新功能不影响现有包

### 2. 开发体验
- **并行构建**：Turborepo 优化构建速度
- **类型安全**：完善的 TypeScript 支持
- **代码质量**：统一的 linting 和格式化

### 3. 维护性
- **清晰职责**：每个包职责明确
- **版本管理**：独立版本控制
- **测试隔离**：独立测试不相互影响

### 4. 用户体验
- **灵活安装**：
  ```bash
  # 完整功能
  npm install orval-forge
  
  # 只要 CLI
  npm install @orval-forge/cli
  
  # 只要轻量客户端
  npm install @orval-forge/core @orval-forge/my-mini-request
  ```

- **清晰文档**：每个包独立文档
- **示例丰富**：多种使用场景示例

## 🎯 实施建议

### 优先级
1. **高优先级**：核心架构搭建（阶段 1-2）
2. **中优先级**：工具链配置（阶段 3）
3. **低优先级**：示例重构和发布配置（阶段 4-5）

### 风险控制
1. **渐进式迁移**：保持向后兼容
2. **充分测试**：每个阶段都要测试
3. **文档同步**：及时更新文档

### 时间估算
- **阶段 1-2**：2-3 周
- **阶段 3**：1-2 周
- **阶段 4-5**：2-3 周
- **总计**：5-8 周

这个升级方案将使 OrvalForge 具备现代化的项目架构，提供更好的开发体验和用户体验，同时为未来的扩展奠定坚实基础。