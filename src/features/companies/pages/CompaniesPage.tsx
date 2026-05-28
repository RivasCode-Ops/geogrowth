import { useEffect } from 'react';
import { CompaniesFilters } from '@/features/companies/components/CompaniesFilters';
import { CompaniesTable } from '@/features/companies/components/CompaniesTable';
import { CompanyForm } from '@/features/companies/components/CompanyForm';
import { useCompaniesStore } from '@/features/companies/store/companies.store';
import '@/features/companies/components/companies.css';
import { useStoreStore } from '@/features/store/store/store.store';
import { FeatureAlert } from '@/shared/components/FeatureAlert';
import { FeatureEmptyState } from '@/shared/components/FeatureEmptyState';
import { FeatureToolbar } from '@/shared/components/FeatureToolbar';

export function CompaniesPage() {
  const activeStore = useStoreStore((s) => s.activeStore);
  const items = useCompaniesStore((s) => s.items);
  const filters = useCompaniesStore((s) => s.filters);
  const editingId = useCompaniesStore((s) => s.editingId);
  const isLoading = useCompaniesStore((s) => s.isLoading);
  const isSaving = useCompaniesStore((s) => s.isSaving);
  const error = useCompaniesStore((s) => s.error);
  const loadCompanies = useCompaniesStore((s) => s.loadCompanies);
  const setFilters = useCompaniesStore((s) => s.setFilters);
  const startCreate = useCompaniesStore((s) => s.startCreate);
  const startEdit = useCompaniesStore((s) => s.startEdit);
  const cancelEdit = useCompaniesStore((s) => s.cancelEdit);
  const saveCompany = useCompaniesStore((s) => s.saveCompany);
  const deleteCompany = useCompaniesStore((s) => s.deleteCompany);

  useEffect(() => {
    if (activeStore) {
      void loadCompanies();
    }
  }, [activeStore, loadCompanies]);

  const editingCompany =
    editingId && editingId !== 'new'
      ? (items.find((c) => c.id === editingId) ?? null)
      : null;

  const showForm = editingId !== null;

  return (
    <section className="feature-page companies-layout">
      <FeatureToolbar
        title="Empresas"
        description="Gerencie empresas da loja ativa (dados locais)."
        actions={
          activeStore && !showForm ? (
            <button
              type="button"
              className="companies-btn companies-btn--primary"
              onClick={startCreate}
            >
              Nova empresa
            </button>
          ) : null
        }
      />

      {error ? <FeatureAlert message={error} /> : null}

      {!activeStore ? (
        <FeatureEmptyState>
          Cadastre uma loja em <strong>Loja</strong> para listar e salvar empresas.
        </FeatureEmptyState>
      ) : (
        <>
          <CompaniesFilters filters={filters} onChange={setFilters} />

          {showForm ? (
            <CompanyForm
              company={editingId === 'new' ? null : editingCompany}
              isSaving={isSaving}
              onSubmit={saveCompany}
              onCancel={cancelEdit}
            />
          ) : null}

          {isLoading ? (
            <p>Carregando…</p>
          ) : (
            <CompaniesTable
              items={items}
              onEdit={startEdit}
              onDelete={(id) => void deleteCompany(id)}
            />
          )}
        </>
      )}
    </section>
  );
}
