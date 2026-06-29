import { useState } from 'react'
import PageWrapper from '@/components/PageWrapper'
import { Bell, AlertTriangle, CheckCircle, Info, X } from 'lucide-react'

const INITIAL = [
  {id:1,type:'critical',title:'New critical issue: Login broken on Safari',time:'2 min ago',read:false},
  {id:2,type:'resolved',title:'ISS-035 resolved by Maya Rodriguez',time:'15 min ago',read:false},
  {id:3,type:'info',title:'CSV upload complete: 8,120 records imported',time:'1 hr ago',read:false},
  {id:4,type:'warning',title:'3 issues escalated past SLA threshold',time:'2 hr ago',read:true},
  {id:5,type:'info',title:'n8n webhook connected successfully',time:'3 hr ago',read:true},
  {id:6,type:'resolved',title:'ISS-029 closed after 7-day auto-rule',time:'Yesterday',read:true},
]

const ICON: Record<string,any> = { critical:<AlertTriangle size={15} color="#ef4444"/>, resolved:<CheckCircle size={15} color="#00ff94"/>, info:<Info size={15} color="#00f5ff"/>, warning:<AlertTriangle size={15} color="#ffe600"/> }
const BG: Record<string,string> = { critical:'rgba(239,68,68,0.08)', resolved:'rgba(0,255,148,0.08)', info:'rgba(0,245,255,0.06)', warning:'rgba(255,230,0,0.08)' }

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(INITIAL)
  const unread = notifs.filter(n=>!n.read).length
  return (
    <PageWrapper title="Notifications" subtitle={`${unread} unread`}
      action={<button onClick={()=>setNotifs(n=>n.map(x=>({...x,read:true})))} style={{ padding:'8px 16px', borderRadius:9, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8', cursor:'pointer', fontSize:12 }}>Mark all read</button>}>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {notifs.map(n => (
          <div key={n.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', borderRadius:12, background:n.read?'rgba(255,255,255,0.01)':BG[n.type], border:`1px solid ${n.read?'rgba(255,255,255,0.05)':n.type==='critical'?'rgba(239,68,68,0.2)':'rgba(255,255,255,0.08)'}`, transition:'all 0.2s' }}>
            <div style={{ width:34, height:34, borderRadius:9, background:'rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{ICON[n.type]}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:13, fontWeight:n.read?400:600, color:n.read?'#64748b':'#e2e8f0', margin:'0 0 3px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{n.title}</p>
              <p style={{ fontSize:11, color:'#334155', margin:0 }}>{n.time}</p>
            </div>
            {!n.read && <span style={{ width:7, height:7, borderRadius:'50%', background:'#9d00ff', flexShrink:0 }}/>}
            <button onClick={()=>setNotifs(prev=>prev.filter(x=>x.id!==n.id))} style={{ background:'none', border:'none', cursor:'pointer', color:'#334155', display:'flex', padding:4 }}><X size={14}/></button>
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}
