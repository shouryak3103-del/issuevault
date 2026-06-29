import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Bug, Upload, FileText, Zap, History, Users, BarChart3, Settings, Bell, Link2, Shield } from 'lucide-react'

const NAV = [
  { href:'/',             icon:LayoutDashboard, label:'Dashboard',    accent:'#ff2d78' },
  { href:'/issues',       icon:Bug,             label:'Issues',       accent:'#ef4444' },
  { href:'/actions',      icon:Zap,             label:'Actions',      accent:'#ffe600' },
  { href:'/analytics',    icon:BarChart3,        label:'Analytics',    accent:'#00f5ff' },
  { href:'/team',         icon:Users,           label:'Team',         accent:'#9d00ff' },
  { href:'/integrations', icon:Link2,           label:'Integrations', accent:'#00ff94' },
  { href:'/upload',       icon:Upload,          label:'Upload CSV',   accent:'#00f5ff' },
  { href:'/records',      icon:FileText,        label:'Records',      accent:'#9d00ff' },
  { href:'/audit',        icon:History,         label:'Audit Log',    accent:'#00ff94' },
  { href:'/notifications',icon:Bell,            label:'Notifications',accent:'#ffe600' },
  { href:'/settings',     icon:Settings,        label:'Settings',     accent:'#94a3b8' },
]

export function AppSidebar() {
  const { pathname } = useLocation()
  return (
    <aside style={{ width:220, background:'rgba(255,255,255,0.02)', borderRight:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', flexShrink:0 }}>
      <div style={{ padding:'20px 16px 12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:'linear-gradient(135deg,#9d00ff,#ff2d78)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Shield size={16} color="white"/>
          </div>
          <span style={{ fontWeight:800, fontSize:17, fontFamily:'monospace', background:'linear-gradient(135deg,#9d00ff,#ff2d78)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>IssueVault</span>
        </div>
        <p style={{ fontSize:10, color:'#334155', paddingLeft:44 }}>Track. Fix. Ship.</p>
      </div>
      <nav style={{ flex:1, padding:'4px 8px', overflowY:'auto' }}>
        {NAV.map(item => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          return (
            <Link key={item.href} to={item.href} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, marginBottom:2, textDecoration:'none', transition:'all 0.15s',
              background: active ? `${item.accent}15` : 'transparent',
              border: active ? `1px solid ${item.accent}35` : '1px solid transparent' }}>
              <span style={{ width:22, height:22, borderRadius:7, background: active ? `${item.accent}20` : 'rgba(255,255,255,0.04)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <item.icon size={13} color={active ? item.accent : '#475569'}/>
              </span>
              <span style={{ fontSize:13, fontWeight:active?600:500, color: active ? '#e2e8f0' : '#64748b' }}>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div style={{ padding:'12px 16px' }}>
        <div style={{ padding:'10px 12px', borderRadius:10, background:'rgba(157,0,255,0.1)', border:'1px solid rgba(157,0,255,0.2)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, fontWeight:600, color:'#9d00ff' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#00ff94', display:'inline-block' }}/>AI engine active
          </div>
          <p style={{ fontSize:10, color:'#334155', marginTop:3 }}>Last sync 2 min ago</p>
        </div>
      </div>
    </aside>
  )
}
