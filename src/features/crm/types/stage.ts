import type { DealStage } from '@/core/db/schema';

export type { DealStage };

export const DEAL_STAGES: readonly DealStage[] = [
  'lead',
  'negociacao',
  'ganho',
  'perdido',
] as const;

export const DEAL_STAGE_LABELS: Record<DealStage, string> = {
  lead: 'Lead',
  negociacao: 'Negociação',
  ganho: 'Ganho',
  perdido: 'Perdido',
};
