import type { DealRecord } from '@/core/db/schema';
import type { DealStage } from '@/features/crm/types/stage';

export type Deal = DealRecord;

export type DealWithCompany = Deal & {
  companyName: string;
};

export type SaveDealInput = {
  id?: string;
  companyId: string;
  title: string;
  stage: DealStage;
  value: number;
  notes: string;
};

export type DealsFilterStage = DealStage | 'all';
