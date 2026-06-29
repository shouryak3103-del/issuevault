import { audit } from '@/lib/mock-data'
import { Sparkles, Download } from 'lucide-react'

export default function AuditPage() {
  return (
    <div style={{ maxWidth:900, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h2 style={{ fontSize:24, fontWeight:800, color:'white', fontFamily:'monospace', margin:'0 0 4px' }}>Audit Log</h2>
          <p style={{ fontSize:13, color:'#475569', margin:0 }}>Complete history of all actions</p>
        </div>
        <button style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:9, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8', cursor:'pointer', fontSize:12, fontWeight:500 }}>
          <Download size={13}/>Export
        </button>
      </div>
      <div style={{ borderRadius:14, border:'1px solid rgba(255,255,255,0.07)', overflow:'hidden' }}>
        {audit.map((entry, i) => (
          <div key={entry.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 20px', borderBottom: i < audit.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none', background:i%2===0?'transparent':'rgba(255,255,255,0.01)' }}>
            <div style={{ width:38, height:38, borderRadius:10, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'white',
              background:entry.user==='AI Auto'?'linear-gradient(135deg,#9d00ff,#ff2d78)':'rgba(255,255,255,0.08)' }}>
              {entry.user==='AI Auto' ? <Sparkles size={15}/> : entry.user.slice(0,2)}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:14, fontWeight:600, color:'white', margin:'0 0 3px' }}>
                <span style={{ color:entry.user==='AI Auto'?'#c084fc':'#e2e8f0' }}>{entry.user}</span>
                <span style={{ color:'#64748b', fontWeight:400 }}> · {entry.action}</span>
              </p>
              <p style={{ fontSize:12, color:'#475569', margin:0 }}>{entry.target}</p>
            </div>
            <span style={{ fontSize:12, color:'#334155', fontFamily:'monospace', flexShrink:0 }}>{entry.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
