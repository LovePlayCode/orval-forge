/**
 * 预期生成的类型定义示例
 * 这个文件展示了 OrvalForge 应该生成的 TypeScript 类型定义格式
 */

// ============================================================================
// Pet Related Types
// ============================================================================

export interface Pet {
  /** Unique identifier for the pet */
  id: number;
  /** Name of the pet */
  name: string;
  category?: Category;
  /** List of photo URLs */
  photoUrls?: string[];
  /** List of tags */
  tags?: Tag[];
  /** Pet status in the store */
  status?: 'available' | 'pending' | 'sold';
  /** When the pet was created */
  createdAt?: string;
  /** When the pet was last updated */
  updatedAt?: string;
}

export interface NewPet {
  /** Name of the pet */
  name: string;
  category?: Category;
  /** List of photo URLs */
  photoUrls?: string[];
  /** List of tags */
  tags?: Tag[];
  /** Pet status in the store */
  status?: 'available' | 'pending' | 'sold';
}

export interface UpdatePet {
  /** Name of the pet */
  name?: string;
  category?: Category;
  /** List of photo URLs */
  photoUrls?: string[];
  /** List of tags */
  tags?: Tag[];
  /** Pet status in the store */
  status?: 'available' | 'pending' | 'sold';
}

export type Pets = Pet[];

export interface Category {
  /** Category ID */
  id?: number;
  /** Category name */
  name?: string;
}

export interface Tag {
  /** Tag ID */
  id?: number;
  /** Tag name */
  name?: string;
}

// ============================================================================
// User Related Types
// ============================================================================

export interface User {
  /** User ID */
  id: number;
  /** User name */
  username: string;
  /** First name */
  firstName?: string;
  /** Last name */
  lastName?: string;
  /** User email */
  email: string;
  /** User phone number */
  phone?: string;
  /** User Status */
  userStatus?: 0 | 1 | 2;
  /** When the user was created */
  createdAt?: string;
  /** When the user was last updated */
  updatedAt?: string;
}

export interface NewUser {
  /** User name */
  username: string;
  /** First name */
  firstName?: string;
  /** Last name */
  lastName?: string;
  /** User email */
  email: string;
  /** User phone number */
  phone?: string;
  /** User Status */
  userStatus?: 0 | 1 | 2;
}

export interface UserList {
  users?: User[];
  pagination?: Pagination;
}

export interface Pagination {
  /** Current page number */
  page?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Total number of items */
  total?: number;
  /** Total number of pages */
  totalPages?: number;
}

// ============================================================================
// Common Types
// ============================================================================

export interface Error {
  /** Error code */
  code: number;
  /** Error message */
  message: string;
  /** Additional error details */
  details?: string;
}