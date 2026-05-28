import type { VisitRecord, VisitStatus } from '@/core/db/schema';

export type Visit = VisitRecord;

export type { VisitStatus };

export const VISIT_STATUSES: readonly VisitStatus[] = ['planned', 'done', 'cancelled'] as const;

export const VISIT_STATUS_LABELS: Record<VisitStatus, string> = {
  planned: 'Planejada',
  done: 'Realizada',
  cancelled: 'Cancelada',
};

export type VisitWithCompany = Visit & {
  companyName: string;
};

export type SaveVisitInput = {
  id?: string;
  companyId: string;
  scheduledAt: string;
  status: VisitStatus;
  notes: string;
};

export type VisitsFilterStatus = VisitStatus | 'all';
