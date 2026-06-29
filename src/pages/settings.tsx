import { useState } from 'react'
import PageWrapper from '@/components/PageWrapper'
import { Save, Check } from 'lucide-react'

function Toggle({on,onChange}:{on:boolean;onChange:(v:boolean)=>void}) {
  return <button onClick={()=>onChange(!on)} style={{ width:42, height:24, borderRadius:999, border:'none', cursor:'pointer', position:'relative', transition:'background 0.2s', background:on?'linear-gradient(135deg,#9d00ff,#ff2d78)':'rgba(255,255,255,0.12)' }}>
    <span style={{ position:'absolute', top:3, left:on?21:3, width:18, height:18, borderRadius:'50%', background:'white', transition:'left 0.2s' }}/>
  </button>
}

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [notifs, setNotifs] = useState({email:true,slack:false,digest:true,critical:true})
  return (
    <PageWrapper title="Settings" subtitle="Workspace preferences">
      <div style={{ maxWidth:600, display:'flex', flexDirection:'column', gap:16 }}>
        {/* Profile */}
        <div style={{ padding:24, borderRadius:14, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:'white', marginBottom:18 }}>Profile</h3>
          {[['Full Name','Maya Rodriguez'],['Email','maya@acme.com'],['Organization','Acme Corp']].map(([label,val])=>(
            <div key={label} style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, color:'#64748b', display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:600 }}>{label}</label>
              <input defaultValue={val} style={{ width:'100%', padding:'10px 14px', borderRadius:9, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#e2e8f0', fontSize:13, outline:'none', boxSizing:'border-box' }}/>
            </div>
          ))}
        </div>
        {/* Notifications */}
        <div style={{ padding:24, borderRadius:14, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:'white', marginBottom:18 }}>Notifications</h3>
          {[
            ['email','Email alerts','Get notified via email for new issues'],
            ['slack','Slack messages','Post to Slack on critical issues'],
            ['digest','Daily digest','Morning summary of open issues'],
            ['critical','Critical only','Only alert on high-severity issues'],
          ].map(([key,label,help])=>(
            <div key={key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div><p style={{ fontSize:14, fontWeight:500, color:'#e2e8f0', margin:'0 0 2px' }}>{label}</p><p style={{ fontSize:12, color:'#475569', margin:0 }}>{help}</p></div>
              <Toggle on={(notifs as any)[key]} onChange={v=>setNotifs(p=>({...p,[key]:v}))}/>
            </div>
          ))}
        </div>
        <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000)}}
          style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'12px 24px', borderRadius:10, background:'linear-gradient(135deg,#9d00ff,#ff2d78)', color:'white', border:'none', cursor:'pointer', fontSize:14, fontWeight:600 }}>
          {saved?<><Check size={16}/>Saved!</>:<><Save size={16}/>Save changes</>}
        </button>
      </div>
    </PageWrapper>
  )
}
