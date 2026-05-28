import type { DealStage } from '@/core/db/schema';

export type DealsByStage = Record<DealStage, number>;

export type AnalyticsSummary = {
  companiesTotal: number;
  dealsByStage: DealsByStage;
  visitsThisMonth: number;
};
