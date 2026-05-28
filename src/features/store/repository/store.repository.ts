import { db } from '@/core/db';
import type { Store } from '@/features/store/types/store';

export const storeRepository = {
  async getById(id: string): Promise<Store | undefined> {
    return db.stores.get(id);
  },

  async list(): Promise<Store[]> {
    return db.stores.orderBy('updatedAt').reverse().toArray();
  },

  async create(store: Store): Promise<void> {
    await db.stores.add(store);
  },

  async update(store: Store): Promise<void> {
    await db.stores.put(store);
  },
};
