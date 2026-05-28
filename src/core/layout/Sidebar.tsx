import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Loja', end: true },
  { to: '/companies', label: 'Empresas' },
  { to: '/territory', label: 'Território' },
  { to: '/crm', label: 'CRM' },
  { to: '/visits', label: 'Visitas' },
  { to: '/partnerships', label: 'Parcerias' },
  { to: '/analytics', label: 'Analytics' },
] as const;

export function Sidebar() {
  return (
    <aside className="app-sidebar">
      <p className="app-sidebar__brand">GeoGrowth</p>
      <nav className="app-sidebar__nav" aria-label="Principal">
        {navItems.map(({ to, label, ...rest }) => (
          <NavLink
            key={to}
            to={to}
            end={'end' in rest ? rest.end : false}
            className={({ isActive }) =>
              `app-sidebar__link${isActive ? ' app-sidebar__link--active' : ''}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
