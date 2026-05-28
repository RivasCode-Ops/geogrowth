import { nowIso } from '@/core/db';
import { companiesRepository } from '@/features/companies/repository/companies.repository';
import type { Company } from '@/features/companies/types/company';
import { partnershipsRepository } from '@/features/partnerships/repository/partnerships.repository';
import type {
  Partnership,
  PartnershipWithCompany,
  PartnershipsFilterType,
  SavePartnershipInput,
} from '@/features/partnerships/types/partnership';
import { PARTNERSHIP_TYPES } from '@/features/partnerships/types/partnership';

export class PartnershipValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PartnershipValidationError';
  }
}

export class PartnershipStoreRequiredError extends Error {
  constructor() {
    super('Cadastre uma loja ativa antes de gerenciar parcerias.');
    this.name = 'PartnershipStoreRequiredError';
  }
}

function trimRequired(value: string, field: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new PartnershipValidationError(`${field} é obrigatório.`);
  }
  return trimmed;
}

function parseDateOnly(value: string, field: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new PartnershipValidationError(`${field} inválida.`);
  }
  return date.toISOString().slice(0, 10);
}

function validateVigencia(validFrom: string, validTo: string): { validFrom: string; validTo: string } {
  const from = parseDateOnly(validFrom, 'Início da vigência');
  const to = parseDateOnly(validTo, 'Fim da vigência');
  if (from > to) {
    throw new PartnershipValidationError('Fim da vigência deve ser igual ou posterior ao início.');
  }
  return { validFrom: from, validTo: to };
}

async function resolveCompanyName(
  companyId: string,
  storeId: string,
): Promise<string | null> {
  if (!companyId) {
    return null;
  }
  const company = await companiesRepository.getById(companyId);
  if (!company || company.storeId !== storeId) {
    throw new PartnershipValidationError('Empresa inválida ou não pertence à loja ativa.');
  }
  return company.name;
}

async function enrichPartnership(partnership: Partnership): Promise<PartnershipWithCompany> {
  if (!partnership.companyId) {
    return { ...partnership, companyName: null };
  }
  const company = await companiesRepository.getById(partnership.companyId);
  return {
    ...partnership,
    companyName: company?.name ?? '(empresa removida)',
  };
}

export const partnershipsService = {
  async listCompanies(storeId: string): Promise<Company[]> {
    if (!storeId) {
      throw new PartnershipStoreRequiredError();
    }
    return companiesRepository.listByStore(storeId);
  },

  async list(
    storeId: string,
    tenantId: string,
    typeFilter: PartnershipsFilterType,
  ): Promise<PartnershipWithCompany[]> {
    if (!storeId || !tenantId) {
      throw new PartnershipStoreRequiredError();
    }
    const rows = await partnershipsRepository.listByStore(storeId);
    const filtered =
      typeFilter === 'all' ? rows : rows.filter((p) => p.type === typeFilter);

    return Promise.all(filtered.map((p) => enrichPartnership(p)));
  },

  async create(
    storeId: string,
    tenantId: string,
    input: SavePartnershipInput,
  ): Promise<PartnershipWithCompany> {
    if (!storeId || !tenantId) {
      throw new PartnershipStoreRequiredError();
    }
    const partnerName = trimRequired(input.partnerName, 'Nome do parceiro');
    if (!PARTNERSHIP_TYPES.includes(input.type)) {
      throw new PartnershipValidationError('Tipo inválido.');
    }
    const vigencia = validateVigencia(input.validFrom, input.validTo);
    const companyId = input.companyId.trim();
    await resolveCompanyName(companyId, storeId);

    const partnership: Partnership = {
      id: crypto.randomUUID(),
      partnerName,
      type: input.type,
      validFrom: vigencia.validFrom,
      validTo: vigencia.validTo,
      companyId,
      storeId,
      tenantId,
      updatedAt: nowIso(),
      syncStatus: 'local',
    };
    await partnershipsRepository.create(partnership);
    return enrichPartnership(partnership);
  },

  async update(storeId: string, input: SavePartnershipInput): Promise<PartnershipWithCompany> {
    if (!storeId) {
      throw new PartnershipStoreRequiredError();
    }
    if (!input.id) {
      throw new PartnershipValidationError('ID da parceria é obrigatório para edição.');
    }
    const existing = await partnershipsRepository.getById(input.id);
    if (!existing || existing.storeId !== storeId) {
      throw new PartnershipValidationError('Parceria não encontrada.');
    }
    const partnerName = trimRequired(input.partnerName, 'Nome do parceiro');
    if (!PARTNERSHIP_TYPES.includes(input.type)) {
      throw new PartnershipValidationError('Tipo inválido.');
    }
    const vigencia = validateVigencia(input.validFrom, input.validTo);
    const companyId = input.companyId.trim();
    await resolveCompanyName(companyId, storeId);

    const updated: Partnership = {
      ...existing,
      partnerName,
      type: input.type,
      validFrom: vigencia.validFrom,
      validTo: vigencia.validTo,
      companyId,
      updatedAt: nowIso(),
      syncStatus: 'local',
    };
    await partnershipsRepository.update(updated);
    return enrichPartnership(updated);
  },

  async delete(storeId: string, id: string): Promise<void> {
    if (!storeId) {
      throw new PartnershipStoreRequiredError();
    }
    const existing = await partnershipsRepository.getById(id);
    if (!existing || existing.storeId !== storeId) {
      throw new PartnershipValidationError('Parceria não encontrada.');
    }
    await partnershipsRepository.delete(id);
  },
};
