import { useEffect } from 'react';
import { PartnershipForm } from '@/features/partnerships/components/PartnershipForm';
import { PartnershipsTable } from '@/features/partnerships/components/PartnershipsTable';
import { usePartnershipsStore } from '@/features/partnerships/store/partnerships.store';
import type { PartnershipsFilterType } from '@/features/partnerships/types/partnership';
import {
  PARTNERSHIP_TYPES,
  PARTNERSHIP_TYPE_LABELS,
} from '@/features/partnerships/types/partnership';
import '@/features/partnerships/components/partnerships.css';
import { useStoreStore } from '@/features/store/store/store.store';
import { FeatureAlert } from '@/shared/components/FeatureAlert';
import { FeatureEmptyState } from '@/shared/components/FeatureEmptyState';
import { FeatureToolbar } from '@/shared/components/FeatureToolbar';

export function PartnershipsPage() {
  const activeStore = useStoreStore((s) => s.activeStore);
  const items = usePartnershipsStore((s) => s.items);
  const companies = usePartnershipsStore((s) => s.companies);
  const typeFilter = usePartnershipsStore((s) => s.typeFilter);
  const editingId = usePartnershipsStore((s) => s.editingId);
  const isLoading = usePartnershipsStore((s) => s.isLoading);
  const isSaving = usePartnershipsStore((s) => s.isSaving);
  const error = usePartnershipsStore((s) => s.error);
  const loadPartnerships = usePartnershipsStore((s) => s.loadPartnerships);
  const setTypeFilter = usePartnershipsStore((s) => s.setTypeFilter);
  const startCreate = usePartnershipsStore((s) => s.startCreate);
  const startEdit = usePartnershipsStore((s) => s.startEdit);
  const cancelEdit = usePartnershipsStore((s) => s.cancelEdit);
  const savePartnership = usePartnershipsStore((s) => s.savePartnership);
  const deletePartnership = usePartnershipsStore((s) => s.deletePartnership);

  useEffect(() => {
    if (activeStore) {
      void loadPartnerships();
    }
  }, [activeStore, loadPartnerships]);

  const editingItem =
    editingId && editingId !== 'new'
      ? (items.find((p) => p.id === editingId) ?? null)
      : null;

  const showForm = editingId !== null;

  return (
    <section className="feature-page">
      <FeatureToolbar
        title="Parcerias"
        description="Gerencie parcerias da loja ativa (empresa vinculada opcional)."
        actions={
          activeStore && !showForm ? (
            <button
              type="button"
              className="partnerships-btn partnerships-btn--primary"
              onClick={startCreate}
            >
              Nova parceria
            </button>
          ) : null
        }
      />

      {error ? <FeatureAlert message={error} /> : null}

      {!activeStore ? (
        <FeatureEmptyState>
          Cadastre uma loja em <strong>Loja</strong> para gerenciar parcerias.
        </FeatureEmptyState>
      ) : (
        <>
          {showForm ? (
            <PartnershipForm
              partnership={editingId === 'new' ? null : editingItem}
              companies={companies}
              isSaving={isSaving}
              onSubmit={savePartnership}
              onCancel={cancelEdit}
              onDelete={(id) => void deletePartnership(id)}
            />
          ) : (
            <div className="partnerships-filter">
              <label className="partnerships-filter__label" htmlFor="partnerships-type-filter">
                Tipo
              </label>
              <select
                id="partnerships-type-filter"
                className="partnerships-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as PartnershipsFilterType)}
              >
                <option value="all">Todos</option>
                {PARTNERSHIP_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {PARTNERSHIP_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>
          )}

          {isLoading ? (
            <p>Carregando…</p>
          ) : showForm ? null : (
            <PartnershipsTable items={items} onEdit={startEdit} />
          )}
        </>
      )}
    </section>
  );
}
