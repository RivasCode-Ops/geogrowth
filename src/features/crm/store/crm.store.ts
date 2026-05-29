import { create } from 'zustand';
import { notifyDataChanged } from '@/core/sync/notify-data-changed';
import type { Company } from '@/features/companies/types/company';
import {
  crmService,
  CrmStoreRequiredError,
  CrmValidationError,
} from '@/features/crm/services/crm.service';
import type { DealWithCompany, DealsFilterStage, SaveDealInput } from '@/features/crm/types/deal';
import { mapFeatureError } from '@/shared/errors/mapFeatureError';
import { getActiveStoreContext } from '@/shared/store/activeStoreContext';

type CrmSliceState = {
  deals: DealWithCompany[];
  companies: Company[];
  stageFilter: DealsFilterStage;
  editingId: string | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
};

type CrmSliceActions = {
  loadDeals: () => Promise<void>;
  setStageFilter: (stage: DealsFilterStage) => void;
  startCreate: () => void;
  startEdit: (id: string) => void;
  cancelEdit: () => void;
  saveDeal: (input: SaveDealInput) => Promise<void>;
  deleteDeal: (id: string) => Promise<void>;
  clearError: () => void;
};

export type CrmSlice = CrmSliceState & CrmSliceActions;

const knownErrors = [CrmStoreRequiredError, CrmValidationError] as const;

export const useCrmStore = create<CrmSlice>((set, get) => ({
  deals: [],
  companies: [],
  stageFilter: 'all',
  editingId: null,
  isLoading: false,
  isSaving: false,
  error: null,

  clearError: () => set({ error: null }),

  loadDeals: async () => {
    const ctx = getActiveStoreContext();
    if (!ctx) {
      set({
        deals: [],
        companies: [],
        error: 'Cadastre uma loja ativa em Loja antes de usar o CRM.',
      });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const [deals, companies] = await Promise.all([
        crmService.list(ctx.storeId, ctx.tenantId, get().stageFilter),
        crmService.listCompanies(ctx.storeId),
      ]);
      set({ deals, companies, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: mapFeatureError(error, knownErrors) });
    }
  },

  setStageFilter: (stageFilter) => {
    set({ stageFilter });
    void get().loadDeals();
  },

  startCreate: () => set({ editingId: 'new' }),

  startEdit: (id) => set({ editingId: id }),

  cancelEdit: () => set({ editingId: null }),

  saveDeal: async (input) => {
    const ctx = getActiveStoreContext();
    if (!ctx) {
      set({ error: 'Cadastre uma loja ativa em Loja antes de salvar oportunidades.' });
      return;
    }
    set({ isSaving: true, error: null });
    try {
      if (input.id) {
        await crmService.update(ctx.storeId, input);
      } else {
        await crmService.create(ctx.storeId, ctx.tenantId, input);
      }
      set({ editingId: null, isSaving: false });
      await get().loadDeals();
      notifyDataChanged();
    } catch (error) {
      set({ isSaving: false, error: mapFeatureError(error, knownErrors) });
    }
  },

  deleteDeal: async (id) => {
    const ctx = getActiveStoreContext();
    if (!ctx) {
      set({ error: 'Cadastre uma loja ativa em Loja antes de excluir oportunidades.' });
      return;
    }
    set({ error: null });
    try {
      await crmService.delete(ctx.storeId, id);
      if (get().editingId === id) {
        set({ editingId: null });
      }
      await get().loadDeals();
      notifyDataChanged();
    } catch (error) {
      set({ error: mapFeatureError(error, knownErrors) });
    }
  },
}));
