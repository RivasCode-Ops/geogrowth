import type { StoreRecord } from '@/core/db/schema';

export type Store = StoreRecord;

export type SaveStoreInput = {
  id?: string;
  name: string;
  tenantId: string;
  storeId: string;
};
