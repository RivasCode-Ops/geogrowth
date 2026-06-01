import type { BackupPayload } from '@/core/backup/exportBackup';
import { db } from '@/core/db';
import type {
  CompanyRecord,
  DealRecord,
  PartnershipRecord,
  StoreRecord,
  TerritoryRecord,
  VisitRecord,
} from '@/core/db/schema';
import type { SyncPushPayload } from '@/core/sync/types';
import type { BaseEntity } from '@/core/types/base.entity';

function mergeRecordsById<T extends BaseEntity>(base: T[], incoming: T[]): T[] {
  const map = new Map(base.map((row) => [row.id, row]));
  for (const row of incoming) {
    const previous = map.get(row.id);
    if (!previous || previous.updatedAt <= row.updatedAt) {
      map.set(row.id, { ...row, syncStatus: 'synced' as const });
    }
  }
  return [...map.values()];
}

export type MergePullResult = {
  mergedCount: number;
};

export async function mergePullPayload(
  payload: SyncPushPayload,
  storeId: string,
): Promise<MergePullResult> {
  const data = payload.data;
  let mergedCount = 0;

  await db.transaction(
    'rw',
    [db.stores, db.companies, db.territories, db.deals, db.visits, db.partnerships],
    async () => {
      const localStores = await db.stores.toArray();
      const incomingStores = (data.stores as StoreRecord[]).filter(
        (row) => row.storeId === storeId,
      );
      const mergedStores = mergeRecordsById(localStores, incomingStores);
      mergedCount += incomingStores.length;
      for (const store of mergedStores) {
        await db.stores.put(store);
      }

      const tables: Array<{
        table: typeof db.companies;
        incoming: BaseEntity[];
      }> = [
        { table: db.companies, incoming: data.companies as CompanyRecord[] },
        { table: db.territories, incoming: data.territories as TerritoryRecord[] },
        { table: db.deals, incoming: data.deals as DealRecord[] },
        { table: db.visits, incoming: data.visits as VisitRecord[] },
        { table: db.partnerships, incoming: data.partnerships as PartnershipRecord[] },
      ];

      for (const { table, incoming } of tables) {
        const scoped = incoming.filter((row) => row.storeId === storeId);
        if (scoped.length === 0) {
          continue;
        }

        const local = await table.where('storeId').equals(storeId).toArray();
        const merged = mergeRecordsById(local, scoped);
        mergedCount += scoped.length;
        for (const row of merged) {
          await table.put(row);
        }
      }
    },
  );

  return { mergedCount };
}

export function isSyncPushPayload(value: unknown): value is SyncPushPayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    record.app === 'geogrowth' &&
    typeof record.tenantId === 'string' &&
    typeof record.storeId === 'string' &&
    typeof record.data === 'object' &&
    record.data !== null
  );
}

export type { BackupPayload };
