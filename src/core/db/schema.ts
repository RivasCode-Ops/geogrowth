import type { BaseEntity } from '@/core/types/base.entity';

/** Versão inicial do IndexedDB — incrementar ao alterar stores(). */
export const DB_VERSION = 1;

export interface StoreRecord extends BaseEntity {
  name: string;
}

export interface CompanyRecord extends BaseEntity {
  name: string;
}

/**
 * Índices Dexie (versão 1):
 * - stores: id (PK), storeId, tenantId, updatedAt, syncStatus
 * - companies: id (PK), storeId, tenantId, updatedAt, syncStatus
 */
export const DB_SCHEMA_V1 = {
  stores: 'id, storeId, tenantId, updatedAt, syncStatus',
  companies: 'id, storeId, tenantId, updatedAt, syncStatus',
} as const;
