import type { CompaniesFilters as Filters } from '@/features/companies/types/company';
import {
  COMPANY_STATUSES,
  COMPANY_STATUS_LABELS,
} from '@/features/companies/types/company';
import '@/features/companies/components/companies.css';

type CompaniesFiltersProps = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

export function CompaniesFilters({ filters, onChange }: CompaniesFiltersProps) {
  return (
    <div className="companies-filters">
      <div className="companies-filters__field">
        <label className="companies-filters__label" htmlFor="filter-name">
          Nome
        </label>
        <input
          id="filter-name"
          className="companies-input"
          value={filters.name}
          onChange={(e) => onChange({ ...filters, name: e.target.value })}
          placeholder="Buscar por nome"
        />
      </div>
      <div className="companies-filters__field">
        <label className="companies-filters__label" htmlFor="filter-status">
          Status
        </label>
        <select
          id="filter-status"
          className="companies-select"
          value={filters.status}
          onChange={(e) =>
            onChange({
              ...filters,
              status: e.target.value as Filters['status'],
            })
          }
        >
          <option value="all">Todos</option>
          {COMPANY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {COMPANY_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>
      <div className="companies-filters__field">
        <label className="companies-filters__label" htmlFor="filter-tag">
          Tag
        </label>
        <input
          id="filter-tag"
          className="companies-input"
          value={filters.tag}
          onChange={(e) => onChange({ ...filters, tag: e.target.value })}
          placeholder="Buscar por tag"
        />
      </div>
    </div>
  );
}
