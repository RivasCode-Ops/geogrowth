export type SyncStatus = 'local' | 'pending' | 'synced' | 'error';

export const SYNC_STATUSES: readonly SyncStatus[] = [
  'local',
  'pending',
  'synced',
  'error',
] as const;
