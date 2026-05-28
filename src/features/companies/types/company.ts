import type { CompanyRecord, CompanyStatus } from '@/core/db/schema';

export type Company = CompanyRecord;

export type { CompanyStatus };

export const COMPANY_STATUSES: readonly CompanyStatus[] = [
  'lead',
  'active',
  'inactive',
] as const;

export const COMPANY_STATUS_LABELS: Record<CompanyStatus, string> = {
  lead: 'Lead',
  active: 'Ativa',
  inactive: 'Inativa',
};

export type CompaniesFilters = {
  name: string;
  status: CompanyStatus | 'all';
  tag: string;
};

export const defaultCompaniesFilters: CompaniesFilters = {
  name: '',
  status: 'all',
  tag: '',
};

export type SaveCompanyInput = {
  id?: string;
  name: string;
  status: CompanyStatus;
  tag: string;
};
