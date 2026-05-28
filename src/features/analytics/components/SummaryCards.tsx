import type { AnalyticsSummary } from '@/features/analytics/types/analytics';
import { DEAL_STAGES, DEAL_STAGE_LABELS } from '@/features/crm/types/stage';
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
      <div className="analytics-grid">
        <article className="analytics-card">
          <p className="analytics-card__label">Empresas</p>
          <p className="analytics-card__value">{summary.companiesTotal}</p>
        </article>
        <article className="analytics-card">
          <p className="analytics-card__label">Oportunidades (CRM)</p>
          <p className="analytics-card__value">{dealsTotal}</p>
        </article>
        <article className="analytics-card">
          <p className="analytics-card__label">Visitas no mês</p>
          <p className="analytics-card__value">{summary.visitsThisMonth}</p>
        </article>
      </div>

      <section className="analytics-stages" aria-labelledby="deals-by-stage-title">
        <h2 id="deals-by-stage-title">Oportunidades por estágio</h2>
        <ul className="analytics-stages__list">
          {DEAL_STAGES.map((stage) => (
            <li key={stage} className="analytics-stages__item">
              <span>{DEAL_STAGE_LABELS[stage]}</span>
              <strong>{summary.dealsByStage[stage]}</strong>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
