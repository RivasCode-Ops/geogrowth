import Dexie, { type Table } from 'dexie';
import { DB_SCHEMA_V1, DB_VERSION, type CompanyRecord, type StoreRecord } from '@/core/db/schema';

export function nowIso(): string {
  return new Date().toISOString();
}

export class GeoGrowthDB extends Dexie {
  stores!: Table<StoreRecord, string>;
  companies!: Table<CompanyRecord, string>;

  constructor() {
    super('GeoGrowthDB');
    this.version(DB_VERSION).stores(DB_SCHEMA_V1);
  }
}

export const db = new GeoGrowthDB();
