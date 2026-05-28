import { db } from '@/core/db';
import type { Deal } from '@/features/crm/types/deal';

export const crmRepository = {
  async getById(id: string): Promise<Deal | undefined> {
    return db.deals.get(id);
  },

  async listByStore(storeId: string): Promise<Deal[]> {
    const rows = await db.deals.where('storeId').equals(storeId).toArray();
    return rows.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  },

  async create(deal: Deal): Promise<void> {
    await db.deals.add(deal);
  },

  async update(deal: Deal): Promise<void> {
    await db.deals.put(deal);
  },

  async delete(id: string): Promise<void> {
    await db.deals.delete(id);
  },
};
