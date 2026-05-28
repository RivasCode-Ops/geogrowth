import { registerSW } from 'virtual:pwa-register';

export function registerAppServiceWorker(): void {
  registerSW({
    immediate: true,
    onOfflineReady() {
      console.info('[GeoGrowth] App pronto para uso offline.');
    },
  });
}
