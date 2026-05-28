import { useState } from 'react';
import { exportBackup } from '@/core/backup/exportBackup';
import { FeatureAlert } from '@/shared/components/FeatureAlert';

export function BackupButton() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    try {
      await exportBackup();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao exportar backup.';
      setError(message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="backup-actions">
      <button
        type="button"
        className="store-form__submit"
        disabled={isExporting}
        onClick={() => void handleExport()}
      >
        {isExporting ? 'Exportando…' : 'Exportar backup JSON'}
      </button>
      {error ? <FeatureAlert message={error} /> : null}
      <p className="store-form__hint">
        Baixa todas as tabelas locais (lojas, empresas, territórios, CRM, visitas, parcerias).
      </p>
    </div>
  );
}
