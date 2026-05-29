import type { SyncAdapter, SyncPushPayload, SyncPushResult } from '@/core/sync/types';
import { SyncError } from '@/core/sync/types';
import { nowIso } from '@/core/utils/timestamps';

export class HttpJsonSyncAdapter implements SyncAdapter {
  readonly name = 'http-json';

  constructor(private readonly pushUrl: string) {}

  async push(payload: SyncPushPayload): Promise<SyncPushResult> {
    let response: Response;
    try {
      response = await fetch(this.pushUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new SyncError('Falha de rede ao enviar dados para o servidor.');
    }

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new SyncError(
        `Servidor respondeu ${response.status}${detail ? `: ${detail.slice(0, 120)}` : ''}.`,
      );
    }

    return {
      ok: true,
      message: 'Dados enviados ao servidor.',
      pushedAt: nowIso(),
    };
  }
}
