import { NavLink } from 'react-router-dom';
import {
  IconAnalytics,
  IconCompanies,
  IconCrm,
  IconPartnerships,
  IconStore,
  IconTerritory,
  IconVisits,
} from '@/core/layout/SidebarIcons';

const navItems = [
  { to: '/', label: 'Loja', end: true, Icon: IconStore },
  { to: '/companies', label: 'Empresas', Icon: IconCompanies },
  { to: '/territory', label: 'Território', Icon: IconTerritory },
  { to: '/crm', label: 'CRM', Icon: IconCrm },
  { to: '/visits', label: 'Visitas', Icon: IconVisits },
  { to: '/partnerships', label: 'Parcerias', Icon: IconPartnerships },
  { to: '/analytics', label: 'Analytics', Icon: IconAnalytics },
] as const;

export function Sidebar() {
  return (
    <aside className="app-sidebar">
      <div className="app-sidebar__brand">
        <span className="app-sidebar__logo" aria-hidden>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="rgb(13 148 136 / 0.2)" />
            <path
              d="M16 26s8-5.5 8-12a8 8 0 1 0-16 0c0 6.5 8 12 8 12Z"
              stroke="#2dd4bf"
              strokeWidth="1.75"
            />
            <circle cx="16" cy="14" r="2.5" fill="#2dd4bf" />
          </svg>
        </span>
        <span className="app-sidebar__brand-text">GeoGrowth</span>
      </div>

      <nav className="app-sidebar__nav" aria-label="Principal">
        {navItems.map(({ to, label, Icon, ...rest }) => (
          <NavLink
            key={to}
            to={to}
            end={'end' in rest ? rest.end : false}
            className={({ isActive }) =>
              `app-sidebar__link${isActive ? ' app-sidebar__link--active' : ''}`
            }
          >
            <Icon className="app-sidebar__link-icon" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="app-sidebar__footer">
        <div className="app-sidebar__status" title="Dados salvos localmente neste dispositivo">
          <span className="app-sidebar__status-dot" aria-hidden />
          <span>Local-first</span>
        </div>
      </div>
    </aside>
  );
}
