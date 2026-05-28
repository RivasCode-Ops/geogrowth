import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import '@/core/theme/tokens.css';
import '@/index.css';
import { registerAppServiceWorker } from '@/pwa/registerSW';

registerAppServiceWorker();

const root = document.getElementById('root');
if (!root) {
  throw new Error('Elemento #root não encontrado');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
