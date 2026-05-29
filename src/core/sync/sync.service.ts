import { db } from '@/core/db';
import { DB_VERSION } from '@/core/db/schema';
import { nowIso } from '@/core/utils/timestamps';
import { createSyncAdapter } from '@/core/sync/create-sync-adapter';
import {
  collectPendingData,
  countPending,
  markStoreScopeError,
  markStoreScopeSynced,
} from '@/core/sync/sync-queue.repository';
import type { SyncPushPayload, SyncSummary } from '@/core/sync/types';
import { SyncError } from '@/core/sync/types';
export type SyncRunResult = {
  summary: SyncSummary;
  message: string;
  pushedAt: string;
};

async function buildPushPayload(
  tenantId: string,
  storeId: string,
  summary: SyncSummary,
): Promise<SyncPushPayload> {
  const data = await collectPendingData(storeId);
  return {
    app: 'geogrowth',
    dbVersion: DB_VERSION,
    exportedAt: nowIso(),
    tenantId,
    storeId,
    pendingTotal: summary.total,
    data,
  };
}

export const syncService = {
  async getActiveStoreScope(): Promise<{ tenantId: string; storeId: string }> {
    const stores = await db.stores.toArray();
    const active = stores[0];
    if (!active) {
      throw new SyncError('Cadastre uma loja em Loja antes de sincronizar.');
    }
    return { tenantId: active.tenantId, storeId: active.storeId };
  },

  async getPendingSummary(storeId: string): Promise<SyncSummary> {
    return countPending(storeId);
  },

  async pushActiveStore(): Promise<SyncRunResult> {
    const { tenantId, storeId } = await this.getActiveStoreScope();
    const summary = await countPending(storeId);

    if (summary.total === 0) {
      return {
        summary,
        message: 'Nada pendente para enviar.',
        pushedAt: nowIso(),
      };
    }

    const payload = await buildPushPayload(tenantId, storeId, summary);
    const adapter = createSyncAdapter();

    try {
      const result = await adapter.push(payload);
      await markStoreScopeSynced(storeId);
      return {
        summary: { ...summary, total: 0, byTable: { stores: 0, companies: 0, territories: 0, deals: 0, visits: 0, partnerships: 0 } },
        message: result.message,
        pushedAt: result.pushedAt,
      };
    } catch (err) {
      await markStoreScopeError(storeId);
      throw err;
    }
  },
};
