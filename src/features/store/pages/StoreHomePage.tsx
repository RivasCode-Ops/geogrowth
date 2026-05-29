import { useEffect } from 'react';
import { StoreForm } from '@/features/store/components/StoreForm';
import { useStoreStore } from '@/features/store/store/store.store';
import { BackupPanel } from '@/shared/components/BackupPanel';
import { Card } from '@/shared/components/Card';
import { FeatureAlert } from '@/shared/components/FeatureAlert';
import { KpiCard } from '@/shared/components/KpiCard';
import { PageHeader } from '@/shared/components/PageHeader';
import '@/shared/components/feature-ui.css';

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
    <section className="page feature-page">
      <PageHeader
        title="Loja"
        subtitle="Cadastre e gerencie a loja ativa. Os identificadores definem o escopo local das demais áreas do app."
      />

      {error ? <FeatureAlert message={error} /> : null}

      {isLoading ? (
        <p className="loading-text">Carregando loja ativa…</p>
      ) : (
        <>
          <div className="grid grid--kpis">
            <KpiCard
              label="Loja ativa"
              value={activeStore?.name ?? '—'}
              hint={activeStore ? 'Contexto operacional atual' : 'Cadastre uma loja abaixo'}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M4 9.5 12 4l8 5.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1V9.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
            <KpiCard
              label="Store ID"
              value={
                activeStore ? (
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>
                    {activeStore.storeId}
                  </code>
                ) : (
                  '—'
                )
              }
              hint="Identificador global da loja"
            />
            <KpiCard
              label="Tenant ID"
              value={
                activeStore ? (
                  <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>
                    {activeStore.tenantId}
                  </code>
                ) : (
                  '—'
                )
              }
              hint="Escopo multi-loja / franquia"
            />
          </div>

          <div className="grid grid--2">
            <Card
              title={activeStore ? 'Editar loja' : 'Cadastrar loja'}
              description="Dados persistidos localmente no dispositivo (IndexedDB)."
              flushTop
            >
              <StoreForm store={activeStore} isSaving={isSaving} onSubmit={saveStore} />
            </Card>

            <Card
              title="Resumo"
              description="Status da configuração local."
              flushTop
            >
              {activeStore ? (
                <dl className="meta-list">
                  <div className="meta-list__row">
                    <dt className="meta-list__label">Nome</dt>
                    <dd className="meta-list__value">{activeStore.name}</dd>
                  </div>
                  <div className="meta-list__row">
                    <dt className="meta-list__label">Store ID</dt>
                    <dd className="meta-list__value">
                      <code>{activeStore.storeId}</code>
                    </dd>
                  </div>
                  <div className="meta-list__row">
                    <dt className="meta-list__label">Tenant ID</dt>
                    <dd className="meta-list__value">
                      <code>{activeStore.tenantId}</code>
                    </dd>
                  </div>
                  <div className="meta-list__row">
                    <dt className="meta-list__label">Persistência</dt>
                    <dd className="meta-list__value">
                      <span className="badge badge--success">Local-first</span>
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="empty-hint">
                  Nenhuma loja cadastrada. Preencha o formulário ao lado para iniciar o
                  território comercial.
                </p>
              )}
            </Card>
          </div>

          <div className="section-spaced">
            <Card
              title="Backup local"
              description="Exporte ou restaure todos os dados do dispositivo em JSON."
              flushTop
            >
              <BackupPanel />
            </Card>
          </div>
        </>
      )}
    </section>
  );
}
