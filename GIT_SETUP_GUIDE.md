# Git 配置指南

## ✅ 已完成配置

### 1. Git 仓库初始化

```bash
✅ git init
✅ 默认分支设置为 main
✅ 初始提交完成（137 个文件）
```

### 2. 配置文件

已创建以下 Git 配置文件：

#### `.gitignore`
完整的忽略规则，包括：
- **依赖**: `node_modules/`, `.pnpm-store/`
- **构建产物**: `dist/`, `build/`, `.turbo/`
- **环境变量**: `.env*`, `.npmrc.local`
- **IDE 文件**: `.vscode/`, `.idea/`
- **OS 文件**: `.DS_Store`, `Thumbs.db`
- **日志文件**: `*.log`, `logs/`
- **测试覆盖率**: `coverage/`, `.nyc_output/`
- **缓存**: `.cache/`, `.next/`
- **临时文件**: `tmp/`, `temp/`
- **项目特定**: `orvalConfig/` (Orval 参考配置)

#### `.gitattributes`
文件属性配置：
- 自动检测文本文件
- 统一使用 LF 换行符（Unix 风格）
- TypeScript/JavaScript 文件强制 LF
- Lock 文件标记为 binary 避免冲突
- 排除测试和文档文件不进入 archive

#### `.editorconfig`
编辑器统一配置：
- 字符编码: UTF-8
- 换行符: LF
- 缩进: 2 空格
- 文件末尾保留空行
- 自动删除行尾空格

---

## 🚀 下一步操作

### 1. 配置个人 Git 信息（推荐）

当前使用的是临时配置，建议设置为你的个人信息：

```bash
# 设置全局用户名和邮箱
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 或仅为本项目设置
cd /Users/nathenieli/codebuddy/orval-forge
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### 2. 连接远程仓库

#### 方式 1: 连接到已有仓库

```bash
# 添加远程仓库
git remote add origin https://github.com/your-username/orval-forge.git

# 或使用 SSH
git remote add origin git@github.com:your-username/orval-forge.git

# 推送到远程
git push -u origin main
```

#### 方式 2: 在 GitHub 创建新仓库

1. 访问 https://github.com/new
2. 仓库名称: `orval-forge`
3. 描述: `Enterprise-grade API client code generator based on Orval`
4. 选择 **Private** 或 **Public**
5. **不要**勾选 "Initialize this repository with"（已有本地仓库）
6. 点击 "Create repository"
7. 按照页面提示执行：

```bash
git remote add origin https://github.com/your-username/orval-forge.git
git branch -M main
git push -u origin main
```

### 3. 验证远程连接

```bash
# 查看远程仓库
git remote -v

# 应该显示：
# origin  https://github.com/your-username/orval-forge.git (fetch)
# origin  https://github.com/your-username/orval-forge.git (push)
```

---

## 📋 常用 Git 命令

### 日常开发

```bash
# 查看状态
git status

# 查看修改内容
git diff

# 添加文件到暂存区
git add .                    # 添加所有修改
git add path/to/file        # 添加指定文件

# 提交
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "docs: update README"

# 推送到远程
git push
```

### 分支管理

```bash
# 创建并切换分支
git checkout -b feature/new-feature

# 切换分支
git checkout main

# 查看所有分支
git branch -a

# 删除分支
git branch -d feature/old-feature
```

### 同步远程更新

```bash
# 拉取最新代码
git pull origin main

# 或分两步
git fetch origin
git merge origin/main
```

### 撤销修改

```bash
# 撤销工作区修改（危险！）
git checkout -- path/to/file

# 撤销暂存区的文件
git reset HEAD path/to/file

# 撤销最后一次提交（保留修改）
git reset --soft HEAD^

# 撤销最后一次提交（丢弃修改，危险！）
git reset --hard HEAD^
```

---

## 🔍 Git 提交规范

本项目使用 **Conventional Commits** 规范（已配置 Commitlint）。

### 提交消息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

| Type | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: add support for OpenAPI 3.1` |
| `fix` | Bug 修复 | `fix: resolve type generation error` |
| `docs` | 文档更新 | `docs: update API documentation` |
| `style` | 代码格式（不影响功能） | `style: format code with prettier` |
| `refactor` | 重构 | `refactor: simplify request adapter` |
| `perf` | 性能优化 | `perf: improve build speed` |
| `test` | 测试相关 | `test: add unit tests for core` |
| `chore` | 构建、工具等 | `chore: update dependencies` |
| `ci` | CI 配置 | `ci: update GitHub Actions workflow` |
| `revert` | 回滚 | `revert: rollback to v1.0.0` |

### Scope（可选）

| Scope | 说明 |
|-------|------|
| `core` | 核心包 |
| `cli` | CLI 工具 |
| `types` | 类型定义 |
| `request` | 请求适配器 |
| `docs` | 文档 |
| `deps` | 依赖更新 |
| `release` | 发布相关 |

### 示例

```bash
# 好的提交消息
git commit -m "feat(core): add support for custom templates"
git commit -m "fix(cli): resolve path resolution on Windows"
git commit -m "docs: add migration guide from v1 to v2"
git commit -m "chore(deps): upgrade orval to v6.32.0"

# 带详细说明的提交
git commit -m "feat(core): add support for custom templates

- Add template override mechanism
- Support user-defined Handlebars helpers
- Add documentation for template customization

Closes #123"
```

---

## 🛠️ Git Hooks

已配置 Husky + Commitlint + Lint-staged：

### Pre-commit Hook

每次提交前自动运行：
- **ESLint**: 检查代码质量
- **Prettier**: 格式化代码
- **Type Check**: TypeScript 类型检查

### Commit-msg Hook

验证提交消息是否符合规范：
```bash
# ✅ 正确
git commit -m "feat: add new feature"

# ❌ 错误（会被拒绝）
git commit -m "add new feature"
git commit -m "WIP"
```

### 跳过 Hooks（紧急情况）

```bash
# 跳过 pre-commit（不推荐）
git commit --no-verify -m "feat: emergency fix"

# 或使用简写
git commit -n -m "feat: emergency fix"
```

---

## 📊 查看提交历史

```bash
# 简洁日志
git log --oneline

# 图形化显示分支
git log --graph --oneline --all

# 查看某个文件的修改历史
git log -- path/to/file

# 查看最近 5 次提交
git log -5

# 查看详细修改内容
git log -p
```

---

## 🔐 .gitignore 使用说明

### 已忽略的文件类型

1. **依赖目录**
   - `node_modules/` - npm/pnpm/yarn 依赖
   - `.pnpm-store/` - pnpm 全局存储

2. **构建产物**
   - `dist/`, `build/`, `lib/` - 构建输出
   - `.turbo/` - Turbo 缓存
   - `*.tsbuildinfo` - TypeScript 增量构建

3. **环境变量**
   - `.env*` - 所有环境变量文件
   - `.npmrc.local` - 本地 npm 配置

4. **IDE 文件**
   - `.vscode/` - VSCode 配置（除示例配置）
   - `.idea/` - JetBrains IDEs

5. **系统文件**
   - `.DS_Store` - macOS
   - `Thumbs.db` - Windows

6. **测试和覆盖率**
   - `coverage/` - 测试覆盖率报告
   - `.nyc_output/`, `.vitest/` - 测试缓存

7. **临时文件**
   - `tmp/`, `temp/` - 临时目录
   - `*.log` - 日志文件

8. **项目特定**
   - `orvalConfig/` - Orval 原始配置（仅供参考）

### 强制添加被忽略的文件

```bash
# 强制添加被 .gitignore 忽略的文件
git add -f path/to/ignored-file
```

### 检查文件是否被忽略

```bash
# 检查为什么文件被忽略
git check-ignore -v path/to/file
```

---

## 🚨 常见问题

### Q1: 提交时报错 "Commitlint failed"

**原因**: 提交消息不符合规范

**解决**:
```bash
# 修改最后一次提交消息
git commit --amend -m "feat: correct commit message"
```

### Q2: 如何忽略已跟踪的文件？

**解决**:
```bash
# 从 Git 移除但保留本地文件
git rm --cached path/to/file

# 或移除整个目录
git rm -r --cached path/to/directory

# 然后添加到 .gitignore
echo "path/to/file" >> .gitignore
git commit -m "chore: stop tracking file"
```

### Q3: 不小心提交了大文件怎么办？

**解决**:
```bash
# 从历史中移除文件（使用 git-filter-repo）
# 1. 安装 git-filter-repo
brew install git-filter-repo  # macOS

# 2. 移除文件
git filter-repo --path path/to/large-file --invert-paths

# 3. 强制推送
git push --force
```

### Q4: 如何查看被忽略的文件列表？

**解决**:
```bash
# 显示所有被忽略的文件
git status --ignored
```

---

## 📚 相关资源

- [Git 官方文档](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitlint](https://commitlint.js.org/)
- [Husky](https://typicode.github.io/husky/)
- [GitHub 文档](https://docs.github.com/)

---

## ✅ 配置检查清单

完成以下步骤确保 Git 配置正确：

- [x] Git 仓库已初始化
- [x] `.gitignore` 已配置
- [x] `.gitattributes` 已配置
- [x] `.editorconfig` 已配置
- [x] 初始提交已完成
- [ ] 配置个人 Git 用户信息
- [ ] 连接到远程仓库
- [ ] 推送代码到 GitHub
- [ ] 邀请团队成员（如有）
- [ ] 配置分支保护规则（可选）

---

**Git 配置完成！** 🎉

现在可以开始使用 Git 进行版本控制了。
