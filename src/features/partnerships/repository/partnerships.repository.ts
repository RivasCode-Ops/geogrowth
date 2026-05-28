import { db } from '@/core/db';
import type { Partnership } from '@/features/partnerships/types/partnership';

export const partnershipsRepository = {
  async getById(id: string): Promise<Partnership | undefined> {
    return db.partnerships.get(id);
  },

  async listByStore(storeId: string): Promise<Partnership[]> {
    const rows = await db.partnerships.where('storeId').equals(storeId).toArray();
    return rows.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  },

  async create(partnership: Partnership): Promise<void> {
    await db.partnerships.add(partnership);
  },

  async update(partnership: Partnership): Promise<void> {
    await db.partnerships.put(partnership);
  },

  async delete(id: string): Promise<void> {
    await db.partnerships.delete(id);
  },
};
