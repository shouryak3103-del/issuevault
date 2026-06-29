import PageWrapper from '@/components/PageWrapper'
import { Link2, Check, ExternalLink } from 'lucide-react'

const INTEGRATIONS = [
  {name:'GitHub',     desc:'Two-way issue sync with repositories',     color:'#e2e8f0', status:'connected', logo:'GH'},
  {name:'Jira',       desc:'Import and sync Jira issues and sprints',   color:'#0052CC', status:'disconnected',logo:'J'},
  {name:'Linear',     desc:'Mirror issues from Linear workspaces',      color:'#5e6ad2', status:'disconnected',logo:'L'},
  {name:'Slack',      desc:'Notifications and commands via Slack',      color:'#4A154B', status:'connected',  logo:'Sl'},
  {name:'n8n',        desc:'Automate workflows with 400+ integrations', color:'#ea4b71', status:'connected',  logo:'n8'},
  {name:'Notion',     desc:'Sync issue summaries to Notion databases',  color:'#000000', status:'disconnected',logo:'N'},
]

export default function IntegrationsPage() {
  return (
    <PageWrapper title="Integrations" subtitle="Connect your tools">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
        {INTEGRATIONS.map(ig=>(
          <div key={ig.name} style={{ padding:22, borderRadius:14, background:'rgba(255,255,255,0.02)', border:`1px solid ${ig.status==='connected'?'rgba(0,255,148,0.15)':'rgba(255,255,255,0.07)'}` }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <div style={{ width:42, height:42, borderRadius:10, background:`${ig.color}22`, border:`1px solid ${ig.color}35`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'white' }}>{ig.logo}</div>
              <span style={{ fontSize:11, padding:'3px 10px', borderRadius:999, background:ig.status==='connected'?'rgba(0,255,148,0.12)':'rgba(255,255,255,0.05)', color:ig.status==='connected'?'#00ff94':'#64748b', border:`1px solid ${ig.status==='connected'?'rgba(0,255,148,0.25)':'rgba(255,255,255,0.08)'}`, fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
                {ig.status==='connected'&&<Check size={10}/>}{ig.status}
              </span>
            </div>
            <h3 style={{ fontSize:15, fontWeight:700, color:'white', marginBottom:5 }}>{ig.name}</h3>
            <p style={{ fontSize:13, color:'#64748b', lineHeight:1.5, marginBottom:16 }}>{ig.desc}</p>
            <button style={{ width:'100%', padding:'9px', borderRadius:9, cursor:'pointer', fontSize:13, fontWeight:600, transition:'all 0.2s', border:'none',
              background:ig.status==='connected'?'rgba(255,255,255,0.05)':'linear-gradient(135deg,#9d00ff,#ff2d78)',
              color:ig.status==='connected'?'#64748b':'white' }}>
              {ig.status==='connected'?'Disconnect':'Connect'}
            </button>
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}
