import { Route, Routes } from 'react-router-dom';
import { AppShell } from '@/core/layout/AppShell';
import { AnalyticsPage } from '@/features/analytics/pages/AnalyticsPage';
import { CompaniesPage } from '@/features/companies/pages/CompaniesPage';
import { CrmPage } from '@/features/crm/pages/CrmPage';
import { PartnershipsPage } from '@/features/partnerships/pages/PartnershipsPage';
import { StorePage } from '@/features/store/pages/StorePage';
import { TerritoryPage } from '@/features/territory/pages/TerritoryPage';
import { VisitsPage } from '@/features/visits/pages/VisitsPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<StorePage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="territory" element={<TerritoryPage />} />
        <Route path="crm" element={<CrmPage />} />
        <Route path="visits" element={<VisitsPage />} />
        <Route path="partnerships" element={<PartnershipsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>
    </Routes>
  );
}
