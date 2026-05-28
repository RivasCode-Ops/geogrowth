import { companiesRepository } from '@/features/companies/repository/companies.repository';
import { crmRepository } from '@/features/crm/repository/crm.repository';
import type { AnalyticsSummary, DealsByStage } from '@/features/analytics/types/analytics';
import { DEAL_STAGES } from '@/features/crm/types/stage';
import { visitsRepository } from '@/features/visits/repository/visits.repository';

export class AnalyticsStoreRequiredError extends Error {
  constructor() {
    super('Cadastre uma loja ativa para ver analytics.');
    this.name = 'AnalyticsStoreRequiredError';
  }
}

function emptyDealsByStage(): DealsByStage {
  return DEAL_STAGES.reduce(
    (acc, stage) => {
      acc[stage] = 0;
      return acc;
    },
    {} as DealsByStage,
  );
}

function isInCurrentMonth(iso: string, reference: Date): boolean {
  const date = new Date(iso);
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth()
  );
}

export const analyticsService = {
  async getSummary(storeId: string, tenantId: string): Promise<AnalyticsSummary> {
    if (!storeId || !tenantId) {
      throw new AnalyticsStoreRequiredError();
    }

    const [companies, deals, visits] = await Promise.all([
      companiesRepository.listByStore(storeId),
      crmRepository.listByStore(storeId),
      visitsRepository.listByStore(storeId),
    ]);

    const dealsByStage = emptyDealsByStage();
    for (const deal of deals) {
      dealsByStage[deal.stage] += 1;
    }

    const now = new Date();
    const visitsThisMonth = visits.filter((v) => isInCurrentMonth(v.scheduledAt, now)).length;

    return {
      companiesTotal: companies.length,
      dealsByStage,
      visitsThisMonth,
    };
  },
};
