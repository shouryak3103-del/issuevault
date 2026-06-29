import { MktNav } from '@/components/MktNav'
import { MktFooter } from '@/components/MktFooter'
import { Book, Code2, Zap, Link2 } from 'lucide-react'

const SECTIONS = [
  { icon:Book,  color:'#9d00ff', title:'Getting started', items:['Quick start guide','Connecting GitHub','Inviting your team','Uploading your first CSV'] },
  { icon:Code2, color:'#00f5ff', title:'REST API',         items:['Authentication','List issues','Create issue','Webhooks'] },
  { icon:Zap,   color:'#ff2d78', title:'Integrations',    items:['GitHub sync setup','Jira sync setup','n8n automation guide','Slack notifications'] },
  { icon:Link2, color:'#00ff94', title:'Guides',           items:['Role-based access','Audit log export','CSV data format','SSO / SAML setup'] },
]

export default function DocsPage() {
  return (
    <div style={{ background:'#060612', color:'#e2e8f0', minHeight:'100vh', fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif' }}>
      <MktNav/>
      <section style={{ padding:'140px 24px 80px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ maxWidth:600, marginBottom:56 }}>
          <h1 style={{ fontSize:44, fontWeight:900, margin:'0 0 12px', letterSpacing:'-1.5px' }}>Documentation</h1>
          <p style={{ fontSize:17, color:'#64748b', margin:'0 0 24px', lineHeight:1.7 }}>Everything you need to get IssueVault working for your team.</p>
          <div style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:11, padding:'12px 16px' }}>
            <Book size={15} color="#64748b"/>
            <input placeholder="Search docs…" style={{ background:'none', border:'none', outline:'none', color:'#94a3b8', fontSize:14, flex:1 }}/>
            <span style={{ fontSize:11, padding:'2px 8px', borderRadius:5, background:'rgba(255,255,255,0.07)', color:'#475569', fontFamily:'monospace' }}>⌘K</span>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:20 }}>
          {SECTIONS.map(({ icon:Icon, color, title, items }) => (
            <div key={title} style={{ padding:28, borderRadius:16, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ width:42, height:42, borderRadius:11, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                <Icon size={18} color={color}/>
              </div>
              <h3 style={{ fontSize:16, fontWeight:700, color:'white', margin:'0 0 14px' }}>{title}</h3>
              {items.map(item => (
                <a key={item} href="#" style={{ display:'block', fontSize:13, color:'#64748b', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', textDecoration:'none', transition:'color 0.15s' }}
                  onMouseEnter={e=>(e.currentTarget.style.color='#c084fc')} onMouseLeave={e=>(e.currentTarget.style.color='#64748b')}>
                  {item} →
                </a>
              ))}
            </div>
          ))}
        </div>
      </section>
      <MktFooter/>
    </div>
  )
}
