import PageWrapper from '@/components/PageWrapper'
import { Sparkles, User } from 'lucide-react'

const LOG = [
  {id:'A-01',time:'14:22',date:'Jun 27',user:'Maya R.',  action:'Approved fix',       target:'ISS-038 · n8n webhook',   type:'user'},
  {id:'A-02',time:'14:09',date:'Jun 27',user:'AI Auto',  action:'Ran analysis',        target:'vendors_jun.csv (8,120 rows)',type:'ai'},
  {id:'A-03',time:'13:55',date:'Jun 27',user:'Devon K.', action:'Uploaded CSV',        target:'vendors_jun.csv',          type:'user'},
  {id:'A-04',time:'13:44',date:'Jun 27',user:'AI Auto',  action:'Detected 12 issues',  target:'vendors_jun.csv',          type:'ai'},
  {id:'A-05',time:'12:30',date:'Jun 27',user:'Maya R.',  action:'Merged duplicate',    target:'ISS-041 → ISS-039',        type:'user'},
  {id:'A-06',time:'11:15',date:'Jun 27',user:'Priya S.', action:'Closed issue',        target:'ISS-035 · GitHub rate limit',type:'user'},
  {id:'A-07',time:'09:02',date:'Jun 27',user:'AI Auto',  action:'Auto-normalized',     target:'6 vendor names',           type:'ai'},
]

export default function AuditPage() {
  return (
    <PageWrapper title="Audit Log" subtitle="Complete history of all actions">
      <div style={{ display:'flex', flexDirection:'column', gap:0, borderRadius:12, border:'1px solid rgba(255,255,255,0.07)', overflow:'hidden' }}>
        {LOG.map((entry,i) => (
          <div key={entry.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,0.05)', background:i%2===0?'transparent':'rgba(255,255,255,0.01)' }}>
            <div style={{ width:36, height:36, borderRadius:9, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'white',
              background:entry.type==='ai'?'linear-gradient(135deg,#9d00ff,#ff2d78)':'rgba(255,255,255,0.08)' }}>
              {entry.type==='ai' ? <Sparkles size={14}/> : entry.user.slice(0,2)}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:13, fontWeight:600, color:'white', margin:'0 0 2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{entry.action}</p>
              <p style={{ fontSize:12, color:'#475569', margin:0 }}>{entry.target}</p>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontSize:13, color:'#64748b', fontWeight:500 }}>{entry.user}</div>
              <div style={{ fontSize:11, color:'#334155', fontFamily:'monospace' }}>{entry.date} {entry.time}</div>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}
