import { HttpJsonSyncAdapter } from '@/core/sync/adapters/http-json-sync.adapter';
import { NoopSyncAdapter } from '@/core/sync/adapters/noop-sync.adapter';
import { resolvePullUrl } from '@/core/sync/resolve-pull-url';
import type { SyncAdapter } from '@/core/sync/types';

export function createSyncAdapter(): SyncAdapter {
  const url = import.meta.env.VITE_SYNC_PUSH_URL?.trim();
  if (url) {
    const apiKey = import.meta.env.VITE_SYNC_API_KEY?.trim();
    const pullUrl = resolvePullUrl(url, import.meta.env.VITE_SYNC_PULL_URL);
    return new HttpJsonSyncAdapter(url, pullUrl, apiKey);
  }
  return new NoopSyncAdapter();
}

export function isSyncConfigured(): boolean {
  return Boolean(import.meta.env.VITE_SYNC_PUSH_URL?.trim());
}
