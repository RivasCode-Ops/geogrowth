import { db } from '@/core/db';
import { nowIso } from '@/core/utils/timestamps';
import { DB_VERSION } from '@/core/db/schema';

export type BackupPayload = {
  app: 'geogrowth';
  dbVersion: number;
  exportedAt: string;
  data: {
    stores: Awaited<ReturnType<typeof db.stores.toArray>>;
    companies: Awaited<ReturnType<typeof db.companies.toArray>>;
    territories: Awaited<ReturnType<typeof db.territories.toArray>>;
    deals: Awaited<ReturnType<typeof db.deals.toArray>>;
    visits: Awaited<ReturnType<typeof db.visits.toArray>>;
    partnerships: Awaited<ReturnType<typeof db.partnerships.toArray>>;
  };
};

export async function buildBackupPayload(): Promise<BackupPayload> {
  const [stores, companies, territories, deals, visits, partnerships] = await Promise.all([
    db.stores.toArray(),
    db.companies.toArray(),
    db.territories.toArray(),
    db.deals.toArray(),
    db.visits.toArray(),
    db.partnerships.toArray(),
  ]);

  return {
    app: 'geogrowth',
    dbVersion: DB_VERSION,
    exportedAt: nowIso(),
    data: { stores, companies, territories, deals, visits, partnerships },
  };
}

export async function exportBackup(): Promise<void> {
  const payload = await buildBackupPayload();
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const date = payload.exportedAt.slice(0, 10);
  anchor.href = url;
  anchor.download = `geogrowth-backup-${date}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
