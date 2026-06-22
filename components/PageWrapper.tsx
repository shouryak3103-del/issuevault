'use client'
import Sidebar from './Sidebar'

export default function PageWrapper({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div style={{display:'flex',minHeight:'100vh'}}>
      <Sidebar/>
      <main style={{marginLeft:'240px',flex:1,padding:'32px'}}>
        <div style={{marginBottom:'32px'}}>
          <h1 style={{fontSize:'24px',fontWeight:'bold'}} className="gradient-header">{title}</h1>
          {subtitle && <p style={{color:'#64748b',fontSize:'14px',marginTop:'4px'}}>{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  )
}
