import type { PartnershipWithCompany } from '@/features/partnerships/types/partnership';
import { PARTNERSHIP_TYPE_LABELS } from '@/features/partnerships/types/partnership';
import '@/features/partnerships/components/partnerships.css';

type PartnershipsTableProps = {
  items: PartnershipWithCompany[];
  onEdit: (id: string) => void;
};

function formatDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-');
  if (!y || !m || !d) {
    return isoDate;
  }
  return `${d}/${m}/${y}`;
}

export function PartnershipsTable({ items, onEdit }: PartnershipsTableProps) {
  if (items.length === 0) {
    return <p className="partnerships-empty">Nenhuma parceria encontrada.</p>;
  }

  return (
    <div className="partnerships-table-wrap">
      <table className="partnerships-table">
        <thead>
          <tr>
            <th>Parceiro</th>
            <th>Tipo</th>
            <th>Vigência</th>
            <th>Empresa</th>
            <th aria-label="Ações" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.partnerName}</td>
              <td>{PARTNERSHIP_TYPE_LABELS[item.type]}</td>
              <td>
                {formatDate(item.validFrom)} — {formatDate(item.validTo)}
              </td>
              <td>{item.companyName ?? '—'}</td>
              <td>
                <button
                  type="button"
                  className="btn btn--sm btn--secondary"
                  onClick={() => onEdit(item.id)}
                >
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
