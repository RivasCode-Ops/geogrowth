import { useEffect } from 'react';
import { TerritoryForm } from '@/features/territory/components/TerritoryForm';
import { TerritoryMap } from '@/features/territory/components/TerritoryMap';
import { useTerritoryStore } from '@/features/territory/store/territory.store';
import '@/features/territory/components/territory.css';
import { useStoreStore } from '@/features/store/store/store.store';
import { FeatureAlert } from '@/shared/components/FeatureAlert';
import { FeatureEmptyState } from '@/shared/components/FeatureEmptyState';
import { FeatureToolbar } from '@/shared/components/FeatureToolbar';

export function TerritoryPage() {
  const activeStore = useStoreStore((s) => s.activeStore);
  const items = useTerritoryStore((s) => s.items);
  const selectedId = useTerritoryStore((s) => s.selectedId);
  const editingId = useTerritoryStore((s) => s.editingId);
  const isLoading = useTerritoryStore((s) => s.isLoading);
  const isSaving = useTerritoryStore((s) => s.isSaving);
  const error = useTerritoryStore((s) => s.error);
  const loadTerritories = useTerritoryStore((s) => s.loadTerritories);
  const selectTerritory = useTerritoryStore((s) => s.selectTerritory);
  const startCreate = useTerritoryStore((s) => s.startCreate);
  const startEdit = useTerritoryStore((s) => s.startEdit);
  const cancelEdit = useTerritoryStore((s) => s.cancelEdit);
  const saveTerritory = useTerritoryStore((s) => s.saveTerritory);
  const deleteTerritory = useTerritoryStore((s) => s.deleteTerritory);

  useEffect(() => {
    if (activeStore) {
      void loadTerritories();
    }
  }, [activeStore, loadTerritories]);

  const editingTerritory =
    editingId && editingId !== 'new'
      ? (items.find((t) => t.id === editingId) ?? null)
      : null;

  const showForm = editingId !== null;

  return (
    <section className="feature-page">
      <FeatureToolbar
        title="Território"
        description="Áreas de atuação da loja ativa — retângulos (bbox) no mapa."
        actions={
          activeStore && !showForm ? (
            <button
              type="button"
              className="territory-btn territory-btn--primary"
              onClick={startCreate}
            >
              Nova área
            </button>
          ) : null
        }
      />

      {error ? <FeatureAlert message={error} /> : null}

      {!activeStore ? (
        <FeatureEmptyState>
          Cadastre uma loja em <strong>Loja</strong> para gerenciar territórios.
        </FeatureEmptyState>
      ) : (
        <div className="territory-layout">
          <div className="territory-panel">
            {showForm ? (
              <TerritoryForm
                territory={editingId === 'new' ? null : editingTerritory}
                isSaving={isSaving}
                onSubmit={saveTerritory}
                onCancel={cancelEdit}
              />
            ) : (
              <>
                {isLoading ? (
                  <p>Carregando…</p>
                ) : items.length === 0 ? (
                  <p className="territory-empty">Nenhuma área cadastrada.</p>
                ) : (
                  <ul className="territory-list">
                    {items.map((territory) => (
                      <li key={territory.id} className="territory-list__row">
                        <button
                          type="button"
                          className={`territory-list__item${selectedId === territory.id ? ' territory-list__item--selected' : ''}`}
                          onClick={() => selectTerritory(territory.id)}
                        >
                          <span
                            className="territory-list__swatch"
                            style={{ background: territory.color }}
                            aria-hidden
                          />
                          <span className="territory-list__name">{territory.name}</span>
                        </button>
                        <div className="territory-actions">
                          <button
                            type="button"
                            className="territory-btn"
                            onClick={() => startEdit(territory.id)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="territory-btn territory-btn--danger"
                            onClick={() => void deleteTerritory(territory.id)}
                          >
                            Excluir
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>

          <TerritoryMap
            territories={items}
            selectedId={selectedId}
            onSelect={selectTerritory}
          />
        </div>
      )}
    </section>
  );
}
