import { create } from 'zustand';
import {
  companiesService,
  CompanyStoreRequiredError,
  CompanyValidationError,
} from '@/features/companies/services/companies.service';
import type {
  CompaniesFilters,
  Company,
  SaveCompanyInput,
} from '@/features/companies/types/company';
import { defaultCompaniesFilters } from '@/features/companies/types/company';
import { useStoreStore } from '@/features/store/store/store.store';

type CompaniesSliceState = {
  items: Company[];
  filters: CompaniesFilters;
  editingId: string | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
};

type CompaniesSliceActions = {
  loadCompanies: () => Promise<void>;
  setFilters: (filters: CompaniesFilters) => void;
  startCreate: () => void;
  startEdit: (id: string) => void;
  cancelEdit: () => void;
  saveCompany: (input: SaveCompanyInput) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  clearError: () => void;
};

export type CompaniesSlice = CompaniesSliceState & CompaniesSliceActions;

function getActiveStoreContext(): { storeId: string; tenantId: string } | null {
  const active = useStoreStore.getState().activeStore;
  if (!active?.storeId || !active.tenantId) {
    return null;
  }
  return { storeId: active.storeId, tenantId: active.tenantId };
}

function mapError(error: unknown): string {
  if (error instanceof CompanyStoreRequiredError || error instanceof CompanyValidationError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ocorreu um erro inesperado.';
}

export const useCompaniesStore = create<CompaniesSlice>((set, get) => ({
  items: [],
  filters: defaultCompaniesFilters,
  editingId: null,
  isLoading: false,
  isSaving: false,
  error: null,

  clearError: () => set({ error: null }),

  loadCompanies: async () => {
    const ctx = getActiveStoreContext();
    if (!ctx) {
      set({ items: [], error: 'Cadastre uma loja ativa em Loja antes de usar Empresas.' });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const items = await companiesService.list(ctx.storeId, ctx.tenantId, get().filters);
      set({ items, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: mapError(error) });
    }
  },

  setFilters: (filters) => {
    set({ filters });
    void get().loadCompanies();
  },

  startCreate: () => set({ editingId: 'new' }),

  startEdit: (id) => set({ editingId: id }),

  cancelEdit: () => set({ editingId: null }),

  saveCompany: async (input) => {
    const ctx = getActiveStoreContext();
    if (!ctx) {
      set({ error: 'Cadastre uma loja ativa em Loja antes de salvar empresas.' });
      return;
    }
    set({ isSaving: true, error: null });
    try {
      if (input.id) {
        await companiesService.update(ctx.storeId, input);
      } else {
        await companiesService.create(ctx.storeId, ctx.tenantId, input);
      }
      set({ editingId: null, isSaving: false });
      await get().loadCompanies();
    } catch (error) {
      set({ isSaving: false, error: mapError(error) });
    }
  },

  deleteCompany: async (id) => {
    const ctx = getActiveStoreContext();
    if (!ctx) {
      set({ error: 'Cadastre uma loja ativa em Loja antes de excluir empresas.' });
      return;
    }
    set({ error: null });
    try {
      await companiesService.delete(ctx.storeId, id);
      const { editingId } = get();
      if (editingId === id) {
        set({ editingId: null });
      }
      await get().loadCompanies();
    } catch (error) {
      set({ error: mapError(error) });
    }
  },
}));
