export { db, GeoGrowthDB } from '@/core/db/dexie.db';
export { nowIso } from '@/core/utils/timestamps';
export {
  DB_SCHEMA_V1,
  DB_SCHEMA_V2,
  DB_SCHEMA_V3,
  DB_SCHEMA_V4,
  DB_SCHEMA_V5,
  DB_SCHEMA_V6,
  DB_VERSION,
  type CompanyRecord,
  type CompanyStatus,
  type DealRecord,
  type DealStage,
  type PartnershipRecord,
  type PartnershipType,
  type StoreRecord,
  type TerritoryBounds,
  type TerritoryRecord,
  type VisitRecord,
  type VisitStatus,
} from '@/core/db/schema';
