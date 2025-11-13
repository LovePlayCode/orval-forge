# 🎯 OrvalForge Demo 运行指南

这是一个完整的 OrvalForge 使用演示，展示了如何从 OpenAPI 规范生成类型安全的 API 客户端。

## 🚀 快速运行

> **重要**: OrvalForge 还未发布到 npm，需要先设置本地环境

### 方法一：一键设置（推荐）

```bash
# 在项目根目录执行
npm run demo:setup
cd examples/demo
npm start
```

### 方法二：手动设置

```bash
# 1. 构建主项目
cd ../../
npm install && npm run build

# 2. 运行 demo
cd examples/demo
npm run setup
npm start
```

## 📁 Demo 结构说明

```
demo/
├── README.md                    # 详细文档
├── DEMO_GUIDE.md               # 本运行指南
├── package.json                # 项目配置
├── tsconfig.json               # TypeScript 配置
├── swagger.json                # OpenAPI 规范文件
├── orval-forge.config.js       # OrvalForge 配置
├── src/
│   ├── index.ts                # 主程序入口
│   ├── examples/               # 使用示例
│   │   ├── basic-usage.ts      # 基础使用
│   │   ├── advanced-usage.ts   # 高级使用
│   │   └── error-handling.ts   # 错误处理
│   └── services/              # 业务服务层
│       ├── userService.ts     # 用户服务
│       └── postService.ts     # 文章服务
└── generated/                 # 生成的代码 (运行后创建)
    ├── api.ts                 # API 函数
    └── models/                # 类型定义
```

## 🎮 运行不同示例

### 1. 运行所有示例
```bash
npm start
```

### 2. 单独运行各个示例
```bash
# 基础使用示例
npm run example:basic

# 高级使用示例 (拦截器、并发等)
npm run example:advanced

# 错误处理示例
npm run example:error-handling

# 运行所有示例
npm run example:all
```

## 🔧 开发模式

### 启动监听模式
```bash
# 启动 API 代码监听生成
npm run api:watch
```

在另一个终端运行：
```bash
# 启动开发服务器
npm run dev:server
```

### 验证配置
```bash
# 验证 OrvalForge 配置
npm run api:validate

# 预览生成（不实际生成）
npm run api:check

# 查看配置信息
npm run api:config
```

## 📊 Demo 内容展示

运行 `npm start` 后，你将看到：

### 1️⃣ 基础使用示例
- ✅ 获取用户列表
- ✅ 获取用户详情
- ✅ 创建新用户
- ✅ 获取文章列表
- ✅ 获取文章详情
- ✅ 获取文章评论

### 2️⃣ 高级使用示例
- ✅ 自定义 HTTP 客户端
- ✅ 请求/响应拦截器
- ✅ 并发请求处理
- ✅ 请求重试机制
- ✅ 数据转换
- ✅ 条件请求

### 3️⃣ 错误处理示例
- ✅ 404 错误处理
- ✅ 网络错误处理
- ✅ 超时错误处理
- ✅ 验证错误处理
- ✅ 全局错误拦截器
- ✅ 自定义错误类型

## 🎯 学习要点

### API 代码生成
```bash
# 查看生成前后的变化
ls -la generated/  # 生成前
npm run api:generate
ls -la generated/  # 生成后
```

### 类型安全
生成的代码提供完整的 TypeScript 类型支持：
```typescript
import type { User, CreateUserRequest } from './generated/models';

// 编译时类型检查
const user: User = await getUserById({ id: 1 });
const newUser: CreateUserRequest = {
  name: 'John',    // ✅ 必需字段
  email: 'john@example.com',  // ✅ 必需字段
  // phone: '123'  // ✅ 可选字段
};
```

### HTTP 客户端功能
```typescript
import { MyRequest } from 'orval-forge';

const client = new MyRequest({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  retry: true,        // 自动重试
  retryCount: 3,      // 重试次数
  retryDelay: 1000,   // 重试延迟
});

// 支持拦截器
client.interceptors.request.use(config => {
  // 请求前处理
  return config;
});
```

## 🔍 代码探索

### 查看生成的 API 函数
```bash
# 生成代码后查看
cat generated/api.ts | head -20
```

### 查看生成的类型定义
```bash
# 查看用户类型
cat generated/models/User.ts

# 查看所有模型
ls generated/models/
```

### 查看 OpenAPI 规范
```bash
# 查看 API 规范
cat swagger.json | jq '.paths | keys'  # 需要安装 jq
```

## 🧪 自定义实验

### 修改 OpenAPI 规范
1. 编辑 `swagger.json`
2. 添加新的端点或模型
3. 运行 `npm run api:generate`
4. 查看生成的新代码

### 修改 OrvalForge 配置
1. 编辑 `orval-forge.config.js`
2. 修改 HTTP 客户端类型或配置
3. 重新生成代码
4. 观察变化

### 创建自定义服务
参考 `src/services/` 中的示例，创建自己的业务服务层。

## 🐛 故障排除

### 常见问题

**Q: 生成失败**
```bash
# 检查配置
npm run api:validate

# 查看详细错误
npm run api:check
```

**Q: 类型错误**
```bash
# 确保生成了最新代码
npm run api:generate

# 检查 TypeScript 配置
npx tsc --noEmit
```

**Q: 网络请求失败**
```bash
# 检查网络连接
curl https://jsonplaceholder.typicode.com/users

# 查看详细错误日志
npm run example:error-handling
```

## 🎓 进阶学习

完成这个 demo 后，你可以：

1. 📖 阅读 [OrvalForge 完整文档](../README.md)
2. 🔧 查看 [CLI 使用指南](../docs/CLI.md)
3. 🚀 参考 [入门指南](../GETTING_STARTED.md)
4. 💼 在实际项目中应用 OrvalForge

## 🤝 反馈与贡献

如果你发现任何问题或有改进建议，欢迎：
- 提交 Issue
- 发起 Pull Request
- 分享使用经验

Happy coding with OrvalForge! 🔥