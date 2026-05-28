import type { PartnershipRecord, PartnershipType } from '@/core/db/schema';

export type Partnership = PartnershipRecord;

export type { PartnershipType };

export const PARTNERSHIP_TYPES: readonly PartnershipType[] = [
  'comercial',
  'tecnica',
  'marketing',
  'distribuicao',
  'outro',
] as const;

export const PARTNERSHIP_TYPE_LABELS: Record<PartnershipType, string> = {
  comercial: 'Comercial',
  tecnica: 'Técnica',
  marketing: 'Marketing',
  distribuicao: 'Distribuição',
  outro: 'Outro',
};

export type PartnershipWithCompany = Partnership & {
  companyName: string | null;
};

export type SavePartnershipInput = {
  id?: string;
  partnerName: string;
  type: PartnershipType;
  validFrom: string;
  validTo: string;
  companyId: string;
};

export type PartnershipsFilterType = PartnershipType | 'all';
