import { db } from '@/core/db';
import type { Territory } from '@/features/territory/types/territory';

export const territoryRepository = {
  async getById(id: string): Promise<Territory | undefined> {
    return db.territories.get(id);
  },

  async listByStore(storeId: string): Promise<Territory[]> {
    const rows = await db.territories.where('storeId').equals(storeId).toArray();
    return rows.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  },

  async create(territory: Territory): Promise<void> {
    await db.territories.add(territory);
  },

  async update(territory: Territory): Promise<void> {
    await db.territories.put(territory);
  },

  async delete(id: string): Promise<void> {
    await db.territories.delete(id);
  },
};
