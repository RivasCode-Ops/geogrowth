import { db } from '@/core/db';
import type { BackupPayload } from '@/core/backup/exportBackup';
import { needsSync } from '@/core/sync/sync-status';
import type { SyncSummary } from '@/core/sync/types';
import type { BaseEntity } from '@/core/types/base.entity';

function countNeedsSync<T extends BaseEntity>(items: T[], storeId: string): number {
  return items.filter((row) => row.storeId === storeId && needsSync(row.syncStatus)).length;
}

export async function countPending(storeId: string): Promise<SyncSummary> {
  const [stores, companies, territories, deals, visits, partnerships] = await Promise.all([
    db.stores.toArray(),
    db.companies.toArray(),
    db.territories.toArray(),
    db.deals.toArray(),
    db.visits.toArray(),
    db.partnerships.toArray(),
  ]);

  const byTable = {
    stores: stores.filter((row) => needsSync(row.syncStatus)).length,
    companies: countNeedsSync(companies, storeId),
    territories: countNeedsSync(territories, storeId),
    deals: countNeedsSync(deals, storeId),
    visits: countNeedsSync(visits, storeId),
    partnerships: countNeedsSync(partnerships, storeId),
  };

  const total = Object.values(byTable).reduce((sum, n) => sum + n, 0);

  return { total, byTable };
}

export async function collectPendingData(storeId: string): Promise<BackupPayload['data']> {
  const [stores, companies, territories, deals, visits, partnerships] = await Promise.all([
    db.stores.filter((row) => needsSync(row.syncStatus)).toArray(),
    db.companies
      .where('storeId')
      .equals(storeId)
      .filter((row) => needsSync(row.syncStatus))
      .toArray(),
    db.territories
      .where('storeId')
      .equals(storeId)
      .filter((row) => needsSync(row.syncStatus))
      .toArray(),
    db.deals
      .where('storeId')
      .equals(storeId)
      .filter((row) => needsSync(row.syncStatus))
      .toArray(),
    db.visits
      .where('storeId')
      .equals(storeId)
      .filter((row) => needsSync(row.syncStatus))
      .toArray(),
    db.partnerships
      .where('storeId')
      .equals(storeId)
      .filter((row) => needsSync(row.syncStatus))
      .toArray(),
  ]);

  return { stores, companies, territories, deals, visits, partnerships };
}

export async function markStoreScopeSynced(storeId: string): Promise<void> {
  await db.transaction(
    'rw',
    [db.stores, db.companies, db.territories, db.deals, db.visits, db.partnerships],
    async () => {
      const storeRows = await db.stores.toArray();
      await Promise.all(
        storeRows
          .filter((row) => needsSync(row.syncStatus))
          .map((row) => db.stores.update(row.id, { syncStatus: 'synced' })),
      );

      const tables = [
        db.companies,
        db.territories,
        db.deals,
        db.visits,
        db.partnerships,
      ] as const;

      for (const table of tables) {
        const rows = await table
          .where('storeId')
          .equals(storeId)
          .filter((row) => needsSync(row.syncStatus))
          .toArray();
        await Promise.all(
          rows.map((row) => table.update(row.id, { syncStatus: 'synced' as const })),
        );
      }
    },
  );
}

export async function markStoreScopeError(storeId: string): Promise<void> {
  const tables = [
    db.companies,
    db.territories,
    db.deals,
    db.visits,
    db.partnerships,
  ] as const;

  await db.transaction('rw', [...tables, db.stores], async () => {
    const storeRows = await db.stores.filter((row) => needsSync(row.syncStatus)).toArray();
    await Promise.all(
      storeRows.map((row) => db.stores.update(row.id, { syncStatus: 'error' })),
    );

    for (const table of tables) {
      const rows = await table
        .where('storeId')
        .equals(storeId)
        .filter((row) => needsSync(row.syncStatus))
        .toArray();
      await Promise.all(
        rows.map((row) => table.update(row.id, { syncStatus: 'error' as const })),
      );
    }
  });
}
