'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Bug, Upload, FileText, Zap, History, ChevronRight } from 'lucide-react'

const nav = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/issues', icon: Bug, label: 'Issues' },
  { href: '/actions', icon: Zap, label: 'Actions' },
  { href: '/upload', icon: Upload, label: 'Upload CSV' },
  { href: '/records', icon: FileText, label: 'Records' },
  { href: '/audit', icon: History, label: 'Audit Log' },
]

export default function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="sidebar">
      <div className="mb-8 px-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'linear-gradient(135deg,#9d00ff,#ff2d78)'}}>
            <Bug size={16} color="white"/>
          </div>
          <span style={{fontFamily:'monospace',fontWeight:'bold',color:'white',fontSize:'18px'}}>IssueVault</span>
        </div>
        <p style={{fontSize:'11px',color:'#64748b',paddingLeft:'40px'}}>Track. Fix. Ship.</p>
      </div>
      <nav>
        {nav.map(({href, icon: Icon, label}) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link key={href} href={href} className={`nav-item ${active ? 'active' : ''}`}>
              <Icon size={16}/><span>{label}</span>
              {active && <ChevronRight size={12} style={{marginLeft:'auto'}}/>}
            </Link>
          )
        })}
      </nav>
      <div style={{position:'absolute',bottom:'24px',left:'16px',right:'16px'}}>
        <div className="card" style={{padding:'12px',textAlign:'center'}}>
          <div style={{fontSize:'11px',color:'#475569',marginBottom:'4px'}}>Connected to</div>
          <div style={{fontSize:'11px',fontFamily:'monospace',color:'#00ff94',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}}>
            <span style={{width:'8px',height:'8px',borderRadius:'50%',background:'#00ff94',display:'inline-block',animation:'pulse 1.5s infinite'}}></span>
            Supabase
          </div>
        </div>
      </div>
    </aside>
  )
}
