import { useState } from 'react'
import PageWrapper from '@/components/PageWrapper'
import { Plus, Zap, Check, X, Clock } from 'lucide-react'

const ACTIONS = [
  {id:'ACT-012',title:'Auto-escalate critical issues after 2hr',trigger:'issue.created',status:'active',runs:84,lastRun:'2 min ago'},
  {id:'ACT-011',title:'Notify Slack on severity=high',trigger:'issue.updated',status:'active',runs:241,lastRun:'8 min ago'},
  {id:'ACT-010',title:'Assign to team lead on bug type',trigger:'issue.created',status:'active',runs:156,lastRun:'15 min ago'},
  {id:'ACT-009',title:'Daily digest to #engineering',trigger:'schedule.daily',status:'active',runs:14,lastRun:'9 hr ago'},
  {id:'ACT-008',title:'Auto-close resolved after 7 days',trigger:'schedule.weekly',status:'paused',runs:6,lastRun:'3 days ago'},
]

export default function ActionsPage() {
  return (
    <PageWrapper title="Actions" subtitle="Automated workflows and triggers"
      action={<button style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 18px', borderRadius:10, background:'linear-gradient(135deg,#9d00ff,#ff2d78)', color:'white', border:'none', cursor:'pointer', fontSize:13, fontWeight:600 }}><Plus size={15}/>New action</button>}>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {ACTIONS.map(a => (
          <div key={a.id} style={{ padding:18, borderRadius:12, background:'rgba(255,255,255,0.02)', border:`1px solid ${a.status==='active'?'rgba(0,255,148,0.15)':'rgba(255,255,255,0.06)'}`, display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ width:36, height:36, borderRadius:9, background:a.status==='active'?'rgba(0,255,148,0.1)':'rgba(255,255,255,0.05)', border:`1px solid ${a.status==='active'?'rgba(0,255,148,0.25)':'rgba(255,255,255,0.1)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Zap size={16} color={a.status==='active'?'#00ff94':'#475569'}/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <h3 style={{ fontSize:14, fontWeight:600, color:'white', margin:'0 0 4px' }}>{a.title}</h3>
              <p style={{ fontSize:12, color:'#475569', margin:0 }}>Trigger: <span style={{ color:'#64748b' }}>{a.trigger}</span> · {a.runs} runs · Last: {a.lastRun}</p>
            </div>
            <span style={{ fontSize:11, padding:'3px 10px', borderRadius:999, background:a.status==='active'?'rgba(0,255,148,0.12)':'rgba(255,255,255,0.05)', color:a.status==='active'?'#00ff94':'#64748b', border:`1px solid ${a.status==='active'?'rgba(0,255,148,0.25)':'rgba(255,255,255,0.1)'}`, fontWeight:600 }}>{a.status}</span>
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}
