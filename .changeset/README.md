# Changesets

欢迎使用 changesets！这是一个管理版本和发布的工具。

## 如何使用

### 1. 添加 Changeset

当你完成一个功能或修复后：

```bash
pnpm changeset
```

按照提示：
1. 选择要发布的包
2. 选择版本类型（major/minor/patch）
3. 描述你的更改

### 2. 版本更新

准备发布时：

```bash
pnpm changeset version
```

这会：
- 消费所有 changesets
- 更新包版本
- 生成 CHANGELOG

### 3. 发布

```bash
pnpm changeset publish
```

## 示例

### 添加新功能

```bash
$ pnpm changeset

🦋  Which packages would you like to include? 
  ◉ @orval-forge/core
  ◉ orval-forge

🦋  Which packages should have a minor bump?
  ◉ @orval-forge/core
  ◉ orval-forge

🦋  Summary: Add support for custom templates
```

### Bug 修复

```bash
$ pnpm changeset

🦋  Which packages would you like to include?
  ◉ @orval-forge/core

🦋  Which packages should have a patch bump?
  ◉ @orval-forge/core

🦋  Summary: Fix type generation issue
```

## 版本类型

- **Major**: 破坏性更改
- **Minor**: 新功能
- **Patch**: Bug 修复

## 更多信息

查看 [Changesets 文档](https://github.com/changesets/changesets)
