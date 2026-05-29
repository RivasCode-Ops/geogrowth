import { create } from 'zustand';
import { isSyncConfigured } from '@/core/sync/create-sync-adapter';
import { syncService } from '@/core/sync/sync.service';
import type { SyncSummary } from '@/core/sync/types';
import { SyncError } from '@/core/sync/types';

type SyncState = {
  isConfigured: boolean;
  isSyncing: boolean;
  summary: SyncSummary | null;
  lastMessage: string | null;
  error: string | null;
  refreshSummary: () => Promise<void>;
  pushNow: () => Promise<void>;
};

const emptySummary: SyncSummary = {
  total: 0,
  byTable: {
    stores: 0,
    companies: 0,
    territories: 0,
    deals: 0,
    visits: 0,
    partnerships: 0,
  },
};

export const useSyncStore = create<SyncState>((set) => ({
  isConfigured: isSyncConfigured(),
  isSyncing: false,
  summary: null,
  lastMessage: null,
  error: null,

  refreshSummary: async () => {
    set({ error: null });
    try {
      const { storeId } = await syncService.getActiveStoreScope();
      const summary = await syncService.getPendingSummary(storeId);
      set({ summary, isConfigured: isSyncConfigured() });
    } catch (err) {
      const message = err instanceof SyncError ? err.message : 'Não foi possível ler pendências.';
      set({ summary: emptySummary, error: message });
    }
  },

  pushNow: async () => {
    set({ isSyncing: true, error: null });
    try {
      const result = await syncService.pushActiveStore();
      set({
        isSyncing: false,
        summary: result.summary,
        lastMessage: result.message,
        isConfigured: isSyncConfigured(),
      });
    } catch (err) {
      const message =
        err instanceof SyncError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Falha ao sincronizar.';
      set({ isSyncing: false, error: message });
      try {
        const { storeId } = await syncService.getActiveStoreScope();
        const summary = await syncService.getPendingSummary(storeId);
        set({ summary });
      } catch {
        /* ignore */
      }
    }
  },
}));
