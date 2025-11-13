# 🚀 OrvalForge Monorepo 快速开始

> 基于 Orval 最佳实践的现代化 Monorepo 架构升级方案

## 📊 对比分析

### 当前架构 vs 目标架构

| 方面 | 当前架构 | 目标架构 (Monorepo) |
|------|----------|---------------------|
| **包管理** | 单一 package.json | 多包 + 工作空间 |
| **构建工具** | Rollup | Turborepo + TypeScript |
| **依赖管理** | npm/yarn | pnpm workspaces |
| **代码组织** | 单一 src/ 目录 | 按功能分包 |
| **发布策略** | 单包发布 | 独立包发布 |
| **开发体验** | 手动构建 | 并行构建 + 缓存 |
| **扩展性** | 耦合度高 | 模块化设计 |

## 🎯 升级后的包结构

```
orval-forge/
├── packages/
│   ├── types/                    # @orval-forge/types
│   │   └── 共享类型定义
│   ├── core/                     # @orval-forge/core  
│   │   └── 核心代码生成引擎
│   ├── my-request/               # @orval-forge/my-request
│   │   └── 功能丰富的HTTP客户端
│   ├── my-mini-request/          # @orval-forge/my-mini-request
│   │   └── 轻量级HTTP客户端
│   ├── cli/                      # @orval-forge/cli
│   │   └── 命令行工具
│   └── orval-forge/              # orval-forge (主包)
│       └── 统一入口，重新导出所有功能
├── examples/
│   ├── basic/                    # 基础使用示例
│   ├── advanced/                 # 高级功能示例
│   ├── react-app/                # React 应用示例
│   ├── vue-app/                  # Vue 应用示例
│   └── node-app/                 # Node.js 应用示例
└── tests/                        # 集成测试
```

## 🛠️ 技术栈升级

### 包管理器：npm → pnpm
```bash
# 更快的安装速度
# 更少的磁盘空间占用  
# 更严格的依赖管理
pnpm install
```

### 构建工具：Rollup → Turborepo + TypeScript
```bash
# 并行构建所有包
pnpm build

# 增量构建（只构建变更的包）
pnpm build --filter=@orval-forge/core

# 开发模式 - 监听所有包
pnpm dev
```

### 任务运行器：手动 → Turborepo
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

## 📦 用户安装方式对比

### 当前方式
```bash
# 只能全量安装
npm install orval-forge
```

### 升级后的方式
```bash
# 1. 完整功能（向后兼容）
npm install orval-forge

# 2. 按需安装 - 只要 CLI
npm install @orval-forge/cli

# 3. 按需安装 - 核心 + 轻量客户端
npm install @orval-forge/core @orval-forge/my-mini-request

# 4. 按需安装 - 核心 + 功能丰富客户端
npm install @orval-forge/core @orval-forge/my-request

# 5. 只要类型定义
npm install @orval-forge/types
```

## 🚀 快速体验升级方案

### 1. 运行迁移脚本
```bash
# 创建 Monorepo 结构
node scripts/migrate-to-monorepo.js

# 安装依赖
pnpm install

# 构建所有包
pnpm build
```

### 2. 开发体验对比

#### 当前开发流程
```bash
# 修改代码
vim src/core/generator.ts

# 手动构建
npm run build

# 测试
cd examples/demo
npm start
```

#### 升级后的开发流程
```bash
# 修改代码
vim packages/core/src/generator.ts

# 自动增量构建（只构建变更的包）
pnpm build --filter=@orval-forge/core...

# 并行测试所有示例
pnpm examples:test

# 开发模式 - 所有包热重载
pnpm dev
```

## 📈 性能对比

### 构建性能
| 场景 | 当前架构 | Monorepo架构 | 提升 |
|------|----------|--------------|------|
| 冷启动构建 | ~30s | ~25s | 17% ↑ |
| 增量构建 | ~30s | ~5s | 83% ↑ |
| 并行构建 | 不支持 | 支持 | ∞ |
| 构建缓存 | 无 | 智能缓存 | 显著提升 |

### 开发体验
| 功能 | 当前架构 | Monorepo架构 |
|------|----------|--------------|
| 热重载 | 手动 | 自动 |
| 类型检查 | 全量 | 增量 |
| 代码检查 | 全量 | 按包 |
| 测试运行 | 串行 | 并行 |

## 🎨 用户体验提升

### 1. 灵活的安装选择
```typescript
// 场景1：轻量级应用 - 只需要基础功能
import { generateApi } from '@orval-forge/core';
import { MyMiniRequest } from '@orval-forge/my-mini-request';

// 场景2：企业级应用 - 需要完整功能
import { generateApi } from '@orval-forge/core';
import { MyRequest } from '@orval-forge/my-request';

// 场景3：CLI 工具
import '@orval-forge/cli'; // 全局安装后直接使用命令

// 场景4：向后兼容 - 无需修改现有代码
import { generateApi, MyRequest, MyMiniRequest } from 'orval-forge';
```

### 2. 更好的文档结构
```
docs/
├── README.md                 # 总览
├── packages/
│   ├── core/                 # 核心包文档
│   ├── cli/                  # CLI 文档
│   ├── my-request/           # HTTP 客户端文档
│   └── ...
├── examples/                 # 示例文档
└── migration/                # 迁移指南
```

### 3. 独立版本控制
```bash
# 只更新 CLI 工厂
@orval-forge/cli@1.2.0

# 只更新核心引擎
@orval-forge/core@1.1.0

# 主包自动跟随最新版本
orval-forge@1.2.0
```

## 🔄 迁移路径

### 阶段1：结构搭建（1周）
- [x] 创建 Monorepo 结构
- [x] 配置构建工具链
- [x] 配置代码质量工具

### 阶段2：代码迁移（2周）
- [ ] 拆分现有代码到对应包
- [ ] 更新导入路径
- [ ] 配置包间依赖

### 阶段3：示例重构（1周）
- [ ] 重构现有示例
- [ ] 添加新的使用场景示例
- [ ] 配置示例的独立测试

### 阶段4：发布准备（1周）
- [ ] 配置 Changesets
- [ ] 设置 CI/CD 流水线
- [ ] 编写迁移文档

## 💡 立即开始

### 快速预览升级效果
```bash
# 1. 运行迁移脚本（不会影响现有代码）
node scripts/migrate-to-monorepo.js

# 2. 查看生成的结构
tree packages/ -I node_modules

# 3. 体验新的构建流程
pnpm install
pnpm build
```

### 渐进式迁移
1. **保持向后兼容**：现有用户代码无需修改
2. **并行开发**：新架构与现有架构并存
3. **逐步切换**：功能验证后逐步切换

## 🎯 预期收益

### 开发效率
- **构建速度**：增量构建提升 80%+
- **开发体验**：热重载 + 智能缓存
- **代码质量**：统一的 lint 和格式化

### 用户体验  
- **按需安装**：减少 bundle 大小
- **类型安全**：更好的 TypeScript 支持
- **文档清晰**：每个包独立文档

### 项目维护
- **模块化**：职责清晰，易于维护
- **可扩展**：添加新功能不影响现有包
- **版本控制**：独立发布和版本管理

---

**🚀 这个升级方案将使 OrvalForge 具备现代化的项目架构，为未来的发展奠定坚实基础！**