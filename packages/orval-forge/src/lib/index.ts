// Main OrvalForge package - re-exports all core functionality

// Core functionality
export { OrvalForgeGenerator, generateCustomTemplates, generateUtilityTemplates } from '@orval-forge/core';

// HTTP Clients
export { MyRequest } from '@orval-forge/my-request';
export { MyMiniRequest } from '@orval-forge/my-mini-request';

// Types
export type * from '@orval-forge/types';

// Factory function for creating HTTP clients
export { createHttpClient } from './factory';

// Legacy compatibility - generateApi function
export { generateApi } from './legacy';