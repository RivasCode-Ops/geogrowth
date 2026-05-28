import Dexie, { type Table } from 'dexie';
import {
  DB_SCHEMA_V1,
  DB_SCHEMA_V2,
  DB_SCHEMA_V3,
  DB_SCHEMA_V4,
  DB_SCHEMA_V5,
  DB_SCHEMA_V6,
  DB_VERSION,
  type CompanyRecord,
  type DealRecord,
  type PartnershipRecord,
  type StoreRecord,
  type TerritoryRecord,
  type VisitRecord,
} from '@/core/db/schema';

export { nowIso } from '@/core/utils/timestamps';

export class GeoGrowthDB extends Dexie {
  stores!: Table<StoreRecord, string>;
  companies!: Table<CompanyRecord, string>;
  territories!: Table<TerritoryRecord, string>;
  deals!: Table<DealRecord, string>;
  visits!: Table<VisitRecord, string>;
  partnerships!: Table<PartnershipRecord, string>;

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
    this.version(3).stores(DB_SCHEMA_V3);
    this.version(4).stores(DB_SCHEMA_V4);
    this.version(5).stores(DB_SCHEMA_V5);
    this.version(DB_VERSION).stores(DB_SCHEMA_V6);
  }
}

export const db = new GeoGrowthDB();
