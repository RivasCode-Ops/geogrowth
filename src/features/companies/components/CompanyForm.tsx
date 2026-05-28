import { useEffect, useState, type FormEvent } from 'react';
import type { Company, SaveCompanyInput } from '@/features/companies/types/company';
import {
  COMPANY_STATUSES,
  COMPANY_STATUS_LABELS,
} from '@/features/companies/types/company';
import '@/features/companies/components/companies.css';

type CompanyFormProps = {
  company: Company | null;
  isSaving: boolean;
  onSubmit: (input: SaveCompanyInput) => Promise<void>;
  onCancel: () => void;
};

type FormState = {
  name: string;
  status: SaveCompanyInput['status'];
  tag: string;
};

const emptyForm: FormState = {
  name: '',
  status: 'lead',
  tag: '',
};

export function CompanyForm({ company, isSaving, onSubmit, onCancel }: CompanyFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (company) {
      setForm({
        name: company.name,
        status: company.status,
        tag: company.tag,
      });
      return;
    }
    setForm(emptyForm);
  }, [company]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      id: company?.id,
      name: form.name,
      status: form.status,
      tag: form.tag,
    });
  };

  return (
    <form className="companies-form" onSubmit={(e) => void handleSubmit(e)}>
      <h2 className="companies-form__title">
        {company ? 'Editar empresa' : 'Nova empresa'}
      </h2>

      <div className="companies-form__field">
        <label className="companies-form__label" htmlFor="company-name">
          Nome
        </label>
        <input
          id="company-name"
          className="companies-input"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="companies-form__field">
        <label className="companies-form__label" htmlFor="company-status">
          Status
        </label>
        <select
          id="company-status"
          className="companies-select"
          value={form.status}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              status: e.target.value as FormState['status'],
            }))
          }
        >
          {COMPANY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {COMPANY_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      <div className="companies-form__field">
        <label className="companies-form__label" htmlFor="company-tag">
          Tag
        </label>
        <input
          id="company-tag"
          className="companies-input"
          value={form.tag}
          onChange={(e) => setForm((prev) => ({ ...prev, tag: e.target.value }))}
          placeholder="Ex.: varejo, parceiro"
        />
      </div>

      <div className="companies-actions">
        <button className="companies-btn companies-btn--primary" type="submit" disabled={isSaving}>
          {isSaving ? 'Salvando…' : company ? 'Salvar' : 'Cadastrar'}
        </button>
        <button className="companies-btn" type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
