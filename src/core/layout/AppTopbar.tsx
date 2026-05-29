import { useEffect, useState } from 'react';
import { isSyncConfigured } from '@/core/sync/create-sync-adapter';
import { useSyncStore } from '@/core/sync/sync.store';

export function AppTopbar() {
  const [online, setOnline] = useState(
    () => typeof navigator !== 'undefined' && navigator.onLine,
  );

  const isConfigured = useSyncStore((s) => s.isConfigured);
  const isSyncing = useSyncStore((s) => s.isSyncing);
  const summary = useSyncStore((s) => s.summary);
  const lastMessage = useSyncStore((s) => s.lastMessage);
  const error = useSyncStore((s) => s.error);
  const refreshSummary = useSyncStore((s) => s.refreshSummary);
  const pushNow = useSyncStore((s) => s.pushNow);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    void refreshSummary();
  }, [refreshSummary, online]);

  const pendingCount = summary?.total ?? 0;

  return (
    <header className="app-topbar" aria-label="Status do app">
      <div className="app-topbar__status" title="Dados salvos neste dispositivo (IndexedDB)">
        <span
          className={`app-topbar__dot${online ? '' : ' app-topbar__dot--offline'}`}
          aria-hidden
        />
        <span className="app-topbar__label">
          {online ? 'Local-first · online' : 'Local-first · offline'}
        </span>
        {pendingCount > 0 ? (
          <span className="app-topbar__badge" title="Registros aguardando envio">
            {pendingCount} pendente{pendingCount === 1 ? '' : 's'}
          </span>
        ) : null}
      </div>

      <div className="app-topbar__actions">
        {lastMessage && !error ? (
          <span className="app-topbar__hint app-topbar__hint--success">{lastMessage}</span>
        ) : null}
        {error ? <span className="app-topbar__hint app-topbar__hint--error">{error}</span> : null}
        {!isConfigured && !error ? (
          <span className="app-topbar__hint">Configure VITE_SYNC_PUSH_URL para sync</span>
        ) : null}
        <button
          type="button"
          className="btn btn--secondary btn--sm"
          disabled={!online || isSyncing || pendingCount === 0}
          onClick={() => void pushNow()}
          title={
            !online
              ? 'Conecte-se à internet para sincronizar'
              : pendingCount === 0
                ? 'Nenhum dado pendente'
                : 'Enviar pendências ao servidor'
          }
        >
          {isSyncing ? 'Sincronizando…' : 'Sincronizar'}
        </button>
      </div>
    </header>
  );
}
