import type { SyncAdapter, SyncPushPayload, SyncPushResult } from '@/core/sync/types';
import { SyncError } from '@/core/sync/types';

export class NoopSyncAdapter implements SyncAdapter {
  readonly name = 'noop';

  async push(_payload: SyncPushPayload): Promise<SyncPushResult> {
    throw new SyncError(
      'Sync em nuvem não configurado. Defina VITE_SYNC_PUSH_URL no .env (POST JSON).',
    );
  }
}
