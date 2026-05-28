import { useEffect } from 'react';
import { StoreForm } from '@/features/store/components/StoreForm';
import { useStoreStore } from '@/features/store/store/store.store';
import { BackupButton } from '@/shared/components/BackupButton';

export function StoreHomePage() {
  const activeStore = useStoreStore((s) => s.activeStore);
  const isLoading = useStoreStore((s) => s.isLoading);
  const isSaving = useStoreStore((s) => s.isSaving);
  const error = useStoreStore((s) => s.error);
  const loadActiveStore = useStoreStore((s) => s.loadActiveStore);
  const saveStore = useStoreStore((s) => s.saveStore);

  useEffect(() => {
    void loadActiveStore();
  }, [loadActiveStore]);

  return (
    <section className="feature-page">
      <h1>Loja</h1>
      <p>Cadastre ou edite a loja ativa. Os dados ficam no dispositivo (IndexedDB).</p>

      {error ? (
        <p className="store-alert" role="alert">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <p>Carregando…</p>
      ) : (
        <>
          {activeStore ? (
            <dl className="store-status">
              <dt>Loja ativa</dt>
              <dd>{activeStore.name}</dd>
              <dt>Store ID (global)</dt>
              <dd>
                <code>{activeStore.storeId}</code>
              </dd>
              <dt>Tenant ID</dt>
              <dd>
                <code>{activeStore.tenantId}</code>
              </dd>
            </dl>
          ) : (
            <p>Nenhuma loja cadastrada ainda.</p>
          )}

          <StoreForm store={activeStore} isSaving={isSaving} onSubmit={saveStore} />

          <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />
          <h2 style={{ fontSize: '1rem', margin: '0 0 0.5rem' }}>Backup local</h2>
          <BackupButton />
        </>
      )}
    </section>
  );
}
