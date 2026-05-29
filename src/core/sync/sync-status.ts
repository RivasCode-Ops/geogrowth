import type { SyncStatus } from '@/core/types/sync.types';

/** Registros que ainda não foram confirmados pelo servidor. */
export const NEEDS_SYNC_STATUSES: readonly SyncStatus[] = ['local', 'pending', 'error'];

export function needsSync(status: SyncStatus): boolean {
  return NEEDS_SYNC_STATUSES.includes(status);
}
