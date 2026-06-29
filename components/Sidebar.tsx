'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Bug, Upload, FileText, Zap, History,
  ChevronRight, Users, BarChart3, Settings, Search, Bell, Shield, Link2
} from 'lucide-react'

const NAV: any[] = [
  { href: '/',             icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/issues',       icon: Bug,             label: 'Issues' },
  { href: '/actions',      icon: Zap,             label: 'Actions' },
  { href: '/analytics',    icon: BarChart3,       label: 'Analytics' },
  { href: '/team',         icon: Users,           label: 'Team' },
  { href: '/integrations', icon: Link2,           label: 'Integrations' },
  { href: '/integrations/n8n', icon: Zap, label: 'n8n Workflows' },
  { href: '/search',       icon: Search,          label: 'Search' },
  { href: '/notifications',icon: Bell,            label: 'Notifications' },
  { divider: true },
  { href: '/upload',  icon: Upload,  label: 'Upload CSV' },
  { href: '/records', icon: FileText,label: 'Records' },
  { href: '/audit',   icon: History, label: 'Audit Log' },
  { href: '/settings',icon: Settings,label: 'Settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="sidebar">
      <div className="mb-8 px-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#9d00ff,#ff2d78)' }}>
            <Shield size={16} color="white" />
          </div>
          <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'white', fontSize: '18px' }}>IssueVault</span>
        </div>
        <p style={{ fontSize: '11px', color: '#334155', paddingLeft: '40px' }}>Track. Fix. Ship.</p>
      </div>

      <nav>
        {NAV.map((item, i) => {
          if (item.divider) return (
            <div key={i} style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '8px 0' }} />
          )
          const { href, icon: Icon, label } = item
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} className={`nav-item ${active ? 'active' : ''}`}>
              <Icon size={15} />
              <span>{label}</span>
              {active && <ChevronRight size={12} style={{ marginLeft: 'auto' }} />}
            </Link>
          )
        })}
      </nav>

      <div style={{ position: 'absolute', bottom: '20px', left: '12px', right: '12px' }}>
        <div className="card" style={{ padding: '10px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#334155', marginBottom: '3px' }}>Connected to</div>
          <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#00ff94', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff94', display: 'inline-block' }}></span>
            Supabase
          </div>
        </div>
      </div>
    </aside>
  )
}
