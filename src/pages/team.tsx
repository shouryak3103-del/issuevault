import { team } from '@/lib/mock-data'
import { Mail, Clock, Plus } from 'lucide-react'

const GRADS = ['linear-gradient(135deg,#9d00ff,#ff2d78)','linear-gradient(135deg,#00f5ff,#9d00ff)','linear-gradient(135deg,#f97316,#ff2d78)','linear-gradient(135deg,#ffe600,#00f5ff)']

export default function TeamPage() {
  return (
    <div style={{ maxWidth:1000, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h2 style={{ fontSize:24, fontWeight:800, color:'white', fontFamily:'monospace', margin:'0 0 4px' }}>Team</h2>
          <p style={{ fontSize:13, color:'#475569', margin:0 }}>{team.length} members</p>
        </div>
        <button style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 18px', borderRadius:10, background:'linear-gradient(135deg,#9d00ff,#ff2d78)', color:'white', border:'none', cursor:'pointer', fontSize:13, fontWeight:600 }}><Plus size={15}/>Invite</button>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:16 }}>
        {team.map((m, i) => {
          const total = m.issuesFixed + m.issuesPending
          return (
            <div key={m.id} style={{ padding:24, borderRadius:16, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ width:52, height:52, borderRadius:14, background:GRADS[i%4], display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:800, color:'white', marginBottom:14 }}>{m.avatar}</div>
              <h3 style={{ fontSize:16, fontWeight:700, color:'white', margin:'0 0 4px' }}>{m.name}</h3>
              <span style={{ display:'inline-block', fontSize:11, padding:'2px 9px', borderRadius:999, background:'rgba(157,0,255,0.12)', color:'#c084fc', border:'1px solid rgba(157,0,255,0.25)', fontWeight:600, marginBottom:12 }}>{m.role}</span>
              <p style={{ fontSize:12, color:'#475569', margin:'0 0 14px', display:'flex', alignItems:'center', gap:5 }}><Mail size={11}/>{m.email}</p>
              <div style={{ marginBottom:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, fontWeight:600, marginBottom:5 }}>
                  <span style={{ color:'#00ff94' }}>{m.issuesFixed} fixed</span>
                  <span style={{ color:'#64748b' }}>{m.issuesPending} pending</span>
                </div>
                <div style={{ height:5, borderRadius:999, background:'rgba(255,255,255,0.08)', overflow:'hidden' }}>
                  <div style={{ height:'100%', borderRadius:999, background:'linear-gradient(90deg,#9d00ff,#00ff94)', width:`${(m.issuesFixed/total)*100}%` }}/>
                </div>
              </div>
              <p style={{ fontSize:11, color:'#334155', display:'flex', alignItems:'center', gap:5, margin:0 }}><Clock size={11}/>{m.lastActive}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
