# Orval 发布方案深度分析与本项目适配建议

## 一、Orval 发布方案核心技术栈分析

### 1.1 技术组合

Orval 项目采用了以下技术栈实现自动化发布：

| 技术 | 作用 | 优势 |
|------|------|------|
| **release-it** | 版本管理与发布编排 | 自动化版本号管理、changelog 生成、git 标签创建 |
| **@release-it-plugins/workspaces** | Monorepo 工作区支持 | 统一管理多个包的版本发布 |
| **@release-it/conventional-changelog** | 自动生成变更日志 | 基于 Angular commit 规范自动生成 CHANGELOG |
| **tsdown** | TypeScript 构建工具 | 高性能构建，支持多种输出格式 |
| **Yarn 4 + Corepack** | 包管理器 | 现代化包管理，PnP 模式，性能优越 |
| **Turbo** | Monorepo 任务编排 | 增量构建、缓存机制、并行任务执行 |
| **GitHub Actions** | CI/CD 自动化 | 工作流自动化，权限管理，环境隔离 |

---

## 二、工作流程详细分析

### 2.1 发布流程架构

```
┌─────────────────────────────────────────────────────────────┐
│                     发布流程总览                              │
└─────────────────────────────────────────────────────────────┘

触发方式: Manual Dispatch (手动触发)
    ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 1: Prepare Release (release-prepare.yaml)             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 1. 清理所有 stableVersion 字段 (递归清理)            │   │
│  │ 2. 统一更新所有工作区包的版本号                      │   │
│  │ 3. 运行 update-samples (更新示例代码)               │   │
│  │ 4. 创建 release/vX.X.X 分支                         │   │
│  │ 5. 自动创建 PR 到 master 分支                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 2: Code Review & Merge PR (人工审核)                  │
└─────────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────────┐
│  Step 3: Publish Release (release-publish.yaml)             │
│  触发条件: PR closed && merged && branch starts with        │
│           'release/v'                                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 1. 构建所有包 (yarn build)                           │   │
│  │ 2. 配置 npm 认证 (使用 NPM_TOKEN secret)             │   │
│  │ 3. 发布所有工作区包到 npm                            │   │
│  │    - 跳过私有包 (--no-private)                       │   │
│  │    - 容错重复发布 (--tolerate-republish)             │   │
│  │ 4. 创建 Git Tag (vX.X.X)                             │   │
│  │ 5. 推送 Tag 到远程仓库                               │   │
│  │ 6. 创建 GitHub Release                               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 核心配置文件解析

#### 2.2.1 `.release-it.ts` 配置详解

```typescript
export default {
  npm: {
    // 关键配置: 允许相同版本
    // 因为版本已由 @release-it-plugins/workspaces 管理
    allowSameVersion: true,
    
    // 指定 npm 发布仓库
    publishArgs: ['--registry=https://registry.npmjs.org'],
  },
  
  git: {
    // Git 提交信息模板
    commitMessage: 'chore(release): ${version}',
  },
  
  github: {
    // 创建 GitHub Release (草稿模式)
    release: true,
    draft: true,
  },
  
  plugins: {
    // 自动生成符合 Angular 规范的 CHANGELOG
    '@release-it/conventional-changelog': {
      preset: 'angular',
    },
    
    // Monorepo 工作区支持
    '@release-it-plugins/workspaces': {
      publish: false,  // 禁用自动发布，手动控制
      workspaces: ['packages/*'],
    },
  },
  
  hooks: {
    // 发布前钩子: 构建和测试
    'before:init': ['yarn run build', 'yarn run test:ci'],
    
    // 版本号更新后钩子: 强制重新构建和更新示例
    'after:bump': ['yarn run build --force', 'yarn run update-samples'],
  },
}
```

**关键设计思路**:
- **版本管理分离**: 版本号由工作流手动指定，release-it 只负责编排流程
- **钩子机制**: 利用 hooks 在关键节点执行构建、测试、更新示例等操作
- **草稿发布**: GitHub Release 先创建为草稿，可手动编辑后发布

#### 2.2.2 Turbo 构建配置对比

**Orval 的 turbo.json**:
```json
{
  "daemon": false,  // 禁用后台进程，避免文件锁问题
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", "../tsdown.base.ts"],  // tsdown 配置作为输入
      "outputs": ["dist/**"]
    },
    "transit": {
      "dependsOn": ["^transit"]  // 传递依赖任务
    },
    "lint": {
      "dependsOn": ["transit"]  // lint 依赖 transit 完成
    }
  }
}
```

**本项目的 turbo.json**:
```json
{
  "daemon": false,
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$"],  // 缺少构建工具配置作为输入
      "outputs": ["dist/**"]
    },
    "lint": {
      "dependsOn": ["^build"]  // 直接依赖 build，不同于 Orval 的 transit 机制
    }
  }
}
```

**差异点**:
- Orval 使用 `tsdown.base.ts` 作为构建输入，确保构建配置变化时触发重新构建
- Orval 引入 `transit` 任务作为中间层，优化依赖传递

---

## 三、技术方案优势与劣势分析

### 3.1 优势

#### ✅ 1. 高度自动化
- **版本管理**: 一键更新所有包版本，无需手动编辑 package.json
- **变更日志**: 自动生成符合规范的 CHANGELOG
- **发布流程**: PR 合并后自动触发发布，无需手动干预

#### ✅ 2. 安全性与可控性
- **人工审核**: 通过 PR 流程强制 code review
- **分阶段发布**: prepare → review → publish 三阶段控制
- **回滚能力**: 未合并的 PR 可随时关闭，已发布的版本可通过 npm deprecate 处理

#### ✅ 3. GitHub 生态深度集成
- **自动化 Release 创建**: 包含版本说明、二进制文件附件
- **权限细粒度控制**: 使用 GitHub Token 和 NPM Token 分离权限
- **工作流可视化**: Actions 页面清晰展示发布状态

#### ✅ 4. Monorepo 友好
- **统一版本管理**: 所有包版本同步更新
- **选择性发布**: 可跳过私有包或指定包
- **依赖关系处理**: 自动处理工作区内部依赖的版本引用

#### ✅ 5. 扩展性强
- **插件生态**: release-it 有丰富的插件支持
- **钩子机制**: 可在任意阶段插入自定义逻辑
- **配置灵活**: TypeScript 配置文件支持类型检查和复杂逻辑

### 3.2 劣势与限制

#### ❌ 1. 学习曲线陡峭
- **复杂度高**: 需要理解 release-it、Yarn workspaces、GitHub Actions 三者协作
- **调试困难**: 工作流失败时需要在 GitHub Actions 日志中排查
- **配置文件多**: `.release-it.ts`、`turbo.json`、多个 workflow yaml 文件

#### ❌ 2. 工具依赖强
- **Yarn 4 特定**: 使用 Corepack 和 Yarn 4 特性（PnP、workspaces foreach）
- **Node 版本要求高**: Orval 要求 Node.js ≥24，本项目当前要求 ≥18
- **tsdown 依赖**: 构建工具绑定，迁移到其他构建工具需要调整

#### ❌ 3. 配置复杂度
- **多步骤配置**: 需要配置 npm token、GitHub secrets、workflow 权限
- **stableVersion 字段**: Orval 引入了非标准字段，需要额外清理逻辑
- **Corepack 依赖**: 需要 Node.js 16+ 且启用 Corepack

#### ❌ 4. 潜在兼容性问题
- **pnpm vs Yarn**: 本项目使用 pnpm，需要调整所有 Yarn 命令
- **TypeScript vs JavaScript**: Orval 使用 `.release-it.ts`，需要运行时 TypeScript 支持
- **构建工具差异**: 本项目使用 `tsc`，Orval 使用 `tsdown`

#### ❌ 5. 成本与维护
- **CI 时间成本**: 每次发布需要运行完整的构建和测试
- **GitHub Actions 配额**: 公共仓库免费，私有仓库有分钟数限制
- **维护负担**: 工具版本升级、配置迁移需要持续投入

---

## 四、本项目适配方案建议

### 4.1 方案选择

基于本项目特点，推荐采用 **渐进式接入策略**，分三个阶段实施：

```
阶段 1: 基础适配 (保守方案)
  ↓
阶段 2: 工具升级 (可选增强)
  ↓
阶段 3: 完全对齐 (激进方案)
```

### 4.2 阶段 1: 基础适配 (推荐立即实施)

**目标**: 保留现有工具栈（pnpm + tsc），仅借鉴 Orval 的工作流思路

#### 4.2.1 调整后的工作流

**文件**: `.github/workflows/release-prepare.yml`

```yaml
name: Prepare Release

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version number (e.g., 1.2.3)'
        required: true
      type:
        description: 'Release type'
        required: true
        type: choice
        options:
          - patch
          - minor
          - major

permissions:
  contents: write
  pull-requests: write

jobs:
  prepare:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8.15.0

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Update workspace versions
        run: |
          VERSION="${{ github.event.inputs.version }}"
          echo "Updating all packages to version $VERSION"
          
          # 更新根 package.json
          pnpm version $VERSION --no-git-tag-version
          
          # 更新所有工作区包
          pnpm -r --filter './packages/*' exec pnpm version $VERSION --no-git-tag-version
          
          # 更新 pnpm-lock.yaml
          pnpm install --lockfile-only

      - name: Build packages
        run: pnpm run build

      - name: Run tests
        run: pnpm run test:run

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v6
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: 'chore(release): bump version to v${{ github.event.inputs.version }}'
          branch: release/v${{ github.event.inputs.version }}
          title: 'Release v${{ github.event.inputs.version }}'
          body: |
            ## Release v${{ github.event.inputs.version }}
            
            **Type**: ${{ github.event.inputs.type }}
            
            This PR prepares the release of version v${{ github.event.inputs.version }}.
            
            ### Checklist
            - [ ] All tests passing
            - [ ] CHANGELOG updated
            - [ ] Breaking changes documented
            
            Once merged, packages will be automatically published to npm.
```

**文件**: `.github/workflows/release-publish.yml`

```yaml
name: Publish Release

on:
  pull_request:
    types:
      - closed

permissions:
  contents: write

jobs:
  publish:
    if: github.event.pull_request.merged == true && startsWith(github.event.pull_request.head.ref, 'release/v')
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8.15.0

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build packages
        run: pnpm run build

      - name: Configure npm authentication
        run: |
          echo "//registry.npmjs.org/:_authToken=${{ secrets.NPM_TOKEN }}" > ~/.npmrc

      - name: Publish packages
        run: |
          pnpm -r --filter './packages/*' --no-private publish --access public --no-git-checks

      - name: Extract version
        id: version
        run: |
          VERSION=$(node -p "require('./package.json').version")
          echo "version=$VERSION" >> $GITHUB_OUTPUT

      - name: Create Git Tag
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git tag v${{ steps.version.outputs.version }}
          git push origin v${{ steps.version.outputs.version }}

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          tag_name: v${{ steps.version.outputs.version }}
          name: Release v${{ steps.version.outputs.version }}
          draft: false
          prerelease: false
          generate_release_notes: true
```

#### 4.2.2 必要的配置调整

**更新 `package.json`** (根目录):

```json
{
  "scripts": {
    "release:prepare": "echo 'Please use GitHub Actions workflow to prepare release'",
    "release:local": "./scripts/create-release.sh"
  }
}
```

**保留本地脚本** `scripts/create-release.sh` (作为备用):

```bash
#!/bin/bash
# 保持现有脚本不变，作为本地测试和应急方案
```

#### 4.2.3 优势
- ✅ 无需更换包管理器（继续使用 pnpm）
- ✅ 无需更换构建工具（继续使用 tsc）
- ✅ 复用现有 turbo.json 配置
- ✅ 学习成本低，改动最小

#### 4.2.4 劣势
- ❌ 无法自动生成 CHANGELOG（需手动维护）
- ❌ 缺少 release-it 的钩子机制

---

### 4.3 阶段 2: 工具升级 (可选增强)

**目标**: 引入 release-it，但适配 pnpm 环境

#### 4.3.1 安装依赖

```bash
pnpm add -Dw release-it @release-it/conventional-changelog
```

#### 4.3.2 配置文件

**创建 `.release-it.json`** (注意：使用 JSON 而非 TS):

```json
{
  "npm": {
    "publish": false
  },
  "git": {
    "commitMessage": "chore(release): ${version}",
    "tagName": "v${version}",
    "push": false
  },
  "github": {
    "release": true,
    "draft": true
  },
  "plugins": {
    "@release-it/conventional-changelog": {
      "preset": "angular",
      "infile": "CHANGELOG.md"
    }
  },
  "hooks": {
    "before:init": ["pnpm run build", "pnpm run test:run"],
    "after:bump": "pnpm install --lockfile-only"
  }
}
```

#### 4.3.3 更新工作流

在 `release-prepare.yml` 中使用 release-it：

```yaml
- name: Run release-it
  run: |
    pnpm exec release-it ${{ github.event.inputs.version }} --ci --no-git.push --no-npm.publish
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

#### 4.3.4 优势
- ✅ 自动生成 CHANGELOG
- ✅ 钩子机制支持
- ✅ 仍然使用 pnpm

#### 4.3.5 劣势
- ❌ 需要学习 release-it 配置
- ❌ 对 Monorepo 的支持不如 Yarn 插件完善

---

### 4.4 阶段 3: 完全对齐 (激进方案)

**目标**: 完全迁移到 Orval 技术栈

#### 4.4.1 迁移清单

- [ ] 迁移到 Yarn 4 (使用 Corepack)
- [ ] 升级 Node.js 要求到 ≥22
- [ ] 引入 tsdown 替代 tsc
- [ ] 安装 `@release-it-plugins/workspaces`
- [ ] 使用 TypeScript 配置文件 `.release-it.ts`
- [ ] 调整所有构建脚本

#### 4.4.2 迁移步骤

**1. 迁移包管理器**

```bash
# 启用 Corepack
corepack enable

# 安装 Yarn 4
corepack prepare yarn@4.11.0 --activate

# 迁移 pnpm-lock.yaml 到 yarn.lock
rm pnpm-lock.yaml
yarn install
```

**2. 更新 package.json**

```json
{
  "packageManager": "yarn@4.11.0",
  "engines": {
    "node": ">=22.0.0"
  }
}
```

**3. 引入 tsdown**

```bash
yarn add -D tsdown
```

创建 `tsdown.base.ts`:

```typescript
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'src/index.ts',
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
});
```

**4. 更新构建脚本**

各包的 `package.json`:

```json
{
  "scripts": {
    "build": "tsdown --config ../../tsdown.base.ts"
  }
}
```

#### 4.4.3 优势
- ✅ 完全对齐 Orval，经过大规模项目验证
- ✅ 现代化工具栈，性能更优
- ✅ 插件生态支持完善

#### 4.4.4 劣势
- ❌ 迁移成本高，风险大
- ❌ 需要团队学习新工具
- ❌ 现有脚本和配置大量失效

---

## 五、潜在兼容性问题与解决方案

### 5.1 包管理器差异

| pnpm 命令 | Yarn 4 等价命令 | 说明 |
|-----------|----------------|------|
| `pnpm install` | `yarn install` | 安装依赖 |
| `pnpm -r exec` | `yarn workspaces foreach -Av exec` | 在所有工作区执行命令 |
| `pnpm --filter './packages/*' publish` | `yarn workspaces foreach --no-private npm publish` | 发布工作区包 |
| `pnpm version` | `yarn version` | 更新版本号 |

**解决方案**: 
- 阶段 1/2: 继续使用 pnpm，保持现有习惯
- 阶段 3: 编写迁移脚本，批量替换命令

### 5.2 构建工具差异

**tsc vs tsdown**:

| 特性 | tsc | tsdown | 影响 |
|------|-----|--------|------|
| 速度 | 慢 | 快 | tsdown 基于 esbuild，构建速度 10x+ |
| 配置 | tsconfig.json | tsdown.config.ts | tsdown 配置更灵活 |
| 输出格式 | 单一 | 多格式同时输出 | tsdown 可同时输出 ESM/CJS/UMD |
| 类型检查 | 完整 | 需配合 tsc | tsdown 需要额外运行 tsc --noEmit |

**解决方案**:
```json
{
  "scripts": {
    "build": "tsdown && tsc --noEmit",
    "type-check": "tsc --noEmit"
  }
}
```

### 5.3 Node.js 版本要求

**问题**: Orval 要求 Node.js ≥24，本项目当前 ≥18

**影响分析**:
- Yarn 4 需要 Node.js ≥18.12.0
- Corepack 需要 Node.js ≥16.9.0
- tsdown 需要 Node.js ≥16.0.0

**解决方案**:
```json
{
  "engines": {
    "node": ">=18.12.0"  // 折中方案，满足 Yarn 4 最低要求
  }
}
```

### 5.4 stableVersion 字段处理

**问题**: Orval 在 package.json 中引入了非标准的 `stableVersion` 字段

**用途**: 跟踪上一个稳定版本号

**解决方案**:
- 不引入此字段（非必需）
- 或在 prepare 工作流中添加清理步骤

```yaml
- name: Remove stableVersion fields
  run: |
    find packages -name package.json -exec jq 'del(.stableVersion)' {} \; -print
```

---

## 六、最终推荐方案

### 6.1 综合评估

| 方案 | 实施难度 | 维护成本 | 功能完整度 | 推荐指数 |
|------|---------|---------|-----------|---------|
| 阶段 1: 基础适配 | ⭐ 低 | ⭐ 低 | ⭐⭐⭐ 中 | ⭐⭐⭐⭐⭐ 强烈推荐 |
| 阶段 2: 工具升级 | ⭐⭐ 中 | ⭐⭐ 中 | ⭐⭐⭐⭐ 高 | ⭐⭐⭐ 推荐 |
| 阶段 3: 完全对齐 | ⭐⭐⭐⭐⭐ 高 | ⭐⭐⭐⭐ 高 | ⭐⭐⭐⭐⭐ 完整 | ⭐⭐ 谨慎考虑 |

### 6.2 推荐实施路径

**立即实施**: 
- ✅ 采用阶段 1 方案
- ✅ 更新 GitHub Actions 工作流
- ✅ 保留现有构建工具和包管理器

**3-6 个月后评估**:
- 如果团队反馈良好，考虑引入 release-it (阶段 2)
- 如果项目规模扩大到 20+ 包，考虑完全迁移 (阶段 3)

**不推荐**:
- ❌ 不要为了对齐而对齐，除非有明确收益
- ❌ 不要在项目早期引入过度复杂的工具链

---

## 七、实施检查清单

### 7.1 阶段 1 实施步骤

- [ ] 创建 `.github/workflows/release-prepare.yml`
- [ ] 创建 `.github/workflows/release-publish.yml`
- [ ] 在 GitHub 仓库设置中添加 `NPM_TOKEN` secret
- [ ] 测试 workflow_dispatch 手动触发
- [ ] 执行一次完整的发布流程测试
- [ ] 更新项目文档 `HOW_TO_PUBLISH.md`
- [ ] 向团队成员培训新流程

### 7.2 验证清单

- [ ] 手动触发 prepare workflow 成功
- [ ] PR 自动创建且包含正确的版本更新
- [ ] PR 合并后自动触发 publish workflow
- [ ] 包成功发布到 npm
- [ ] Git tag 正确创建
- [ ] GitHub Release 自动生成

---

## 八、总结

Orval 的发布方案体现了现代 Monorepo 项目的最佳实践，通过 **release-it** + **GitHub Actions** + **Yarn Workspaces** 的组合实现了高度自动化和安全可控的发布流程。

对于本项目而言：
- **核心价值**: 借鉴其 PR-based 发布流程和工作流设计思路
- **适配策略**: 渐进式接入，保留现有工具栈
- **风险控制**: 不盲目追求工具对齐，聚焦业务价值

**下一步行动**: 立即实施阶段 1 方案，替换现有的脚本式发布流程，实现自动化发布。
