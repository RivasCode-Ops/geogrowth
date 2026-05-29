import type { AnalyticsSummary } from '@/features/analytics/types/analytics';
import { DEAL_STAGES, DEAL_STAGE_LABELS } from '@/features/crm/types/stage';
import { Card } from '@/shared/components/Card';
import { KpiCard } from '@/shared/components/KpiCard';
import '@/features/analytics/components/analytics.css';

type SummaryCardsProps = {
  summary: AnalyticsSummary;
};

export function SummaryCards({ summary }: SummaryCardsProps) {
  const dealsTotal = DEAL_STAGES.reduce(
    (sum, stage) => sum + summary.dealsByStage[stage],
    0,
  );

  return (
    <>
      <div className="grid grid--kpis">
        <KpiCard label="Empresas" value={summary.companiesTotal} />
        <KpiCard label="Oportunidades (CRM)" value={dealsTotal} />
        <KpiCard label="Visitas no mês" value={summary.visitsThisMonth} />
      </div>

      <div className="section-spaced">
        <Card title="Oportunidades por estágio" flushTop>
        <ul className="analytics-stages__list">
          {DEAL_STAGES.map((stage) => (
            <li key={stage} className="analytics-stages__item">
              <span>{DEAL_STAGE_LABELS[stage]}</span>
              <strong>{summary.dealsByStage[stage]}</strong>
            </li>
          ))}
        </ul>
        </Card>
      </div>
    </>
  );
}
