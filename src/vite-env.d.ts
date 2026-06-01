/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_SYNC_PUSH_URL?: string;
  readonly VITE_SYNC_PULL_URL?: string;
  readonly VITE_SYNC_API_KEY?: string;
}
