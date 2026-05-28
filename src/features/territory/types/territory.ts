import type { TerritoryBounds, TerritoryRecord } from '@/core/db/schema';

export type Territory = TerritoryRecord;

export type { TerritoryBounds };

export type SaveTerritoryInput = {
  id?: string;
  name: string;
  description: string;
  bounds: TerritoryBounds;
  color: string;
};

export const DEFAULT_TERRITORY_BOUNDS: TerritoryBounds = {
  south: -16.0,
  north: -15.5,
  west: -48.2,
  east: -47.5,
};

export const TERRITORY_COLORS = [
  '#0d9488',
  '#2563eb',
  '#7c3aed',
  '#db2777',
  '#ea580c',
] as const;
