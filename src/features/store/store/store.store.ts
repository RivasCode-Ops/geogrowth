import { create } from 'zustand';
import { storeService, StoreValidationError } from '@/features/store/services/store.service';
import type { SaveStoreInput, Store } from '@/features/store/types/store';

type StoreSliceState = {
  activeStore: Store | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
};

type StoreSliceActions = {
  loadActiveStore: () => Promise<void>;
  saveStore: (input: SaveStoreInput) => Promise<void>;
  clearError: () => void;
};

export type StoreSlice = StoreSliceState & StoreSliceActions;

export const useStoreStore = create<StoreSlice>((set) => ({
  activeStore: null,
  isLoading: false,
  isSaving: false,
  error: null,

  clearError: () => set({ error: null }),

  loadActiveStore: async () => {
    set({ isLoading: true, error: null });
    try {
      const activeStore = await storeService.getActiveStore();
      set({ activeStore, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Não foi possível carregar a loja.';
      set({ isLoading: false, error: message });
    }
  },

  saveStore: async (input) => {
    set({ isSaving: true, error: null });
    try {
      const activeStore = await storeService.saveStore(input);
      set({ activeStore, isSaving: false });
    } catch (error) {
      const message =
        error instanceof StoreValidationError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'Não foi possível salvar a loja.';
      set({ isSaving: false, error: message });
    }
  },
}));

export const selectActiveStoreId = (state: StoreSlice): string | null =>
  state.activeStore?.storeId ?? null;

export const selectActiveTenantId = (state: StoreSlice): string | null =>
  state.activeStore?.tenantId ?? null;
