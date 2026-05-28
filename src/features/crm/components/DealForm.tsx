import { useEffect, useState, type FormEvent } from 'react';
import type { Company } from '@/features/companies/types/company';
import type { DealWithCompany, SaveDealInput } from '@/features/crm/types/deal';
import { DEAL_STAGES, DEAL_STAGE_LABELS } from '@/features/crm/types/stage';
import '@/features/crm/components/crm.css';

type DealFormProps = {
  deal: DealWithCompany | null;
  companies: Company[];
  isSaving: boolean;
  onSubmit: (input: SaveDealInput) => Promise<void>;
  onCancel: () => void;
  onDelete?: (id: string) => void;
};

type FormState = {
  companyId: string;
  title: string;
  stage: SaveDealInput['stage'];
  value: string;
  notes: string;
};

function emptyForm(companies: Company[]): FormState {
  return {
    companyId: companies[0]?.id ?? '',
    title: '',
    stage: 'lead',
    value: '0',
    notes: '',
  };
}

export function DealForm({
  deal,
  companies,
  isSaving,
  onSubmit,
  onCancel,
  onDelete,
}: DealFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm(companies));

  useEffect(() => {
    if (deal) {
      setForm({
        companyId: deal.companyId,
        title: deal.title,
        stage: deal.stage,
        value: String(deal.value),
        notes: deal.notes,
      });
      return;
    }
    setForm(emptyForm(companies));
  }, [deal, companies]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = Number.parseFloat(form.value);
    await onSubmit({
      id: deal?.id,
      companyId: form.companyId,
      title: form.title,
      stage: form.stage,
      value: Number.isNaN(value) ? 0 : value,
      notes: form.notes,
    });
  };

  if (companies.length === 0) {
    return (
      <p className="crm-empty">
        Cadastre empresas em <strong>Empresas</strong> antes de criar oportunidades.
      </p>
    );
  }

  return (
    <form className="crm-form" onSubmit={(e) => void handleSubmit(e)}>
      <h2 className="crm-form__title">{deal ? 'Editar oportunidade' : 'Nova oportunidade'}</h2>

      <div className="crm-form__field">
        <label className="crm-form__label" htmlFor="deal-company">
          Empresa
        </label>
        <select
          id="deal-company"
          className="crm-select"
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

      <div className="crm-form__field">
        <label className="crm-form__label" htmlFor="deal-title">
          Título
        </label>
        <input
          id="deal-title"
          className="crm-input"
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      <div className="crm-form__field">
        <label className="crm-form__label" htmlFor="deal-stage">
          Estágio
        </label>
        <select
          id="deal-stage"
          className="crm-select"
          value={form.stage}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              stage: e.target.value as FormState['stage'],
            }))
          }
        >
          {DEAL_STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {DEAL_STAGE_LABELS[stage]}
            </option>
          ))}
        </select>
      </div>

      <div className="crm-form__field">
        <label className="crm-form__label" htmlFor="deal-value">
          Valor (R$)
        </label>
        <input
          id="deal-value"
          className="crm-input"
          type="number"
          min="0"
          step="0.01"
          value={form.value}
          onChange={(e) => setForm((prev) => ({ ...prev, value: e.target.value }))}
        />
      </div>

      <div className="crm-form__field">
        <label className="crm-form__label" htmlFor="deal-notes">
          Notas
        </label>
        <textarea
          id="deal-notes"
          className="crm-textarea"
          value={form.notes}
          onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
        />
      </div>

      <div className="crm-actions">
        <button className="crm-btn crm-btn--primary" type="submit" disabled={isSaving}>
          {isSaving ? 'Salvando…' : deal ? 'Salvar' : 'Cadastrar'}
        </button>
        <button className="crm-btn" type="button" onClick={onCancel}>
          Cancelar
        </button>
        {deal && onDelete ? (
          <button
            className="crm-btn crm-btn--danger"
            type="button"
            onClick={() => onDelete(deal.id)}
          >
            Excluir
          </button>
        ) : null}
      </div>
    </form>
  );
}
