import type { VisitWithCompany } from '@/features/visits/types/visit';
import { VISIT_STATUS_LABELS } from '@/features/visits/types/visit';
import '@/features/visits/components/visits.css';

type VisitsTableProps = {
  visits: VisitWithCompany[];
  onEdit: (id: string) => void;
};

function formatScheduledAt(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

export function VisitsTable({ visits, onEdit }: VisitsTableProps) {
  if (visits.length === 0) {
    return <p className="visits-empty">Nenhuma visita encontrada.</p>;
  }

  return (
    <div className="visits-table-wrap">
      <table className="visits-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Empresa</th>
            <th>Status</th>
            <th>Notas</th>
            <th aria-label="Ações" />
          </tr>
        </thead>
        <tbody>
          {visits.map((visit) => (
            <tr key={visit.id}>
              <td>{formatScheduledAt(visit.scheduledAt)}</td>
              <td>{visit.companyName}</td>
              <td>
                <span className={`visits-badge visits-badge--${visit.status}`}>
                  {VISIT_STATUS_LABELS[visit.status]}
                </span>
              </td>
              <td>{visit.notes || '—'}</td>
              <td>
                <button type="button" className="visits-btn" onClick={() => onEdit(visit.id)}>
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
