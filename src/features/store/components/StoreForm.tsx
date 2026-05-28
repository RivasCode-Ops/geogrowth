import { useEffect, useState, type FormEvent } from 'react';
import type { SaveStoreInput, Store } from '@/features/store/types/store';
import '@/features/store/components/store-form.css';

type StoreFormProps = {
  store: Store | null;
  isSaving: boolean;
  onSubmit: (input: SaveStoreInput) => Promise<void>;
};

type FormState = {
  name: string;
  tenantId: string;
  storeId: string;
};

const emptyForm: FormState = {
  name: '',
  tenantId: '',
  storeId: '',
};

export function StoreForm({ store, isSaving, onSubmit }: StoreFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (store) {
      setForm({
        name: store.name,
        tenantId: store.tenantId,
        storeId: store.storeId,
      });
      return;
    }
    setForm(emptyForm);
  }, [store]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      id: store?.id,
      name: form.name,
      tenantId: form.tenantId,
      storeId: form.storeId,
    });
  };

  return (
    <form className="store-form" onSubmit={(e) => void handleSubmit(e)}>
      <div className="store-form__field">
        <label className="store-form__label" htmlFor="store-name">
          Nome da loja
        </label>
        <input
          id="store-name"
          className="store-form__input"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="Ex.: Loja Centro"
          required
        />
      </div>

      <div className="store-form__field">
        <label className="store-form__label" htmlFor="store-tenant-id">
          Tenant ID
        </label>
        <input
          id="store-tenant-id"
          className="store-form__input"
          value={form.tenantId}
          onChange={(e) => setForm((prev) => ({ ...prev, tenantId: e.target.value }))}
          placeholder="Identificador do tenant"
          required
        />
      </div>

      <div className="store-form__field">
        <label className="store-form__label" htmlFor="store-store-id">
          Store ID
        </label>
        <input
          id="store-store-id"
          className="store-form__input"
          value={form.storeId}
          onChange={(e) => setForm((prev) => ({ ...prev, storeId: e.target.value }))}
          placeholder="Identificador da loja"
          required
        />
        <p className="store-form__hint">
          Usado pelas demais features para filtrar dados locais.
        </p>
      </div>

      <div className="store-form__actions">
        <button className="store-form__submit" type="submit" disabled={isSaving}>
          {isSaving ? 'Salvando…' : store ? 'Atualizar loja' : 'Cadastrar loja'}
        </button>
      </div>
    </form>
  );
}
