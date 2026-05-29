import { nowIso } from '@/core/utils/timestamps';
import { companiesRepository } from '@/features/companies/repository/companies.repository';
import type { Company } from '@/features/companies/types/company';
import {
  CompanyScopeError,
  resolveCompanyNameForStore,
} from '@/shared/services/companyScope';
import { crmRepository } from '@/features/crm/repository/crm.repository';
import type { Deal, DealWithCompany, SaveDealInput } from '@/features/crm/types/deal';
import type { DealsFilterStage } from '@/features/crm/types/deal';
import { DEAL_STAGES } from '@/features/crm/types/stage';

export class CrmValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CrmValidationError';
  }
}

export class CrmStoreRequiredError extends Error {
  constructor() {
    super('Cadastre uma loja ativa antes de usar o CRM.');
    this.name = 'CrmStoreRequiredError';
  }
}

function trimRequired(value: string, field: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new CrmValidationError(`${field} é obrigatório.`);
  }
  return trimmed;
}

async function assertCompanyBelongsToStore(
  companyId: string,
  storeId: string,
): Promise<string> {
  try {
    return await resolveCompanyNameForStore(companyId, storeId);
  } catch (error) {
    if (error instanceof CompanyScopeError) {
      throw new CrmValidationError(error.message);
    }
    throw error;
  }
}

export const crmService = {
  async listCompanies(storeId: string): Promise<Company[]> {
    if (!storeId) {
      throw new CrmStoreRequiredError();
    }
    return companiesRepository.listByStore(storeId);
  },

  async list(
    storeId: string,
    tenantId: string,
    stageFilter: DealsFilterStage,
  ): Promise<DealWithCompany[]> {
    if (!storeId || !tenantId) {
      throw new CrmStoreRequiredError();
    }
    const deals = await crmRepository.listByStore(storeId);
    const filtered =
      stageFilter === 'all' ? deals : deals.filter((d) => d.stage === stageFilter);

    const withCompany: DealWithCompany[] = [];
    for (const deal of filtered) {
      const company = await companiesRepository.getById(deal.companyId);
      withCompany.push({
        ...deal,
        companyName: company?.name ?? '(empresa removida)',
      });
    }
    return withCompany;
  },

  async create(
    storeId: string,
    tenantId: string,
    input: SaveDealInput,
  ): Promise<DealWithCompany> {
    if (!storeId || !tenantId) {
      throw new CrmStoreRequiredError();
    }
    const title = trimRequired(input.title, 'Título');
    if (!DEAL_STAGES.includes(input.stage)) {
      throw new CrmValidationError('Estágio inválido.');
    }
    const companyName = await assertCompanyBelongsToStore(input.companyId, storeId);
    const deal: Deal = {
      id: crypto.randomUUID(),
      companyId: input.companyId,
      title,
      stage: input.stage,
      value: Math.max(0, input.value),
      notes: input.notes.trim(),
      storeId,
      tenantId,
      updatedAt: nowIso(),
      syncStatus: 'pending',
    };
    await crmRepository.create(deal);
    return { ...deal, companyName };
  },

  async update(storeId: string, input: SaveDealInput): Promise<DealWithCompany> {
    if (!storeId) {
      throw new CrmStoreRequiredError();
    }
    if (!input.id) {
      throw new CrmValidationError('ID da oportunidade é obrigatório para edição.');
    }
    const existing = await crmRepository.getById(input.id);
    if (!existing || existing.storeId !== storeId) {
      throw new CrmValidationError('Oportunidade não encontrada.');
    }
    const title = trimRequired(input.title, 'Título');
    if (!DEAL_STAGES.includes(input.stage)) {
      throw new CrmValidationError('Estágio inválido.');
    }
    const companyName = await assertCompanyBelongsToStore(input.companyId, storeId);
    const updated: Deal = {
      ...existing,
      companyId: input.companyId,
      title,
      stage: input.stage,
      value: Math.max(0, input.value),
      notes: input.notes.trim(),
      updatedAt: nowIso(),
      syncStatus: 'pending',
    };
    await crmRepository.update(updated);
    return { ...updated, companyName };
  },

  async delete(storeId: string, id: string): Promise<void> {
    if (!storeId) {
      throw new CrmStoreRequiredError();
    }
    const existing = await crmRepository.getById(id);
    if (!existing || existing.storeId !== storeId) {
      throw new CrmValidationError('Oportunidade não encontrada.');
    }
    await crmRepository.delete(id);
  },
};
