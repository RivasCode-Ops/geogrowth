import type { BaseEntity } from '@/core/types/base.entity';

/** Versão atual do IndexedDB — incrementar ao alterar stores(). */
export const DB_VERSION = 3;

export interface StoreRecord extends BaseEntity {
  name: string;
}

export type CompanyStatus = 'lead' | 'active' | 'inactive';

export interface CompanyRecord extends BaseEntity {
  name: string;
  status: CompanyStatus;
  tag: string;
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

/** v2: índice `status` em companies para filtros. */
export const DB_SCHEMA_V2 = {
  ...DB_SCHEMA_V1,
  companies: 'id, storeId, tenantId, updatedAt, syncStatus, status',
} as const;

export interface TerritoryBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface TerritoryRecord extends BaseEntity {
  name: string;
  description: string;
  bounds: TerritoryBounds;
  color: string;
}

/** v3: tabela territories (áreas por loja). */
export const DB_SCHEMA_V3 = {
  ...DB_SCHEMA_V2,
  territories: 'id, storeId, tenantId, updatedAt, syncStatus',
} as const;
