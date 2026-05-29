import { useRef, useState, type ChangeEvent } from 'react';
import { exportBackup } from '@/core/backup/exportBackup';
import { BackupImportError, importBackupFromFile } from '@/core/backup/importBackup';
import { FeatureAlert } from '@/shared/components/FeatureAlert';

export function BackupPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    setSuccess(null);
    try {
      await exportBackup();
      setSuccess('Backup exportado.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao exportar backup.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }

    const confirmed = window.confirm(
      'Importar substitui todos os dados locais deste dispositivo. Continuar?',
    );
    if (!confirmed) {
      return;
    }

    setIsImporting(true);
    setError(null);
    setSuccess(null);
    try {
      await importBackupFromFile(file);
      setSuccess('Backup importado. Recarregando…');
      window.setTimeout(() => window.location.reload(), 600);
    } catch (err) {
      const message =
        err instanceof BackupImportError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Falha ao importar backup.';
      setError(message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="backup-actions">
      <div className="backup-actions__row">
        <button
          type="button"
          className="btn btn--primary"
          disabled={isExporting || isImporting}
          onClick={() => void handleExport()}
        >
          {isExporting ? 'Exportando…' : 'Exportar backup JSON'}
        </button>
        <button
          type="button"
          className="btn btn--secondary"
          disabled={isExporting || isImporting}
          onClick={handleImportClick}
        >
          {isImporting ? 'Importando…' : 'Importar backup JSON'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => void handleFileChange(e)}
        />
      </div>
      {error ? <FeatureAlert message={error} /> : null}
      {success ? (
        <p className="field__hint" style={{ color: 'var(--color-primary)' }}>
          {success}
        </p>
      ) : null}
      <p className="field__hint">
        Exporta ou restaura lojas, empresas, territórios, CRM, visitas e parcerias (IndexedDB).
      </p>
    </div>
  );
}
