import { Outlet } from 'react-router-dom';
import { Header } from '@/core/layout/Header';
import { Sidebar } from '@/core/layout/Sidebar';
import '@/core/layout/layout.css';

export function AppShell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__main">
        <Header />
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
