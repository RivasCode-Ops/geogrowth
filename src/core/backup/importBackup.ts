import { db } from '@/core/db';
import type {
  CompanyRecord,
  DealRecord,
  PartnershipRecord,
  StoreRecord,
  TerritoryRecord,
  VisitRecord,
} from '@/core/db/schema';
import { DB_VERSION } from '@/core/db/schema';
import type { BackupPayload } from '@/core/backup/exportBackup';

export class BackupImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BackupImportError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isBackupPayload(value: unknown): value is BackupPayload {
  if (!isRecord(value)) {
    return false;
  }
  if (value.app !== 'geogrowth' || typeof value.dbVersion !== 'number') {
    return false;
  }
  if (!isRecord(value.data)) {
    return false;
  }
  const { data } = value;
  return (
    Array.isArray(data.stores) &&
    Array.isArray(data.companies) &&
    Array.isArray(data.territories) &&
    Array.isArray(data.deals) &&
    Array.isArray(data.visits) &&
    Array.isArray(data.partnerships)
  );
}

export async function importBackupFromFile(file: File): Promise<void> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(await file.text()) as unknown;
  } catch {
    throw new BackupImportError('Arquivo JSON inválido.');
  }

  if (!isBackupPayload(parsed)) {
    throw new BackupImportError('Backup não reconhecido (esperado app "geogrowth").');
  }

  const payload: BackupPayload = parsed;

  if (payload.dbVersion > DB_VERSION) {
    throw new BackupImportError(
      `Backup exige DB v${payload.dbVersion}; este app suporta até v${DB_VERSION}.`,
    );
  }

  await db.transaction(
    'rw',
    [
      db.stores,
      db.companies,
      db.territories,
      db.deals,
      db.visits,
      db.partnerships,
    ],
    async () => {
      await Promise.all([
        db.stores.clear(),
        db.companies.clear(),
        db.territories.clear(),
        db.deals.clear(),
        db.visits.clear(),
        db.partnerships.clear(),
      ]);

      const stores = payload.data.stores as StoreRecord[];
      const companies = payload.data.companies as CompanyRecord[];
      const territories = payload.data.territories as TerritoryRecord[];
      const deals = payload.data.deals as DealRecord[];
      const visits = payload.data.visits as VisitRecord[];
      const partnerships = payload.data.partnerships as PartnershipRecord[];

      await Promise.all([
        stores.length ? db.stores.bulkAdd(stores) : Promise.resolve(),
        companies.length ? db.companies.bulkAdd(companies) : Promise.resolve(),
        territories.length ? db.territories.bulkAdd(territories) : Promise.resolve(),
        deals.length ? db.deals.bulkAdd(deals) : Promise.resolve(),
        visits.length ? db.visits.bulkAdd(visits) : Promise.resolve(),
        partnerships.length ? db.partnerships.bulkAdd(partnerships) : Promise.resolve(),
      ]);
    },
  );
}
