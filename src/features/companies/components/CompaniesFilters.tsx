import type { CompaniesFilters as Filters } from '@/features/companies/types/company';
import {
  COMPANY_STATUSES,
  COMPANY_STATUS_LABELS,
} from '@/features/companies/types/company';

type CompaniesFiltersProps = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

export function CompaniesFilters({ filters, onChange }: CompaniesFiltersProps) {
  return (
    <div className="filter-bar companies-filters">
      <div className="field companies-filters__field">
        <label className="field__label" htmlFor="filter-name">
          Nome
        </label>
        <input
          id="filter-name"
          className="input"
          value={filters.name}
          onChange={(e) => onChange({ ...filters, name: e.target.value })}
          placeholder="Buscar por nome"
        />
      </div>
      <div className="field companies-filters__field">
        <label className="field__label" htmlFor="filter-status">
          Status
        </label>
        <select
          id="filter-status"
          className="select"
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
      <div className="field companies-filters__field">
        <label className="field__label" htmlFor="filter-tag">
          Tag
        </label>
        <input
          id="filter-tag"
          className="input"
          value={filters.tag}
          onChange={(e) => onChange({ ...filters, tag: e.target.value })}
          placeholder="Buscar por tag"
        />
      </div>
    </div>
  );
}
