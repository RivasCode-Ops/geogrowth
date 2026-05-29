import { useEffect, useState } from 'react';
import { SummaryCards } from '@/features/analytics/components/SummaryCards';
import {
  analyticsService,
  AnalyticsStoreRequiredError,
} from '@/features/analytics/services/analytics.service';
import type { AnalyticsSummary } from '@/features/analytics/types/analytics';
import '@/features/analytics/components/analytics.css';
import { useStoreStore } from '@/features/store/store/store.store';
import { FeatureAlert } from '@/shared/components/FeatureAlert';
import { FeatureEmptyState } from '@/shared/components/FeatureEmptyState';
import { FeatureToolbar } from '@/shared/components/FeatureToolbar';

export function AnalyticsPage() {
  const activeStore = useStoreStore((s) => s.activeStore);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeStore?.storeId || !activeStore.tenantId) {
      setSummary(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    void analyticsService
      .getSummary(activeStore.storeId, activeStore.tenantId)
      .then((data) => {
        if (!cancelled) {
          setSummary(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof AnalyticsStoreRequiredError
              ? err.message
              : err instanceof Error
                ? err.message
                : 'Não foi possível carregar analytics.';
          setError(message);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeStore]);

  return (
    <section className="page feature-page">
      <FeatureToolbar
        title="Analytics"
        description="Resumo agregado da loja ativa (somente leitura)."
      />

      {error ? <FeatureAlert message={error} /> : null}

      {!activeStore ? (
        <FeatureEmptyState>
          Cadastre uma loja em <strong>Loja</strong> para ver métricas.
        </FeatureEmptyState>
      ) : isLoading ? (
        <p className="loading-text">Carregando métricas…</p>
      ) : summary ? (
        <SummaryCards summary={summary} />
      ) : null}
    </section>
  );
}
