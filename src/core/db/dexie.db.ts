import Dexie, { type Table } from 'dexie';
import {
  DB_SCHEMA_V1,
  DB_SCHEMA_V2,
  DB_SCHEMA_V3,
  DB_VERSION,
  type CompanyRecord,
  type StoreRecord,
  type TerritoryRecord,
} from '@/core/db/schema';

export function nowIso(): string {
  return new Date().toISOString();
}

export class GeoGrowthDB extends Dexie {
  stores!: Table<StoreRecord, string>;
  companies!: Table<CompanyRecord, string>;
  territories!: Table<TerritoryRecord, string>;

  constructor() {
    super('GeoGrowthDB');
    this.version(1).stores(DB_SCHEMA_V1);
    this.version(2)
      .stores(DB_SCHEMA_V2)
      .upgrade(async (tx) => {
        const table = tx.table<CompanyRecord, string>('companies');
        const rows = await table.toArray();
        await Promise.all(
          rows.map((row) =>
            table.update(row.id, {
              status: row.status ?? 'lead',
              tag: row.tag ?? '',
            }),
          ),
        );
      });
    this.version(DB_VERSION).stores(DB_SCHEMA_V3);
  }
}

export const db = new GeoGrowthDB();
