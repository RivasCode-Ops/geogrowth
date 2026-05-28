import { nowIso } from '@/core/utils/timestamps';
import { companiesRepository } from '@/features/companies/repository/companies.repository';
import type {
  CompaniesFilters,
  Company,
  SaveCompanyInput,
} from '@/features/companies/types/company';
import { COMPANY_STATUSES } from '@/features/companies/types/company';

export class CompanyValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CompanyValidationError';
  }
}

export class CompanyStoreRequiredError extends Error {
  constructor() {
    super('Cadastre uma loja ativa antes de gerenciar empresas.');
    this.name = 'CompanyStoreRequiredError';
  }
}

function trimRequired(value: string, field: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new CompanyValidationError(`${field} é obrigatório.`);
  }
  return trimmed;
}

function applyFilters(companies: Company[], filters: CompaniesFilters): Company[] {
  const nameQuery = filters.name.trim().toLowerCase();
  const tagQuery = filters.tag.trim().toLowerCase();

  return companies.filter((company) => {
    if (filters.status !== 'all' && company.status !== filters.status) {
      return false;
    }
    if (nameQuery && !company.name.toLowerCase().includes(nameQuery)) {
      return false;
    }
    if (tagQuery && !company.tag.toLowerCase().includes(tagQuery)) {
      return false;
    }
    return true;
  });
}

export const companiesService = {
  async list(
    storeId: string,
    tenantId: string,
    filters: CompaniesFilters,
  ): Promise<Company[]> {
    if (!storeId || !tenantId) {
      throw new CompanyStoreRequiredError();
    }
    const rows = await companiesRepository.listByStore(storeId);
    return applyFilters(rows, filters);
  },

  async create(
    storeId: string,
    tenantId: string,
    input: SaveCompanyInput,
  ): Promise<Company> {
    if (!storeId || !tenantId) {
      throw new CompanyStoreRequiredError();
    }
    const name = trimRequired(input.name, 'Nome');
    if (!COMPANY_STATUSES.includes(input.status)) {
      throw new CompanyValidationError('Status inválido.');
    }
    const company: Company = {
      id: crypto.randomUUID(),
      name,
      status: input.status,
      tag: input.tag.trim(),
      storeId,
      tenantId,
      updatedAt: nowIso(),
      syncStatus: 'local',
    };
    await companiesRepository.create(company);
    return company;
  },

  async update(
    storeId: string,
    input: SaveCompanyInput,
  ): Promise<Company> {
    if (!storeId) {
      throw new CompanyStoreRequiredError();
    }
    if (!input.id) {
      throw new CompanyValidationError('ID da empresa é obrigatório para edição.');
    }
    const existing = await companiesRepository.getById(input.id);
    if (!existing || existing.storeId !== storeId) {
      throw new CompanyValidationError('Empresa não encontrada.');
    }
    const name = trimRequired(input.name, 'Nome');
    if (!COMPANY_STATUSES.includes(input.status)) {
      throw new CompanyValidationError('Status inválido.');
    }
    const updated: Company = {
      ...existing,
      name,
      status: input.status,
      tag: input.tag.trim(),
      updatedAt: nowIso(),
      syncStatus: 'local',
    };
    await companiesRepository.update(updated);
    return updated;
  },

  async delete(storeId: string, id: string): Promise<void> {
    if (!storeId) {
      throw new CompanyStoreRequiredError();
    }
    const existing = await companiesRepository.getById(id);
    if (!existing || existing.storeId !== storeId) {
      throw new CompanyValidationError('Empresa não encontrada.');
    }
    await companiesRepository.delete(id);
  },
};
