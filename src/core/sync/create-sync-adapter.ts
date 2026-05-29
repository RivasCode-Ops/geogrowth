import { HttpJsonSyncAdapter } from '@/core/sync/adapters/http-json-sync.adapter';
import { NoopSyncAdapter } from '@/core/sync/adapters/noop-sync.adapter';
import type { SyncAdapter } from '@/core/sync/types';

export function createSyncAdapter(): SyncAdapter {
  const url = import.meta.env.VITE_SYNC_PUSH_URL?.trim();
  if (url) {
    return new HttpJsonSyncAdapter(url);
  }
  return new NoopSyncAdapter();
}

export function isSyncConfigured(): boolean {
  return Boolean(import.meta.env.VITE_SYNC_PUSH_URL?.trim());
}
