import { nowIso } from '@/core/db';
import { storeRepository } from '@/features/store/repository/store.repository';
import type { SaveStoreInput, Store } from '@/features/store/types/store';

export class StoreValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StoreValidationError';
  }
}

function trimRequired(value: string, field: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new StoreValidationError(`${field} é obrigatório.`);
  }
  return trimmed;
}

export const storeService = {
  async getActiveStore(): Promise<Store | null> {
    const stores = await storeRepository.list();
    return stores[0] ?? null;
  },

  async saveStore(input: SaveStoreInput): Promise<Store> {
    const name = trimRequired(input.name, 'Nome');
    const tenantId = trimRequired(input.tenantId, 'Tenant ID');
    const storeId = trimRequired(input.storeId, 'Store ID');
    const updatedAt = nowIso();

    if (input.id) {
      const existing = await storeRepository.getById(input.id);
      if (!existing) {
        throw new StoreValidationError('Loja não encontrada.');
      }
      const updated: Store = {
        ...existing,
        name,
        tenantId,
        storeId,
        updatedAt,
        syncStatus: 'local',
      };
      await storeRepository.update(updated);
      return updated;
    }

    const created: Store = {
      id: crypto.randomUUID(),
      name,
      tenantId,
      storeId,
      updatedAt,
      syncStatus: 'local',
    };
    await storeRepository.create(created);
    return created;
  },
};
