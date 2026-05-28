import { companiesRepository } from '@/features/companies/repository/companies.repository';

export class CompanyScopeError extends Error {
  constructor(message = 'Empresa inválida ou não pertence à loja ativa.') {
    super(message);
    this.name = 'CompanyScopeError';
  }
}

/** Valida FK de empresa e retorna o nome para exibição. */
export async function resolveCompanyNameForStore(
  companyId: string,
  storeId: string,
): Promise<string> {
  const trimmed = companyId.trim();
  if (!trimmed) {
    throw new CompanyScopeError();
  }
  const company = await companiesRepository.getById(trimmed);
  if (!company || company.storeId !== storeId) {
    throw new CompanyScopeError();
  }
  return company.name;
}
