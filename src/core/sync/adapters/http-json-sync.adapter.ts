import { isSyncPushPayload } from '@/core/sync/sync-merge.repository';
import type { SyncAdapter, SyncPullResult, SyncPushPayload, SyncPushResult } from '@/core/sync/types';
import { SyncError } from '@/core/sync/types';
import { nowIso } from '@/core/utils/timestamps';

export class HttpJsonSyncAdapter implements SyncAdapter {
  readonly name = 'http-json';

  constructor(
    private readonly pushUrl: string,
    private readonly pullUrl: string,
    private readonly apiKey?: string,
  ) {}

  private buildHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    const key = this.apiKey?.trim();
    if (key) {
      headers['X-API-Key'] = key;
    }
    return headers;
  }

  private authHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };
    const key = this.apiKey?.trim();
    if (key) {
      headers['X-API-Key'] = key;
    }
    return headers;
  }

  async push(payload: SyncPushPayload): Promise<SyncPushResult> {
    let response: Response;
    try {
      response = await fetch(this.pushUrl, {
        method: 'POST',
        headers: this.buildHeaders(),
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

  async pull(tenantId: string, storeId: string): Promise<SyncPullResult> {
    const url = new URL(this.pullUrl);
    url.searchParams.set('tenantId', tenantId);
    url.searchParams.set('storeId', storeId);

    let response: Response;
    try {
      response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.authHeaders(),
      });
    } catch {
      throw new SyncError('Falha de rede ao baixar dados do servidor.');
    }

    if (response.status === 404) {
      throw new SyncError('Nenhum dado no servidor para esta loja. Envie primeiro (Enviar).');
    }

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      throw new SyncError(
        `Servidor respondeu ${response.status}${detail ? `: ${detail.slice(0, 120)}` : ''}.`,
      );
    }

    const body: unknown = await response.json();
    if (
      typeof body !== 'object' ||
      body === null ||
      !('payload' in body) ||
      !isSyncPushPayload((body as { payload: unknown }).payload)
    ) {
      throw new SyncError('Resposta de pull inválida do servidor.');
    }

    return {
      ok: true,
      message: 'Dados recebidos do servidor.',
      pulledAt: nowIso(),
      payload: (body as { payload: SyncPushPayload }).payload,
    };
  }
}
