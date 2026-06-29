'use client'
import Sidebar from './Sidebar'
import Link from 'next/link'
import { Search, Bell, Settings } from 'lucide-react'

export default function PageWrapper({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#050510'}}>
      <Sidebar/>
      <div style={{marginLeft:'240px',flex:1,display:'flex',flexDirection:'column',minHeight:'100vh'}}>
        {/* Top navbar */}
        <header style={{
          height:'56px', display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'0 32px', background:'rgba(13,13,32,0.8)', backdropFilter:'blur(12px)',
          borderBottom:'1px solid rgba(255,255,255,0.06)', position:'sticky', top:0, zIndex:40
        }}>
          <div>
            {title && <h1 style={{fontSize:'16px',fontWeight:'700',color:'white',margin:0}}>{title}</h1>}
            {subtitle && <p style={{fontSize:'12px',color:'#475569',margin:0}}>{subtitle}</p>}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <Link href="/search" style={{
              display:'flex',alignItems:'center',gap:'8px',padding:'6px 14px',
              background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',
              borderRadius:'8px',color:'#64748b',fontSize:'12px',textDecoration:'none',
              transition:'all 0.2s'
            }}>
              <Search size={13}/>
              <span>Search...</span>
              <kbd style={{background:'rgba(255,255,255,0.08)',padding:'1px 6px',borderRadius:'4px',fontSize:'10px',fontFamily:'monospace'}}>⌘K</kbd>
            </Link>
            <Link href="/notifications" style={{
              width:'36px',height:'36px',display:'flex',alignItems:'center',justifyContent:'center',
              background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',
              borderRadius:'8px',color:'#94a3b8',textDecoration:'none',transition:'all 0.2s',position:'relative'
            }}>
              <Bell size={15}/>
              <span style={{position:'absolute',top:'6px',right:'6px',width:'7px',height:'7px',borderRadius:'50%',background:'#ff2d78',border:'1.5px solid #050510'}}></span>
            </Link>
            <Link href="/settings" style={{
              width:'36px',height:'36px',display:'flex',alignItems:'center',justifyContent:'center',
              background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.08)',
              borderRadius:'8px',color:'#94a3b8',textDecoration:'none',transition:'all 0.2s'
            }}>
              <Settings size={15}/>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main style={{flex:1,padding:'28px 32px',maxWidth:'1400px',width:'100%'}}>
          {children}
        </main>

        {/* Footer */}
        <footer style={{
          padding:'16px 32px', borderTop:'1px solid rgba(255,255,255,0.05)',
          display:'flex', alignItems:'center', justifyContent:'space-between'
        }}>
          <span style={{fontSize:'11px',color:'#1e293b',fontFamily:'monospace'}}>IssueVault v1.0 — data-spark</span>
          <div style={{display:'flex',gap:'16px'}}>
            <Link href="/setup" style={{fontSize:'11px',color:'#1e293b',textDecoration:'none'}}>DB Status</Link>
            <Link href="/audit" style={{fontSize:'11px',color:'#1e293b',textDecoration:'none'}}>Audit Log</Link>
            <a href="https://github.com/shouryak3103-del/data-spark" target="_blank" style={{fontSize:'11px',color:'#1e293b',textDecoration:'none'}}>GitHub ↗</a>
          </div>
        </footer>
      </div>
    </div>
  )
}
