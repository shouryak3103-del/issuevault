import { useLocation } from 'react-router-dom'
import { Search, Bell } from 'lucide-react'

const TITLES: Record<string,string> = {
  '/':'Dashboard', '/issues':'Issues', '/actions':'Actions', '/analytics':'Analytics',
  '/team':'Team', '/integrations':'Integrations', '/upload':'Upload CSV',
  '/records':'Records', '/audit':'Audit Log', '/notifications':'Notifications', '/settings':'Settings',
}

export function AppHeader() {
  const { pathname } = useLocation()
  const title = TITLES[pathname] ?? 'IssueVault'
  return (
    <header style={{ height:56, borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(6,6,18,0.8)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', padding:'0 24px', gap:16, flexShrink:0 }}>
      <h1 style={{ fontWeight:700, fontSize:17, color:'white', fontFamily:'"Syne",monospace', flex:1 }}>{title}</h1>
      <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:'7px 12px', width:200 }}>
        <Search size={13} color="#475569"/>
        <input placeholder="Search…" style={{ background:'none', border:'none', outline:'none', color:'#94a3b8', fontSize:13, width:'100%' }}/>
      </div>
      <button style={{ width:34, height:34, borderRadius:8, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', position:'relative' }}>
        <Bell size={15} color="#64748b"/>
        <span style={{ position:'absolute', top:6, right:6, width:6, height:6, borderRadius:'50%', background:'#ff2d78' }}/>
      </button>
      <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg,#9d00ff,#ff2d78)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'white' }}>S</div>
    </header>
  )
}
