import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppSidebar }       from '@/components/app-sidebar'
import { AppHeader }        from '@/components/app-header'
import Dashboard            from '@/pages/dashboard'
import IssuesPage           from '@/pages/issues'
import FixesPage            from '@/pages/fixes'
import UploadPage           from '@/pages/upload'
import RecordsPage          from '@/pages/records'
import AuditPage            from '@/pages/audit'
import TeamPage             from '@/pages/team'
import AnalyticsPage        from '@/pages/analytics'
import NotificationsPage    from '@/pages/notifications'
import SettingsPage         from '@/pages/settings'
import IntegrationsPage     from '@/pages/integrations'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display:'flex', minHeight:'100vh', background:'#060612', color:'#e2e8f0', fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif' }}>
        <AppSidebar />
        <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>
          <AppHeader />
          <main style={{ flex:1, padding:'28px 24px', overflowY:'auto' }}>
            <Routes>
              <Route path="/"              element={<Dashboard />} />
              <Route path="/issues"        element={<IssuesPage />} />
              <Route path="/fixes"         element={<FixesPage />} />
              <Route path="/analytics"     element={<AnalyticsPage />} />
              <Route path="/upload"        element={<UploadPage />} />
              <Route path="/records"       element={<RecordsPage />} />
              <Route path="/audit"         element={<AuditPage />} />
              <Route path="/team"          element={<TeamPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/settings"      element={<SettingsPage />} />
              <Route path="/integrations"  element={<IntegrationsPage />} />
              <Route path="*"              element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
