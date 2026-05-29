import { useEffect, useState } from 'react';

export function AppTopbar() {
  const [online, setOnline] = useState(
    () => typeof navigator !== 'undefined' && navigator.onLine,
  );

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
      </div>
      <span className="app-topbar__hint">Sem sincronização em nuvem nesta versão</span>
    </header>
  );
}
