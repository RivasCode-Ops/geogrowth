import { useEffect, useState, type FormEvent } from 'react';
import type { Company } from '@/features/companies/types/company';
import type {
  PartnershipWithCompany,
  SavePartnershipInput,
} from '@/features/partnerships/types/partnership';
import {
  PARTNERSHIP_TYPES,
  PARTNERSHIP_TYPE_LABELS,
} from '@/features/partnerships/types/partnership';
import '@/features/partnerships/components/partnerships.css';

type PartnershipFormProps = {
  partnership: PartnershipWithCompany | null;
  companies: Company[];
  isSaving: boolean;
  onSubmit: (input: SavePartnershipInput) => Promise<void>;
  onCancel: () => void;
  onDelete?: (id: string) => void;
};

type FormState = {
  partnerName: string;
  type: SavePartnershipInput['type'];
  validFrom: string;
  validTo: string;
  companyId: string;
};

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function addMonthsIsoDate(base: string, months: number): string {
  const date = new Date(base);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
}

function emptyForm(): FormState {
  const from = todayIsoDate();
  return {
    partnerName: '',
    type: 'comercial',
    validFrom: from,
    validTo: addMonthsIsoDate(from, 12),
    companyId: '',
  };
}

export function PartnershipForm({
  partnership,
  companies,
  isSaving,
  onSubmit,
  onCancel,
  onDelete,
}: PartnershipFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (partnership) {
      setForm({
        partnerName: partnership.partnerName,
        type: partnership.type,
        validFrom: partnership.validFrom,
        validTo: partnership.validTo,
        companyId: partnership.companyId,
      });
      return;
    }
    setForm(emptyForm());
  }, [partnership]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      id: partnership?.id,
      partnerName: form.partnerName,
      type: form.type,
      validFrom: form.validFrom,
      validTo: form.validTo,
      companyId: form.companyId,
    });
  };

  return (
    <form className="form-stack" onSubmit={(e) => void handleSubmit(e)}>
      <div className="field">
        <label className="field__label" htmlFor="partner-name">
          Nome do parceiro
        </label>
        <input
          id="partner-name"
          className="input"
          value={form.partnerName}
          onChange={(e) => setForm((prev) => ({ ...prev, partnerName: e.target.value }))}
          required
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="partner-type">
          Tipo
        </label>
        <select
          id="partner-type"
          className="select"
          value={form.type}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              type: e.target.value as FormState['type'],
            }))
          }
        >
          {PARTNERSHIP_TYPES.map((type) => (
            <option key={type} value={type}>
              {PARTNERSHIP_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="partnerships-dates-field">
        <legend className="field__label">Vigência</legend>
        <div className="partnerships-dates">
          <div className="field">
            <label className="field__label" htmlFor="partner-from">
              Início
            </label>
            <input
              id="partner-from"
              className="input"
              type="date"
              value={form.validFrom}
              onChange={(e) => setForm((prev) => ({ ...prev, validFrom: e.target.value }))}
              required
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="partner-to">
              Fim
            </label>
            <input
              id="partner-to"
              className="input"
              type="date"
              value={form.validTo}
              onChange={(e) => setForm((prev) => ({ ...prev, validTo: e.target.value }))}
              required
            />
          </div>
        </div>
      </fieldset>

      <div className="field">
        <label className="field__label" htmlFor="partner-company">
          Empresa (opcional)
        </label>
        <select
          id="partner-company"
          className="select"
          value={form.companyId}
          onChange={(e) => setForm((prev) => ({ ...prev, companyId: e.target.value }))}
        >
          <option value="">— Nenhuma —</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button className="btn btn--primary" type="submit" disabled={isSaving}>
          {isSaving ? 'Salvando…' : partnership ? 'Salvar' : 'Cadastrar'}
        </button>
        <button className="btn btn--secondary" type="button" onClick={onCancel}>
          Cancelar
        </button>
        {partnership && onDelete ? (
          <button
            className="btn btn--danger"
            type="button"
            onClick={() => onDelete(partnership.id)}
          >
            Excluir
          </button>
        ) : null}
      </div>
    </form>
  );
}
