import type { BackupPayload } from '@/core/backup/exportBackup';

export type SyncPushPayload = BackupPayload & {
  tenantId: string;
  storeId: string;
  pendingTotal: number;
};

export type SyncPushResult = {
  ok: true;
  message: string;
  pushedAt: string;
};

export type SyncAdapter = {
  readonly name: string;
  push(payload: SyncPushPayload): Promise<SyncPushResult>;
};

export type SyncSummary = {
  total: number;
  byTable: {
    stores: number;
    companies: number;
    territories: number;
    deals: number;
    visits: number;
    partnerships: number;
  };
};

export class SyncError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SyncError';
  }
}
