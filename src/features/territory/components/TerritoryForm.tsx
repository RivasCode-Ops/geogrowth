import { useEffect, useState, type FormEvent } from 'react';
import type { TerritoryBounds } from '@/core/db/schema';
import type { SaveTerritoryInput, Territory } from '@/features/territory/types/territory';
import {
  DEFAULT_TERRITORY_BOUNDS,
  TERRITORY_COLORS,
} from '@/features/territory/types/territory';
import '@/features/territory/components/territory.css';

type TerritoryFormProps = {
  territory: Territory | null;
  isSaving: boolean;
  onSubmit: (input: SaveTerritoryInput) => Promise<void>;
  onCancel: () => void;
};

type FormState = {
  name: string;
  description: string;
  bounds: TerritoryBounds;
  color: string;
};

function emptyForm(): FormState {
  return {
    name: '',
    description: '',
    bounds: { ...DEFAULT_TERRITORY_BOUNDS },
    color: TERRITORY_COLORS[0],
  };
}

export function TerritoryForm({ territory, isSaving, onSubmit, onCancel }: TerritoryFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (territory) {
      setForm({
        name: territory.name,
        description: territory.description,
        bounds: { ...territory.bounds },
        color: territory.color,
      });
      return;
    }
    setForm(emptyForm());
  }, [territory]);

  const setBound = (key: keyof TerritoryBounds, value: string) => {
    const num = Number.parseFloat(value);
    if (Number.isNaN(num)) {
      return;
    }
    setForm((prev) => ({
      ...prev,
      bounds: { ...prev.bounds, [key]: num },
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      id: territory?.id,
      name: form.name,
      description: form.description,
      bounds: form.bounds,
      color: form.color,
    });
  };

  return (
    <form className="territory-form" onSubmit={(e) => void handleSubmit(e)}>
      <h2 className="territory-form__title">
        {territory ? 'Editar área' : 'Nova área de atuação'}
      </h2>

      <div className="territory-form__field">
        <label className="territory-form__label" htmlFor="territory-name">
          Nome
        </label>
        <input
          id="territory-name"
          className="territory-input"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="territory-form__field">
        <label className="territory-form__label" htmlFor="territory-desc">
          Descrição
        </label>
        <textarea
          id="territory-desc"
          className="territory-textarea"
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div className="territory-form__field">
        <span className="territory-form__label">Cor no mapa</span>
        <div className="territory-colors">
          {TERRITORY_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`territory-color-btn${form.color === color ? ' territory-color-btn--active' : ''}`}
              style={{ background: color }}
              aria-label={`Cor ${color}`}
              onClick={() => setForm((prev) => ({ ...prev, color }))}
            />
          ))}
        </div>
      </div>

      <fieldset className="territory-form__field">
        <legend className="territory-form__label">Limites (bbox)</legend>
        <div className="territory-bounds">
          <label>
            Norte (lat)
            <input
              className="territory-input"
              type="number"
              step="any"
              value={form.bounds.north}
              onChange={(e) => setBound('north', e.target.value)}
            />
          </label>
          <label>
            Sul (lat)
            <input
              className="territory-input"
              type="number"
              step="any"
              value={form.bounds.south}
              onChange={(e) => setBound('south', e.target.value)}
            />
          </label>
          <label>
            Leste (lng)
            <input
              className="territory-input"
              type="number"
              step="any"
              value={form.bounds.east}
              onChange={(e) => setBound('east', e.target.value)}
            />
          </label>
          <label>
            Oeste (lng)
            <input
              className="territory-input"
              type="number"
              step="any"
              value={form.bounds.west}
              onChange={(e) => setBound('west', e.target.value)}
            />
          </label>
        </div>
        <p className="territory-hint">Retângulo exibido no mapa (offline: tiles OSM quando online).</p>
      </fieldset>

      <div className="territory-actions">
        <button className="territory-btn territory-btn--primary" type="submit" disabled={isSaving}>
          {isSaving ? 'Salvando…' : territory ? 'Salvar' : 'Cadastrar'}
        </button>
        <button className="territory-btn" type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
