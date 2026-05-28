import { useEffect, useState, type FormEvent } from 'react';
import type { Company } from '@/features/companies/types/company';
import type { SaveVisitInput, VisitWithCompany } from '@/features/visits/types/visit';
import { VISIT_STATUSES, VISIT_STATUS_LABELS } from '@/features/visits/types/visit';
import '@/features/visits/components/visits.css';

type VisitFormProps = {
  visit: VisitWithCompany | null;
  companies: Company[];
  isSaving: boolean;
  onSubmit: (input: SaveVisitInput) => Promise<void>;
  onCancel: () => void;
  onDelete?: (id: string) => void;
};

type FormState = {
  companyId: string;
  scheduledAt: string;
  status: SaveVisitInput['status'];
  notes: string;
};

function toDatetimeLocal(iso: string): string {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function defaultScheduledAt(): string {
  const date = new Date();
  date.setMinutes(0, 0, 0);
  date.setHours(date.getHours() + 1);
  return toDatetimeLocal(date.toISOString());
}

function emptyForm(companies: Company[]): FormState {
  return {
    companyId: companies[0]?.id ?? '',
    scheduledAt: defaultScheduledAt(),
    status: 'planned',
    notes: '',
  };
}

export function VisitForm({
  visit,
  companies,
  isSaving,
  onSubmit,
  onCancel,
  onDelete,
}: VisitFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm(companies));

  useEffect(() => {
    if (visit) {
      setForm({
        companyId: visit.companyId,
        scheduledAt: toDatetimeLocal(visit.scheduledAt),
        status: visit.status,
        notes: visit.notes,
      });
      return;
    }
    setForm(emptyForm(companies));
  }, [visit, companies]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      id: visit?.id,
      companyId: form.companyId,
      scheduledAt: form.scheduledAt,
      status: form.status,
      notes: form.notes,
    });
  };

  if (companies.length === 0) {
    return (
      <p className="visits-empty">
        Cadastre empresas em <strong>Empresas</strong> antes de agendar visitas.
      </p>
    );
  }

  return (
    <form className="visits-form" onSubmit={(e) => void handleSubmit(e)}>
      <h2 className="visits-form__title">{visit ? 'Editar visita' : 'Nova visita'}</h2>

      <div className="visits-form__field">
        <label className="visits-form__label" htmlFor="visit-company">
          Empresa
        </label>
        <select
          id="visit-company"
          className="visits-select"
          value={form.companyId}
          onChange={(e) => setForm((prev) => ({ ...prev, companyId: e.target.value }))}
          required
        >
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="visits-form__field">
        <label className="visits-form__label" htmlFor="visit-scheduled">
          Data e hora
        </label>
        <input
          id="visit-scheduled"
          className="visits-input"
          type="datetime-local"
          value={form.scheduledAt}
          onChange={(e) => setForm((prev) => ({ ...prev, scheduledAt: e.target.value }))}
          required
        />
      </div>

      <div className="visits-form__field">
        <label className="visits-form__label" htmlFor="visit-status">
          Status
        </label>
        <select
          id="visit-status"
          className="visits-select"
          value={form.status}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              status: e.target.value as FormState['status'],
            }))
          }
        >
          {VISIT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {VISIT_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      <div className="visits-form__field">
        <label className="visits-form__label" htmlFor="visit-notes">
          Notas
        </label>
        <textarea
          id="visit-notes"
          className="visits-textarea"
          value={form.notes}
          onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
        />
      </div>

      <div className="visits-actions">
        <button className="visits-btn visits-btn--primary" type="submit" disabled={isSaving}>
          {isSaving ? 'Salvando…' : visit ? 'Salvar' : 'Agendar'}
        </button>
        <button className="visits-btn" type="button" onClick={onCancel}>
          Cancelar
        </button>
        {visit && onDelete ? (
          <button
            className="visits-btn visits-btn--danger"
            type="button"
            onClick={() => onDelete(visit.id)}
          >
            Excluir
          </button>
        ) : null}
      </div>
    </form>
  );
}
