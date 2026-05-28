import { useLocation } from 'react-router-dom';

const titles: Record<string, string> = {
  '/': 'Loja',
  '/companies': 'Empresas',
  '/territory': 'Território',
  '/crm': 'CRM',
  '/visits': 'Visitas',
  '/partnerships': 'Parcerias',
  '/analytics': 'Analytics',
};

export function Header() {
  const { pathname } = useLocation();
  const title = titles[pathname] ?? 'GeoGrowth';

  return (
    <header className="app-header">
      <h1 className="app-header__title">{title}</h1>
    </header>
  );
}
