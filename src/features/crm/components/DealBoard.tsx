import type { DealWithCompany } from '@/features/crm/types/deal';
import { DEAL_STAGES, DEAL_STAGE_LABELS } from '@/features/crm/types/stage';
import '@/features/crm/components/crm.css';

type DealBoardProps = {
  deals: DealWithCompany[];
  onEdit: (id: string) => void;
};

function formatValue(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function DealBoard({ deals, onEdit }: DealBoardProps) {
  return (
    <div className="crm-board">
      {DEAL_STAGES.map((stage) => {
        const columnDeals = deals.filter((d) => d.stage === stage);
        return (
          <div key={stage} className="crm-column">
            <h3 className="crm-column__title">
              {DEAL_STAGE_LABELS[stage]} ({columnDeals.length})
            </h3>
            {columnDeals.length === 0 ? (
              <p className="crm-hint">—</p>
            ) : (
              columnDeals.map((deal) => (
                <button
                  key={deal.id}
                  type="button"
                  className="crm-card"
                  onClick={() => onEdit(deal.id)}
                >
                  <p className="crm-card__title">{deal.title}</p>
                  <p className="crm-card__meta">{deal.companyName}</p>
                  <p className="crm-card__meta">{formatValue(deal.value)}</p>
                </button>
              ))
            )}
          </div>
        );
      })}
    </div>
  );
}
