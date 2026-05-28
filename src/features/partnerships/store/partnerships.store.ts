import { create } from 'zustand';
import type { Company } from '@/features/companies/types/company';
import {
  partnershipsService,
  PartnershipStoreRequiredError,
  PartnershipValidationError,
} from '@/features/partnerships/services/partnerships.service';
import type {
  PartnershipsFilterType,
  PartnershipWithCompany,
  SavePartnershipInput,
} from '@/features/partnerships/types/partnership';
import { mapFeatureError } from '@/shared/errors/mapFeatureError';
import { getActiveStoreContext } from '@/shared/store/activeStoreContext';

type PartnershipsSliceState = {
  items: PartnershipWithCompany[];
  companies: Company[];
  typeFilter: PartnershipsFilterType;
  editingId: string | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
};

type PartnershipsSliceActions = {
  loadPartnerships: () => Promise<void>;
  setTypeFilter: (type: PartnershipsFilterType) => void;
  startCreate: () => void;
  startEdit: (id: string) => void;
  cancelEdit: () => void;
  savePartnership: (input: SavePartnershipInput) => Promise<void>;
  deletePartnership: (id: string) => Promise<void>;
  clearError: () => void;
};

export type PartnershipsSlice = PartnershipsSliceState & PartnershipsSliceActions;

const knownErrors = [PartnershipStoreRequiredError, PartnershipValidationError] as const;

export const usePartnershipsStore = create<PartnershipsSlice>((set, get) => ({
  items: [],
  companies: [],
  typeFilter: 'all',
  editingId: null,
  isLoading: false,
  isSaving: false,
  error: null,

  clearError: () => set({ error: null }),

  loadPartnerships: async () => {
    const ctx = getActiveStoreContext();
    if (!ctx) {
      set({
        items: [],
        companies: [],
        error: 'Cadastre uma loja ativa em Loja antes de usar Parcerias.',
      });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const [items, companies] = await Promise.all([
        partnershipsService.list(ctx.storeId, ctx.tenantId, get().typeFilter),
        partnershipsService.listCompanies(ctx.storeId),
      ]);
      set({ items, companies, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: mapFeatureError(error, knownErrors) });
    }
  },

  setTypeFilter: (typeFilter) => {
    set({ typeFilter });
    void get().loadPartnerships();
  },

  startCreate: () => set({ editingId: 'new' }),

  startEdit: (id) => set({ editingId: id }),

  cancelEdit: () => set({ editingId: null }),

  savePartnership: async (input) => {
    const ctx = getActiveStoreContext();
    if (!ctx) {
      set({ error: 'Cadastre uma loja ativa em Loja antes de salvar parcerias.' });
      return;
    }
    set({ isSaving: true, error: null });
    try {
      if (input.id) {
        await partnershipsService.update(ctx.storeId, input);
      } else {
        await partnershipsService.create(ctx.storeId, ctx.tenantId, input);
      }
      set({ editingId: null, isSaving: false });
      await get().loadPartnerships();
    } catch (error) {
      set({ isSaving: false, error: mapFeatureError(error, knownErrors) });
    }
  },

  deletePartnership: async (id) => {
    const ctx = getActiveStoreContext();
    if (!ctx) {
      set({ error: 'Cadastre uma loja ativa em Loja antes de excluir parcerias.' });
      return;
    }
    set({ error: null });
    try {
      await partnershipsService.delete(ctx.storeId, id);
      if (get().editingId === id) {
        set({ editingId: null });
      }
      await get().loadPartnerships();
    } catch (error) {
      set({ error: mapFeatureError(error, knownErrors) });
    }
  },
}));
