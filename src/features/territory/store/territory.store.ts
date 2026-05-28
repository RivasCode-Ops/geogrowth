import { create } from 'zustand';
import {
  territoryService,
  TerritoryStoreRequiredError,
  TerritoryValidationError,
} from '@/features/territory/services/territory.service';
import type { SaveTerritoryInput, Territory } from '@/features/territory/types/territory';
import { mapFeatureError } from '@/shared/errors/mapFeatureError';
import { getActiveStoreContext } from '@/shared/store/activeStoreContext';

type TerritorySliceState = {
  items: Territory[];
  selectedId: string | null;
  editingId: string | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
};

type TerritorySliceActions = {
  loadTerritories: () => Promise<void>;
  selectTerritory: (id: string | null) => void;
  startCreate: () => void;
  startEdit: (id: string) => void;
  cancelEdit: () => void;
  saveTerritory: (input: SaveTerritoryInput) => Promise<void>;
  deleteTerritory: (id: string) => Promise<void>;
  clearError: () => void;
};

export type TerritorySlice = TerritorySliceState & TerritorySliceActions;

const knownErrors = [TerritoryStoreRequiredError, TerritoryValidationError] as const;

export const useTerritoryStore = create<TerritorySlice>((set, get) => ({
  items: [],
  selectedId: null,
  editingId: null,
  isLoading: false,
  isSaving: false,
  error: null,

  clearError: () => set({ error: null }),

  loadTerritories: async () => {
    const ctx = getActiveStoreContext();
    if (!ctx) {
      set({
        items: [],
        error: 'Cadastre uma loja ativa em Loja antes de usar Território.',
      });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const items = await territoryService.list(ctx.storeId, ctx.tenantId);
      set({ items, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: mapFeatureError(error, knownErrors) });
    }
  },

  selectTerritory: (id) => set({ selectedId: id }),

  startCreate: () => set({ editingId: 'new', selectedId: null }),

  startEdit: (id) => set({ editingId: id, selectedId: id }),

  cancelEdit: () => set({ editingId: null }),

  saveTerritory: async (input) => {
    const ctx = getActiveStoreContext();
    if (!ctx) {
      set({ error: 'Cadastre uma loja ativa em Loja antes de salvar territórios.' });
      return;
    }
    set({ isSaving: true, error: null });
    try {
      if (input.id) {
        await territoryService.update(ctx.storeId, input);
      } else {
        await territoryService.create(ctx.storeId, ctx.tenantId, input);
      }
      set({ editingId: null, isSaving: false });
      await get().loadTerritories();
    } catch (error) {
      set({ isSaving: false, error: mapFeatureError(error, knownErrors) });
    }
  },

  deleteTerritory: async (id) => {
    const ctx = getActiveStoreContext();
    if (!ctx) {
      set({ error: 'Cadastre uma loja ativa em Loja antes de excluir territórios.' });
      return;
    }
    set({ error: null });
    try {
      await territoryService.delete(ctx.storeId, id);
      const state = get();
      const nextSelected = state.selectedId === id ? null : state.selectedId;
      const nextEditing = state.editingId === id ? null : state.editingId;
      set({ selectedId: nextSelected, editingId: nextEditing });
      await get().loadTerritories();
    } catch (error) {
      set({ error: mapFeatureError(error, knownErrors) });
    }
  },
}));
