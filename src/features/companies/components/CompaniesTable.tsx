import type { Company } from '@/features/companies/types/company';
import { COMPANY_STATUS_LABELS } from '@/features/companies/types/company';
import '@/features/companies/components/companies.css';

type CompaniesTableProps = {
  items: Company[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export function CompaniesTable({ items, onEdit, onDelete }: CompaniesTableProps) {
  if (items.length === 0) {
    return <p className="companies-empty">Nenhuma empresa encontrada.</p>;
  }

  return (
    <div className="companies-table-wrap">
      <table className="companies-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Status</th>
            <th>Tag</th>
            <th aria-label="Ações" />
          </tr>
        </thead>
        <tbody>
          {items.map((company) => (
            <tr key={company.id}>
              <td>{company.name}</td>
              <td>
                <span className={`companies-badge companies-badge--${company.status}`}>
                  {COMPANY_STATUS_LABELS[company.status]}
                </span>
              </td>
              <td>{company.tag || '—'}</td>
              <td>
                <div className="companies-actions">
                  <button
                    type="button"
                    className="companies-btn"
                    onClick={() => onEdit(company.id)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="companies-btn companies-btn--danger"
                    onClick={() => onDelete(company.id)}
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
