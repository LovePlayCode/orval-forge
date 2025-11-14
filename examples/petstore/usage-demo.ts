/**
 * OrvalForge Petstore API 使用演示
 *
 * 这个文件展示了如何使用 OrvalForge 生成的 API 函数
 * 注意: 这个文件需要先运行 `npm run generate` 生成 API 代码后才能使用
 */

// 导入生成的 API 函数和类型
// 注意: 这些导入在生成代码之前会报错，这是正常的
import { getPetstoreAPI } from './generated/api/endpoints';

const {
  listPets,
  createPet,
  showPetById,
  updatePet,
  deletePet,
  listUsers,
  createUser,
  getUserById,
} = getPetstoreAPI();

import type {
  Pet,
  NewPet,
  UpdatePet,
  User,
  NewUser,
} from './generated/api/models';

/**
 * Pet API 使用示例
 */
export class PetService {
  /**
   * 获取宠物列表
   */
  async getAllPets(limit = 20, tags?: string[]): Promise<Pet[]> {
    try {
      const response = await listPets({ limit, tags });
      console.log(`✅ 成功获取 ${response.data.length} 只宠物`);
      return response.data;
    } catch (error) {
      console.error('❌ 获取宠物列表失败:', error);
      throw error;
    }
  }

  /**
   * 创建新宠物
   */
  async addPet(
    petData: Omit<NewPet, 'status'> & { status?: Pet['status'] }
  ): Promise<Pet> {
    try {
      const newPet: NewPet = {
        ...petData,
        status: petData.status || 'available',
      };

      const response = await createPet(newPet);
      console.log(
        `✅ 成功创建宠物: ${response.data.name} (ID: ${response.data.id})`
      );
      return response.data;
    } catch (error) {
      console.error('❌ 创建宠物失败:', error);
      throw error;
    }
  }

  /**
   * 获取特定宠物
   */
  async getPetById(petId: number): Promise<Pet | null> {
    try {
      const response = await showPetById(petId);
      console.log(`✅ 成功获取宠物: ${response.data.name}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log(`⚠️  宠物 ID ${petId} 不存在`);
        return null;
      }
      console.error('❌ 获取宠物失败:', error);
      throw error;
    }
  }

  /**
   * 更新宠物信息
   */
  async updatePetInfo(petId: number, updates: UpdatePet): Promise<Pet> {
    try {
      const response = await updatePet(petId, updates);
      console.log(`✅ 成功更新宠物: ${response.data.name}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.error(`❌ 宠物 ID ${petId} 不存在`);
      } else {
        console.error('❌ 更新宠物失败:', error);
      }
      throw error;
    }
  }

  /**
   * 删除宠物
   */
  async removePet(petId: number): Promise<boolean> {
    try {
      await deletePet(petId);
      console.log(`✅ 成功删除宠物 ID: ${petId}`);
      return true;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log(`⚠️  宠物 ID ${petId} 不存在`);
        return false;
      }
      console.error('❌ 删除宠物失败:', error);
      throw error;
    }
  }

  /**
   * 按状态筛选宠物
   */
  async getPetsByStatus(status: Pet['status']): Promise<Pet[]> {
    const allPets = await this.getAllPets(100); // 获取更多宠物
    return allPets.filter((pet) => pet.status === status);
  }

  /**
   * 按标签筛选宠物
   */
  async getPetsByTags(tagNames: string[]): Promise<Pet[]> {
    const response = await listPets({ tags: tagNames, limit: 100 });
    return response.data;
  }
}

/**
 * User API 使用示例
 */
export class UserService {
  /**
   * 获取用户列表
   */
  async getAllUsers(
    page = 1,
    pageSize = 10
  ): Promise<{ users: User[]; total?: number }> {
    try {
      const response = await listUsers({ page, pageSize });
      const users = response.data.users || [];
      const total = response.data.pagination?.total;

      console.log(`✅ 成功获取第 ${page} 页用户，共 ${users.length} 个用户`);
      return { users, total };
    } catch (error) {
      console.error('❌ 获取用户列表失败:', error);
      throw error;
    }
  }

  /**
   * 创建新用户
   */
  async addUser(userData: NewUser): Promise<User> {
    try {
      const response = await createUser(userData);
      console.log(
        `✅ 成功创建用户: ${response.data.username} (ID: ${response.data.id})`
      );
      return response.data;
    } catch (error) {
      console.error('❌ 创建用户失败:', error);
      throw error;
    }
  }

  /**
   * 获取特定用户
   */
  async getUserById(userId: number): Promise<User | null> {
    try {
      const response = await getUserById(userId);
      console.log(`✅ 成功获取用户: ${response.data.username}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log(`⚠️  用户 ID ${userId} 不存在`);
        return null;
      }
      console.error('❌ 获取用户失败:', error);
      throw error;
    }
  }
}

/**
 * 综合使用示例
 */
export class PetstoreDemo {
  private petService = new PetService();
  private userService = new UserService();

  /**
   * 运行完整的演示
   */
  async runDemo(): Promise<void> {
    console.log('🐾 OrvalForge Petstore API 演示开始');
    console.log('='.repeat(50));

    try {
      // 1. 宠物管理演示
      await this.petDemo();

      console.log('\n' + '-'.repeat(30) + '\n');

      // 2. 用户管理演示
      await this.userDemo();
    } catch (error) {
      console.error('演示过程中出现错误:', error);
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 OrvalForge Petstore API 演示完成');
  }

  /**
   * 宠物管理演示
   */
  private async petDemo(): Promise<void> {
    console.log('🐕 宠物管理演示');

    // 获取现有宠物列表
    console.log('\n1. 获取宠物列表');
    const pets = await this.petService.getAllPets(5);
    console.log(`   当前有 ${pets.length} 只宠物`);

    // 创建新宠物
    console.log('\n2. 创建新宠物');
    const newPetData: NewPet = {
      name: 'Buddy',
      status: 'available',
      tags: [{ name: 'friendly' }, { name: 'playful' }],
      category: {
        name: 'Dog',
      },
      photoUrls: ['https://example.com/buddy.jpg'],
    };

    try {
      const createdPet = await this.petService.addPet(newPetData);

      // 获取刚创建的宠物
      console.log('\n3. 获取特定宠物');
      const retrievedPet = await this.petService.getPetById(createdPet.id);

      if (retrievedPet) {
        // 更新宠物信息
        console.log('\n4. 更新宠物信息');
        const updatedPet = await this.petService.updatePetInfo(createdPet.id, {
          name: 'Buddy Updated',
          status: 'pending',
        });

        console.log(`   宠物名称已更新: ${updatedPet.name}`);
        console.log(`   宠物状态已更新: ${updatedPet.status}`);
      }
    } catch (error) {
      console.log('   (创建宠物失败，可能是因为 API 不支持实际创建)');
    }

    // 按状态筛选
    console.log('\n5. 按状态筛选宠物');
    try {
      const availablePets = await this.petService.getPetsByStatus('available');
      console.log(`   可用宠物数量: ${availablePets.length}`);
    } catch (error) {
      console.log('   (筛选功能演示)');
    }
  }

  /**
   * 用户管理演示
   */
  private async userDemo(): Promise<void> {
    console.log('👥 用户管理演示');

    // 获取用户列表
    console.log('\n1. 获取用户列表');
    try {
      const { users, total } = await this.userService.getAllUsers(1, 5);
      console.log(
        `   当前有 ${users.length} 个用户 (总数: ${total || '未知'})`
      );

      if (users.length > 0) {
        console.log('   用户列表:');
        users.forEach((user, index) => {
          console.log(`     ${index + 1}. ${user.username} (${user.email})`);
        });
      }
    } catch (error) {
      console.log('   (获取用户列表演示)');
    }

    // 创建新用户
    console.log('\n2. 创建新用户');
    const newUserData: NewUser = {
      username: 'demo_user',
      email: 'demo@example.com',
      firstName: 'Demo',
      lastName: 'User',
      phone: '+1234567890',
      userStatus: 1,
    };

    try {
      const createdUser = await this.userService.addUser(newUserData);
      console.log(`   创建用户成功: ${createdUser.username}`);

      // 获取刚创建的用户
      console.log('\n3. 获取特定用户');
      const retrievedUser = await this.userService.getUserById(createdUser.id);
      if (retrievedUser) {
        console.log(
          `   用户详情: ${retrievedUser.firstName} ${retrievedUser.lastName}`
        );
      }
    } catch (error) {
      console.log('   (创建用户失败，可能是因为 API 不支持实际创建)');
    }
  }
}

/**
 * 类型安全演示
 */
export function typeDemo(): void {
  console.log('🔒 TypeScript 类型安全演示');

  // 类型约束确保数据正确性
  const createPetWithTypes = (): NewPet => {
    return {
      name: 'Type Safe Pet',
      status: 'available', // 只能是 'available' | 'pending' | 'sold'
      tags: [{ name: 'typescript' }, { name: 'type-safe' }],
      category: {
        id: 1,
        name: 'Demo Category',
      },
    };
  };

  // 编译时类型检查
  const handlePet = (pet: Pet): void => {
    console.log(`处理宠物: ${pet.name}`);

    // TypeScript 提供完整的智能提示
    if (pet.tags) {
      pet.tags.forEach((tag) => {
        if (tag.name) {
          console.log(`  标签: ${tag.name}`);
        }
      });
    }

    // 枚举类型检查
    switch (pet.status) {
      case 'available':
        console.log('  状态: 可用');
        break;
      case 'pending':
        console.log('  状态: 待定');
        break;
      case 'sold':
        console.log('  状态: 已售出');
        break;
      default:
        // TypeScript 会检查是否处理了所有可能的值
        console.log('  状态: 未知');
    }
  };

  // 调用 handlePet 函数以避免未使用错误
  // handlePet(createPetWithTypes());

  const demoData = createPetWithTypes();
  console.log('创建的演示数据:', demoData);

  // 调用 handlePet 函数以避免未使用错误
  handlePet(demoData as Pet);
}

// 导出服务实例
export const petService = new PetService();
export const userService = new UserService();
export const demo = new PetstoreDemo();

// 如果直接运行此文件
if (require.main === module) {
  console.log('⚠️  请先运行 "npm run generate" 生成 API 代码');
  console.log('然后使用 TypeScript 编译器运行此演示:');
  console.log('  npx tsc usage-demo.ts && node usage-demo.js');
}
