import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Public marketing pages (no sidebar)
import LandingPage    from '@/pages/landing'
import PricingPage    from '@/pages/pricing'
import LoginPage      from '@/pages/login'
import SignupPage     from '@/pages/signup'
import AboutPage      from '@/pages/about'
import DocsPage       from '@/pages/docs'
import BlogPage       from '@/pages/blog'
import ContactPage    from '@/pages/contact'

// App layout
import { AppSidebar }    from '@/components/app-sidebar'
import { AppHeader }     from '@/components/app-header'

// App pages (with sidebar)
import Dashboard         from '@/pages/dashboard'
import IssuesPage        from '@/pages/issues'
import FixesPage         from '@/pages/fixes'
import UploadPage        from '@/pages/upload'
import RecordsPage       from '@/pages/records'
import AuditPage         from '@/pages/audit'
import TeamPage          from '@/pages/team'
import AnalyticsPage     from '@/pages/analytics'
import NotificationsPage from '@/pages/notifications'
import SettingsPage      from '@/pages/settings'
import IntegrationsPage  from '@/pages/integrations'

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#060612', color:'#e2e8f0', fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif' }}>
      <AppSidebar />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>
        <AppHeader />
        <main style={{ flex:1, padding:'28px 24px', overflowY:'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public marketing pages (no sidebar) ── */}
        <Route path="/landing"  element={<LandingPage />} />
        <Route path="/pricing"  element={<PricingPage />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/signup"   element={<SignupPage />} />
        <Route path="/about"    element={<AboutPage />} />
        <Route path="/docs"     element={<DocsPage />} />
        <Route path="/blog"     element={<BlogPage />} />
        <Route path="/contact"  element={<ContactPage />} />

        {/* ── App pages (with sidebar) ── */}
        <Route path="/"              element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/issues"        element={<AppLayout><IssuesPage /></AppLayout>} />
        <Route path="/fixes"         element={<AppLayout><FixesPage /></AppLayout>} />
        <Route path="/analytics"     element={<AppLayout><AnalyticsPage /></AppLayout>} />
        <Route path="/upload"        element={<AppLayout><UploadPage /></AppLayout>} />
        <Route path="/records"       element={<AppLayout><RecordsPage /></AppLayout>} />
        <Route path="/audit"         element={<AppLayout><AuditPage /></AppLayout>} />
        <Route path="/team"          element={<AppLayout><TeamPage /></AppLayout>} />
        <Route path="/integrations"  element={<AppLayout><IntegrationsPage /></AppLayout>} />
        <Route path="/notifications" element={<AppLayout><NotificationsPage /></AppLayout>} />
        <Route path="/settings"      element={<AppLayout><SettingsPage /></AppLayout>} />
        <Route path="*"              element={<Navigate to="/landing" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
