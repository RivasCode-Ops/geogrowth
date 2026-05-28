import type { SyncStatus } from '@/core/types/sync.types';

export interface BaseEntity {
  id: string;
  syncStatus: SyncStatus;
  updatedAt: string;
  tenantId: string;
  storeId: string;
}
