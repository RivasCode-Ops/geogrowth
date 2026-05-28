import { useStoreStore } from '@/features/store/store/store.store';

export type ActiveStoreContext = {
  storeId: string;
  tenantId: string;
};

export function getActiveStoreContext(): ActiveStoreContext | null {
  const active = useStoreStore.getState().activeStore;
  if (!active?.storeId || !active.tenantId) {
    return null;
  }
  return { storeId: active.storeId, tenantId: active.tenantId };
}
