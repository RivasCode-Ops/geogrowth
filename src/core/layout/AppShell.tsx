import { Outlet } from 'react-router-dom';
import { AppTopbar } from '@/core/layout/AppTopbar';
import { Sidebar } from '@/core/layout/Sidebar';
import '@/core/layout/layout.css';

export function AppShell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__main">
        <AppTopbar />
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
