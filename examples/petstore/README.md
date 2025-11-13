# 🐾 OrvalForge Petstore 示例

这个示例展示了如何使用 OrvalForge 根据 OpenAPI 规范生成 TypeScript API 接口函数。

## 📋 示例概述

- **OpenAPI 规范**: `swagger.json` - 完整的 Petstore API 规范
- **配置文件**: `orval-forge.config.js` - OrvalForge 配置
- **验证脚本**: `verify-generation.js` - 自动验证生成结果
- **预期输出**: `expected-output/` - 展示期望的生成结果

## 🎯 API 功能

### Pet 管理 API
- `GET /pets` - 列出所有宠物 (支持分页和标签过滤)
- `POST /pets` - 创建新宠物
- `GET /pets/{petId}` - 根据 ID 获取宠物信息
- `PUT /pets/{petId}` - 更新宠物信息
- `DELETE /pets/{petId}` - 删除宠物

### User 管理 API
- `GET /users` - 列出所有用户 (支持分页)
- `POST /users` - 创建新用户
- `GET /users/{userId}` - 根据 ID 获取用户信息

## 🚀 快速开始

### 1. 安装依赖

```bash
cd examples/petstore
npm install
```

### 2. 验证配置

```bash
npm run validate
```

### 3. 生成 API 代码

```bash
npm run generate
```

### 4. 验证生成结果

```bash
npm test
```

## 📁 生成的文件结构

```
generated/
├── api/
│   ├── endpoints.ts      # API 函数
│   ├── models/           # 类型定义
│   │   ├── index.ts
│   │   ├── Pet.ts
│   │   ├── User.ts
│   │   └── ...
│   └── mutator.ts        # HTTP 客户端配置
```

## 📝 使用生成的 API

### 基本使用

```typescript
import { listPets, createPet, showPetById } from './generated/api/endpoints';
import type { Pet, NewPet } from './generated/api/models';

// 获取宠物列表
const pets = await listPets({ limit: 10, tags: ['friendly'] });
console.log('宠物列表:', pets.data);

// 创建新宠物
const newPet: NewPet = {
  name: 'Buddy',
  status: 'available',
  tags: [{ name: 'friendly' }],
};

const createdPet = await createPet(newPet);
console.log('创建的宠物:', createdPet.data);

// 获取特定宠物
const pet = await showPetById({ petId: 1 });
console.log('宠物详情:', pet.data);
```

### 错误处理

```typescript
import { getUserById } from './generated/api/endpoints';

try {
  const user = await getUserById({ userId: 123 });
  console.log('用户信息:', user.data);
} catch (error) {
  if (error.response?.status === 404) {
    console.log('用户不存在');
  } else {
    console.error('获取用户失败:', error.message);
  }
}
```

### 类型安全

```typescript
import type { Pet, User, Error } from './generated/api/models';

// 完整的类型支持
const handlePet = (pet: Pet) => {
  console.log(`宠物 ${pet.name} 的状态是 ${pet.status}`);
  
  // TypeScript 会提供完整的类型提示和检查
  if (pet.tags) {
    pet.tags.forEach(tag => {
      console.log(`标签: ${tag.name}`);
    });
  }
};

// 类型约束确保数据正确性
const createNewPet = (): NewPet => {
  return {
    name: 'Max', // 必需字段
    status: 'available', // 枚举类型，只能是 'available' | 'pending' | 'sold'
    // TypeScript 会在编译时检查所有字段类型
  };
};
```

## 🔧 配置说明

### OrvalForge 配置

```javascript
module.exports = {
  orval: {
    petstore: {
      input: './swagger.json', // OpenAPI 规范文件
      output: {
        mode: 'split', // 分离模式，生成多个文件
        target: './generated/api/endpoints.ts', // API 函数输出
        schemas: './generated/api/models', // 类型定义输出
        clean: true, // 清理旧文件
        prettier: true, // 格式化代码
      },
    },
  },
  httpClient: {
    type: 'MyRequest', // 使用功能丰富的 HTTP 客户端
    baseURL: 'https://petstore.swagger.io/v2',
    timeout: 10000,
    // ... 更多配置
  },
};
```

### HTTP 客户端特性

- **自动重试**: 网络错误时自动重试
- **请求拦截器**: 自动添加认证头等
- **响应拦截器**: 统一错误处理和日志
- **缓存支持**: 减少重复请求
- **超时控制**: 防止请求挂起

## 🧪 验证测试

### 自动验证

```bash
npm test
```

验证脚本会检查：
- ✅ 文件和目录是否正确生成
- ✅ 所有 API 函数是否存在
- ✅ 类型定义是否完整
- ✅ TypeScript 语法是否正确

### 手动验证

1. **检查生成的文件**:
   ```bash
   ls -la generated/api/
   ```

2. **查看 API 函数**:
   ```bash
   cat generated/api/endpoints.ts
   ```

3. **查看类型定义**:
   ```bash
   cat generated/api/models/index.ts
   ```

## 📊 预期结果

### API 函数

生成的 `endpoints.ts` 应该包含：

```typescript
// Pet API
export const listPets = async (params?: { limit?: number; tags?: string[]; }) => { ... };
export const createPet = async (data: NewPet) => { ... };
export const showPetById = async (params: { petId: number; }) => { ... };
export const updatePet = async (params: { petId: number; data: UpdatePet; }) => { ... };
export const deletePet = async (params: { petId: number; }) => { ... };

// User API
export const listUsers = async (params?: { page?: number; pageSize?: number; }) => { ... };
export const createUser = async (data: NewUser) => { ... };
export const getUserById = async (params: { userId: number; }) => { ... };
```

### 类型定义

生成的类型定义应该包含：

```typescript
export interface Pet {
  id: number;
  name: string;
  category?: Category;
  photoUrls?: string[];
  tags?: Tag[];
  status?: 'available' | 'pending' | 'sold';
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  userStatus?: 0 | 1 | 2;
  createdAt?: string;
  updatedAt?: string;
}

// ... 其他类型定义
```

## 🔍 故障排除

### 常见问题

**Q: 生成失败，提示找不到配置文件**
```bash
# 确保在 petstore 目录下运行
cd examples/petstore
npm run validate
```

**Q: 生成的文件不完整**
```bash
# 清理并重新生成
npm run clean
npm run generate
```

**Q: TypeScript 类型错误**
```bash
# 检查生成的代码语法
npx tsc --noEmit generated/api/endpoints.ts
```

### 调试模式

```bash
# 详细输出模式
npm run generate:check

# 监听模式（开发时使用）
npm run generate:watch
```

## 🎯 下一步

1. **自定义配置**: 修改 `orval-forge.config.js` 尝试不同配置
2. **扩展 API**: 在 `swagger.json` 中添加新的端点
3. **集成项目**: 将生成的 API 集成到实际项目中
4. **高级功能**: 探索拦截器、缓存等高级特性

## 📚 相关文档

- [CLI 使用指南](../../docs/CLI.md)
- [完整使用示例](../cli-usage.md)
- [入门指南](../../GETTING_STARTED.md)
- [项目主文档](../../README.md)

---

这个示例展示了 OrvalForge 的核心功能：根据 OpenAPI 规范自动生成类型安全的 TypeScript API 接口函数。🎉