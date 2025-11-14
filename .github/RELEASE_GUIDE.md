# 发布指南

## 📋 标准发布流程

### 1. 准备发布

确保 `main` 分支：
- ✅ 所有功能已完成并合并
- ✅ 所有测试通过
- ✅ CI/CD 流水线正常
- ✅ 文档已更新

### 2. 创建 Release PR

1. 进入 GitHub Actions 页面
2. 选择 **"Create Release PR"** workflow
3. 点击 **"Run workflow"**
4. 填写参数：
   - `version`: 如 `1.0.1`, `1.1.0`, `2.0.0`
   - `version-type`: `patch` / `minor` / `major`
5. 运行后自动创建 PR

### 3. 审核 Release PR

检查项：
- [ ] 所有 `package.json` 的版本号正确
- [ ] `pnpm-lock.yaml` 已更新
- [ ] 没有意外的文件变更
- [ ] CI 检查全部通过

### 4. 发布

合并 PR 后，自动触发发布流程：
1. 构建所有包
2. 运行测试
3. 发布到 npm
4. 创建 Git Tag
5. 创建 GitHub Release

---

## ⚠️ 异常情况处理

### 场景 A：Release PR 审核时发现小问题

**适用于**：文档错误、注释修正、样式调整等非功能性修改

**步骤**：
```bash
# 1. 切换到 release 分支
git fetch origin
git checkout release/v1.0.1

# 2. 修复问题
# ... 编辑文件 ...

# 3. 提交并推送
git add .
git commit -m "docs: 修复发布文档"
git push origin release/v1.0.1

# 4. PR 会自动更新，继续审核
```

### 场景 B：发现重大问题，需要重新发布

**适用于**：功能 bug、逻辑错误、需要重新测试的修改

**步骤**：
```bash
# 1. 关闭 release PR（在 GitHub 上）

# 2. 删除 release 分支
git push origin --delete release/v1.0.1

# 3. 创建修复分支
git checkout -b hotfix/issue-description main

# 4. 修复问题
# ... 编辑、测试 ...

# 5. 提交 PR 到 main
git push origin hotfix/issue-description
# 在 GitHub 创建 PR，审核后合并

# 6. 重新运行 "Create Release PR" workflow
```

### 场景 C：取消发布

```bash
# 1. 关闭 release PR（在 GitHub 上）

# 2. 删除 release 分支
git push origin --delete release/v1.0.1

# 完成！
```

### 场景 D：发布后发现问题

```bash
# 1. 在 main 分支修复问题（通过 PR）

# 2. 发布 patch 版本
# 运行 workflow，版本号：1.0.2
```

---

## 🔒 分支保护建议

为了避免直接在 `main` 上修改，建议配置：

### GitHub 仓库设置

**Settings → Branches → Branch protection rules**

保护 `main` 分支：
- ✅ **Require a pull request before merging**
  - Require approvals: 1
- ✅ **Require status checks to pass before merging**
  - CI tests
  - Lint checks
- ✅ **Require branches to be up to date before merging**
- ✅ **Do not allow bypassing the above settings**

这样确保：
- ❌ 不能直接 push 到 main
- ✅ 所有修改必须通过 PR
- ✅ PR 需要审核才能合并
- ✅ CI 必须通过

---

## 📊 版本号规范

遵循 [Semantic Versioning](https://semver.org/)：

```
主版本号.次版本号.修订号
MAJOR.MINOR.PATCH

1.2.3
│ │ │
│ │ └─ PATCH: bug 修复（向后兼容）
│ └─── MINOR: 新功能（向后兼容）
└───── MAJOR: 破坏性变更（不向后兼容）
```

**示例**：
- `1.0.0 → 1.0.1`: 修复了一个 bug (patch)
- `1.0.1 → 1.1.0`: 添加了新功能 (minor)
- `1.1.0 → 2.0.0`: API 有破坏性变更 (major)

---

## ✅ 发布检查清单

发布前确认：

- [ ] 功能完整且测试通过
- [ ] 文档已更新
- [ ] CHANGELOG 准备好（可选）
- [ ] 没有已知的重大 bug
- [ ] CI/CD 全部通过
- [ ] 依赖版本无冲突
- [ ] npm token 配置正确
- [ ] 团队成员已知晓发布计划

发布后验证：

- [ ] npm 包已更新
- [ ] GitHub Release 已创建
- [ ] Git Tag 已推送
- [ ] 在新项目中测试安装

---

## 🆘 常见问题

### Q: 为什么 workflow 没有创建 PR？
A: 可能原因：
1. 版本号与当前相同（没有变更）
2. GitHub Actions 权限不足
3. 检查 workflow 日志获取详细信息

### Q: 发布失败怎么办？
A: 
1. 检查 GitHub Actions 日志
2. 常见原因：测试失败、npm token 无效、包名冲突
3. 修复后重新合并 PR 即可

### Q: 可以撤回已发布的 npm 版本吗？
A: 
- npm 不允许删除已发布的版本
- 可以发布新版本覆盖
- 紧急情况可以 deprecate：`npm deprecate <pkg>@<version> "reason"`

### Q: workflow 可以自动决定版本号吗？
A: 
- 当前需要手动输入
- 未来可以集成 conventional commits 自动判断
- 或基于 PR 标签自动递增
