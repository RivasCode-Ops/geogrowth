import { db } from '@/core/db';
import type { Company } from '@/features/companies/types/company';

export const companiesRepository = {
  async getById(id: string): Promise<Company | undefined> {
    return db.companies.get(id);
  },

  async listByStore(storeId: string): Promise<Company[]> {
    const rows = await db.companies.where('storeId').equals(storeId).toArray();
    return rows.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  },

  async create(company: Company): Promise<void> {
    await db.companies.add(company);
  },

  async update(company: Company): Promise<void> {
    await db.companies.put(company);
  },

  async delete(id: string): Promise<void> {
    await db.companies.delete(id);
  },
};
