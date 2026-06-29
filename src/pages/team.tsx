import PageWrapper from '@/components/PageWrapper'
import { Mail, Clock, CheckCircle, AlertTriangle, Plus } from 'lucide-react'

const TEAM = [
  {name:'Maya Rodriguez', role:'Data Lead',        email:'maya@acme.com',   avatar:'MR', fixed:128, pending:14, lastActive:'2 min ago',   grad:'linear-gradient(135deg,#9d00ff,#ff2d78)'},
  {name:'Devon Kim',      role:'Data Engineer',    email:'devon@acme.com',  avatar:'DK', fixed:94,  pending:8,  lastActive:'1 hr ago',    grad:'linear-gradient(135deg,#00f5ff,#9d00ff)'},
  {name:'Priya Shah',     role:'QA Analyst',       email:'priya@acme.com',  avatar:'PS', fixed:67,  pending:22, lastActive:'3 hr ago',    grad:'linear-gradient(135deg,#f97316,#ff2d78)'},
  {name:'Luca Bianchi',   role:'Backend Engineer', email:'luca@acme.com',   avatar:'LB', fixed:43,  pending:5,  lastActive:'Yesterday',   grad:'linear-gradient(135deg,#ffe600,#00f5ff)'},
]

export default function TeamPage() {
  return (
    <PageWrapper title="Team" subtitle="4 members" action={
      <button style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 18px', borderRadius:10, background:'linear-gradient(135deg,#9d00ff,#ff2d78)', color:'white', border:'none', cursor:'pointer', fontSize:13, fontWeight:600 }}><Plus size={15}/>Invite</button>}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
        {TEAM.map(m => (
          <div key={m.name} style={{ padding:22, borderRadius:14, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', transition:'all 0.2s' }}>
            <div style={{ width:52, height:52, borderRadius:14, background:m.grad, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700, color:'white', marginBottom:14 }}>{m.avatar}</div>
            <h3 style={{ fontSize:15, fontWeight:700, color:'white', margin:'0 0 4px' }}>{m.name}</h3>
            <p style={{ fontSize:12, color:'#9d00ff', fontWeight:600, margin:'0 0 10px', display:'inline-block', padding:'2px 8px', borderRadius:999, background:'rgba(157,0,255,0.1)', border:'1px solid rgba(157,0,255,0.25)' }}>{m.role}</p>
            <p style={{ fontSize:12, color:'#475569', margin:'0 0 14px', display:'flex', alignItems:'center', gap:5 }}><Mail size={11}/>{m.email}</p>
            <div style={{ marginBottom:8 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, fontWeight:600, marginBottom:5 }}>
                <span style={{ color:'#00ff94' }}>{m.fixed} fixed</span><span style={{ color:'#64748b' }}>{m.pending} pending</span>
              </div>
              <div style={{ height:5, borderRadius:999, background:'rgba(255,255,255,0.08)', overflow:'hidden' }}>
                <div style={{ height:'100%', borderRadius:999, background:'linear-gradient(90deg,#9d00ff,#00ff94)', width:`${(m.fixed/(m.fixed+m.pending))*100}%` }}/>
              </div>
            </div>
            <p style={{ fontSize:11, color:'#334155', display:'flex', alignItems:'center', gap:5, margin:0 }}><Clock size={11}/>{m.lastActive}</p>
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}
