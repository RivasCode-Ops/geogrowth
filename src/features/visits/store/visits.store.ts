import { create } from 'zustand';
import { notifyDataChanged } from '@/core/sync/notify-data-changed';
import type { Company } from '@/features/companies/types/company';
import {
  visitsService,
  VisitStoreRequiredError,
  VisitValidationError,
} from '@/features/visits/services/visits.service';
import type {
  SaveVisitInput,
  VisitsFilterStatus,
  VisitWithCompany,
} from '@/features/visits/types/visit';
import { mapFeatureError } from '@/shared/errors/mapFeatureError';
import { getActiveStoreContext } from '@/shared/store/activeStoreContext';

type VisitsSliceState = {
  visits: VisitWithCompany[];
  companies: Company[];
  statusFilter: VisitsFilterStatus;
  editingId: string | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
};

type VisitsSliceActions = {
  loadVisits: () => Promise<void>;
  setStatusFilter: (status: VisitsFilterStatus) => void;
  startCreate: () => void;
  startEdit: (id: string) => void;
  cancelEdit: () => void;
  saveVisit: (input: SaveVisitInput) => Promise<void>;
  deleteVisit: (id: string) => Promise<void>;
  clearError: () => void;
};

export type VisitsSlice = VisitsSliceState & VisitsSliceActions;

const knownErrors = [VisitStoreRequiredError, VisitValidationError] as const;

export const useVisitsStore = create<VisitsSlice>((set, get) => ({
  visits: [],
  companies: [],
  statusFilter: 'all',
  editingId: null,
  isLoading: false,
  isSaving: false,
  error: null,

  clearError: () => set({ error: null }),

  loadVisits: async () => {
    const ctx = getActiveStoreContext();
    if (!ctx) {
      set({
        visits: [],
        companies: [],
        error: 'Cadastre uma loja ativa em Loja antes de usar Visitas.',
      });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const [visits, companies] = await Promise.all([
        visitsService.list(ctx.storeId, ctx.tenantId, get().statusFilter),
        visitsService.listCompanies(ctx.storeId),
      ]);
      set({ visits, companies, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: mapFeatureError(error, knownErrors) });
    }
  },

  setStatusFilter: (statusFilter) => {
    set({ statusFilter });
    void get().loadVisits();
  },

  startCreate: () => set({ editingId: 'new' }),

  startEdit: (id) => set({ editingId: id }),

  cancelEdit: () => set({ editingId: null }),

  saveVisit: async (input) => {
    const ctx = getActiveStoreContext();
    if (!ctx) {
      set({ error: 'Cadastre uma loja ativa em Loja antes de salvar visitas.' });
      return;
    }
    set({ isSaving: true, error: null });
    try {
      if (input.id) {
        await visitsService.update(ctx.storeId, input);
      } else {
        await visitsService.create(ctx.storeId, ctx.tenantId, input);
      }
      set({ editingId: null, isSaving: false });
      await get().loadVisits();
      notifyDataChanged();
    } catch (error) {
      set({ isSaving: false, error: mapFeatureError(error, knownErrors) });
    }
  },

  deleteVisit: async (id) => {
    const ctx = getActiveStoreContext();
    if (!ctx) {
      set({ error: 'Cadastre uma loja ativa em Loja antes de excluir visitas.' });
      return;
    }
    set({ error: null });
    try {
      await visitsService.delete(ctx.storeId, id);
      if (get().editingId === id) {
        set({ editingId: null });
      }
      await get().loadVisits();
      notifyDataChanged();
    } catch (error) {
      set({ error: mapFeatureError(error, knownErrors) });
    }
  },
}));
