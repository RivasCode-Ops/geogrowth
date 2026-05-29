import { nowIso } from '@/core/utils/timestamps';
import { companiesRepository } from '@/features/companies/repository/companies.repository';
import type { Company } from '@/features/companies/types/company';
import {
  CompanyScopeError,
  resolveCompanyNameForStore,
} from '@/shared/services/companyScope';
import { visitsRepository } from '@/features/visits/repository/visits.repository';
import type {
  SaveVisitInput,
  Visit,
  VisitWithCompany,
  VisitsFilterStatus,
} from '@/features/visits/types/visit';
import { VISIT_STATUSES } from '@/features/visits/types/visit';

export class VisitValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VisitValidationError';
  }
}

export class VisitStoreRequiredError extends Error {
  constructor() {
    super('Cadastre uma loja ativa antes de gerenciar visitas.');
    this.name = 'VisitStoreRequiredError';
  }
}

async function assertCompanyBelongsToStore(
  companyId: string,
  storeId: string,
): Promise<string> {
  try {
    return await resolveCompanyNameForStore(companyId, storeId);
  } catch (error) {
    if (error instanceof CompanyScopeError) {
      throw new VisitValidationError(error.message);
    }
    throw error;
  }
}

function validateScheduledAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new VisitValidationError('Data/hora inválida.');
  }
  return date.toISOString();
}

export const visitsService = {
  async listCompanies(storeId: string): Promise<Company[]> {
    if (!storeId) {
      throw new VisitStoreRequiredError();
    }
    return companiesRepository.listByStore(storeId);
  },

  async list(
    storeId: string,
    tenantId: string,
    statusFilter: VisitsFilterStatus,
  ): Promise<VisitWithCompany[]> {
    if (!storeId || !tenantId) {
      throw new VisitStoreRequiredError();
    }
    const visits = await visitsRepository.listByStore(storeId);
    const filtered =
      statusFilter === 'all' ? visits : visits.filter((v) => v.status === statusFilter);

    const result: VisitWithCompany[] = [];
    for (const visit of filtered) {
      const company = await companiesRepository.getById(visit.companyId);
      result.push({
        ...visit,
        companyName: company?.name ?? '(empresa removida)',
      });
    }
    return result;
  },

  async create(
    storeId: string,
    tenantId: string,
    input: SaveVisitInput,
  ): Promise<VisitWithCompany> {
    if (!storeId || !tenantId) {
      throw new VisitStoreRequiredError();
    }
    if (!VISIT_STATUSES.includes(input.status)) {
      throw new VisitValidationError('Status inválido.');
    }
    const companyName = await assertCompanyBelongsToStore(input.companyId, storeId);
    const visit: Visit = {
      id: crypto.randomUUID(),
      companyId: input.companyId,
      scheduledAt: validateScheduledAt(input.scheduledAt),
      status: input.status,
      notes: input.notes.trim(),
      storeId,
      tenantId,
      updatedAt: nowIso(),
      syncStatus: 'pending',
    };
    await visitsRepository.create(visit);
    return { ...visit, companyName };
  },

  async update(storeId: string, input: SaveVisitInput): Promise<VisitWithCompany> {
    if (!storeId) {
      throw new VisitStoreRequiredError();
    }
    if (!input.id) {
      throw new VisitValidationError('ID da visita é obrigatório para edição.');
    }
    const existing = await visitsRepository.getById(input.id);
    if (!existing || existing.storeId !== storeId) {
      throw new VisitValidationError('Visita não encontrada.');
    }
    if (!VISIT_STATUSES.includes(input.status)) {
      throw new VisitValidationError('Status inválido.');
    }
    const companyName = await assertCompanyBelongsToStore(input.companyId, storeId);
    const updated: Visit = {
      ...existing,
      companyId: input.companyId,
      scheduledAt: validateScheduledAt(input.scheduledAt),
      status: input.status,
      notes: input.notes.trim(),
      updatedAt: nowIso(),
      syncStatus: 'pending',
    };
    await visitsRepository.update(updated);
    return { ...updated, companyName };
  },

  async delete(storeId: string, id: string): Promise<void> {
    if (!storeId) {
      throw new VisitStoreRequiredError();
    }
    const existing = await visitsRepository.getById(id);
    if (!existing || existing.storeId !== storeId) {
      throw new VisitValidationError('Visita não encontrada.');
    }
    await visitsRepository.delete(id);
  },
};
