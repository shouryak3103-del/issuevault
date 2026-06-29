import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Bug, Zap, Upload, FileText, History, Users, BarChart3, Settings, Bell, Link2, Shield, Wand2 } from 'lucide-react'

const NAV = [
  { href:'/',             icon:LayoutDashboard, label:'Dashboard',    color:'#ff2d78' },
  { href:'/issues',       icon:Bug,             label:'Issues',       color:'#ef4444' },
  { href:'/fixes',        icon:Wand2,           label:'Fix Suggestions',color:'#9d00ff' },
  { href:'/analytics',    icon:BarChart3,       label:'Analytics',    color:'#00f5ff' },
  { href:'/team',         icon:Users,           label:'Team',         color:'#9d00ff' },
  { href:'/integrations', icon:Link2,           label:'Integrations', color:'#00ff94' },
  { href:'/upload',       icon:Upload,          label:'Upload CSV',   color:'#00f5ff' },
  { href:'/records',      icon:FileText,        label:'Records',      color:'#9d00ff' },
  { href:'/audit',        icon:History,         label:'Audit Log',    color:'#00ff94' },
  { href:'/notifications',icon:Bell,            label:'Notifications',color:'#ffe600' },
  { href:'/settings',     icon:Settings,        label:'Settings',     color:'#94a3b8' },
]

export function AppSidebar() {
  const { pathname } = useLocation()
  return (
    <aside style={{ width:220, background:'rgba(255,255,255,0.015)', borderRight:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', flexShrink:0, overflowY:'auto' }}>
      {/* Logo */}
      <div style={{ padding:'22px 16px 14px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
          <div style={{ width:35, height:35, borderRadius:10, background:'linear-gradient(135deg,#9d00ff,#ff2d78)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 0 20px rgba(157,0,255,0.4)' }}>
            <Shield size={16} color="white"/>
          </div>
          <span style={{ fontWeight:800, fontSize:17, fontFamily:'monospace', background:'linear-gradient(135deg,#c084fc,#ff2d78)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>IssueVault</span>
        </div>
        <p style={{ fontSize:10, color:'#334155', paddingLeft:45, margin:0 }}>Track. Fix. Ship.</p>
      </div>

      <nav style={{ flex:1, padding:'4px 8px' }}>
        {NAV.map(item => {
          const active = item.href==='/' ? pathname==='/' : pathname.startsWith(item.href)
          return (
            <Link key={item.href} to={item.href}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, marginBottom:2, textDecoration:'none', transition:'all 0.15s',
                background: active ? `${item.color}12` : 'transparent',
                border: active ? `1px solid ${item.color}30` : '1px solid transparent' }}>
              <span style={{ width:24, height:24, borderRadius:7, background: active ? `${item.color}18` : 'rgba(255,255,255,0.04)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <item.icon size={13} color={active ? item.color : '#475569'}/>
              </span>
              <span style={{ fontSize:13, fontWeight:active?600:400, color: active ? '#e2e8f0' : '#64748b' }}>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div style={{ padding:'12px 14px 16px' }}>
        <div style={{ padding:'10px 12px', borderRadius:10, background:'rgba(157,0,255,0.08)', border:'1px solid rgba(157,0,255,0.18)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, fontWeight:700, color:'#c084fc', marginBottom:3 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#00ff94', display:'inline-block', boxShadow:'0 0 6px #00ff94' }}/>
            AI engine active
          </div>
          <p style={{ fontSize:10, color:'#334155', margin:0 }}>Last sync 2 min ago</p>
        </div>
      </div>
    </aside>
  )
}
