import { useSyncStore } from '@/core/sync/sync.store';

/** Atualiza contagem de pendências na topbar após mutações locais. */
export function notifyDataChanged(): void {
  void useSyncStore.getState().refreshSummary();
}
