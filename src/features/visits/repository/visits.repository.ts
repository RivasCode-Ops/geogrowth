import { db } from '@/core/db';
import type { Visit } from '@/features/visits/types/visit';

export const visitsRepository = {
  async getById(id: string): Promise<Visit | undefined> {
    return db.visits.get(id);
  },

  async listByStore(storeId: string): Promise<Visit[]> {
    const rows = await db.visits.where('storeId').equals(storeId).toArray();
    return rows.sort(
      (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    );
  },

  async create(visit: Visit): Promise<void> {
    await db.visits.add(visit);
  },

  async update(visit: Visit): Promise<void> {
    await db.visits.put(visit);
  },

  async delete(id: string): Promise<void> {
    await db.visits.delete(id);
  },
};
