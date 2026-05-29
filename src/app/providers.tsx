import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

type ProvidersProps = {
  children: ReactNode;
};

function routerBasename(): string | undefined {
  const base = import.meta.env.BASE_URL;
  if (base === '/') {
    return undefined;
  }
  return base.replace(/\/$/, '');
}

export function Providers({ children }: ProvidersProps) {
  return <BrowserRouter basename={routerBasename()}>{children}</BrowserRouter>;
}
