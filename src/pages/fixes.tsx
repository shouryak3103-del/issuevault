import { useState } from 'react'
import { issues as seedIssues, issueTypeLabel } from '@/lib/mock-data'
import { Check, X, Pencil, Sparkles, Save, Zap } from 'lucide-react'

const SEV: Record<string,string> = { high:'#ef4444', medium:'#ffe600', low:'#00f5ff', fixed:'#00ff94' }
type Status = 'pending'|'approved'|'rejected'|'fixed'

export default function FixesPage() {
  const [items, setItems] = useState(() => seedIssues.map(i => ({ ...i, status:'pending' as Status })))
  const [editing, setEditing] = useState<string|null>(null)
  const [draft, setDraft] = useState('')

  function update(id: string, patch: Partial<(typeof items)[number]>) {
    setItems(arr => arr.map(x => x.id===id ? {...x,...patch} : x))
  }
  function approve(id: string) { update(id, { status:'fixed' }) }
  function reject(id: string)  { update(id, { status:'rejected' }) }
  function startEdit(id: string, current: string) { setEditing(id); setDraft(current) }
  function saveEdit(id: string) { update(id, { suggestion:draft, status:'fixed' }); setEditing(null) }

  const pending   = items.filter(i => i.status==='pending').length
  const autoFix   = items.filter(i => i.confidence>=0.9 && i.status==='pending').length
  const fixed     = items.filter(i => i.status==='fixed').length

  function approveAll() {
    setItems(arr => arr.map(x => x.status==='pending' && x.confidence>=0.9 ? {...x,status:'fixed'} : x))
  }

  return (
    <div style={{ maxWidth:1000, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h2 style={{ fontSize:24, fontWeight:800, color:'white', fontFamily:'monospace', margin:'0 0 4px' }}>Fix Suggestions</h2>
          <p style={{ fontSize:13, color:'#475569', margin:0 }}>AI-generated fixes for your data issues</p>
        </div>
        {autoFix > 0 && (
          <button onClick={approveAll} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 18px', borderRadius:11, background:'linear-gradient(135deg,#9d00ff,#ff2d78)', color:'white', border:'none', cursor:'pointer', fontSize:13, fontWeight:700 }}>
            <Sparkles size={15}/>Apply {autoFix} auto-fixes
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
        {[
          { label:'Pending review', value:pending,  color:'#ffe600' },
          { label:'Auto-fixable (≥90%)', value:autoFix, color:'#9d00ff' },
          { label:'Fixed',          value:fixed,   color:'#00ff94' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ padding:18, borderRadius:12, background:`${color}08`, border:`1px solid ${color}20` }}>
            <p style={{ fontSize:11, color:'#475569', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:600, margin:'0 0 6px' }}>{label}</p>
            <p style={{ fontSize:28, fontWeight:800, color:'white', fontFamily:'monospace', margin:0 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Fix cards */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {items.map(issue => (
          <div key={issue.id} style={{ borderRadius:14, border:`1px solid ${issue.status==='fixed'?'rgba(0,255,148,0.25)':issue.status==='rejected'?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.08)'}`, background:issue.status==='fixed'?'rgba(0,255,148,0.04)':issue.status==='rejected'?'rgba(255,255,255,0.01)':'rgba(255,255,255,0.02)', padding:18, transition:'all 0.2s', opacity:issue.status==='rejected'?0.5:1 }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
              {/* Left */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, flexWrap:'wrap' }}>
                  <span style={{ fontSize:12, color:'#9d00ff', fontFamily:'monospace', fontWeight:700 }}>{issue.id}</span>
                  <span style={{ fontSize:11, color:'#00f5ff', fontFamily:'monospace' }}>{issue.recordId}</span>
                  <span style={{ fontSize:10, padding:'2px 7px', borderRadius:999, background:`${SEV[issue.severity]}18`, color:SEV[issue.severity], border:`1px solid ${SEV[issue.severity]}28`, fontWeight:700 }}>{issue.severity}</span>
                  <span style={{ fontSize:10, padding:'2px 7px', borderRadius:999, background:'rgba(255,255,255,0.06)', color:'#94a3b8' }}>{issueTypeLabel[issue.type]}</span>
                  <span style={{ fontSize:10, padding:'2px 7px', borderRadius:999, background:'rgba(255,255,255,0.06)', color:'#94a3b8', fontFamily:'monospace' }}>field: {issue.field}</span>
                </div>

                {editing === issue.id ? (
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <input value={draft} onChange={e=>setDraft(e.target.value)}
                      style={{ flex:1, padding:'8px 12px', borderRadius:8, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(157,0,255,0.4)', color:'#e2e8f0', fontSize:13, outline:'none' }}/>
                    <button onClick={()=>saveEdit(issue.id)} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:8, background:'rgba(0,255,148,0.15)', border:'1px solid rgba(0,255,148,0.3)', color:'#00ff94', cursor:'pointer', fontSize:12, fontWeight:600 }}>
                      <Save size={13}/>Save
                    </button>
                  </div>
                ) : (
                  <p style={{ fontSize:14, color:'#cbd5e1', margin:'0 0 6px', lineHeight:1.5 }}>
                    <span style={{ color:'#475569', fontSize:12 }}>Suggestion: </span>{issue.suggestion}
                  </p>
                )}

                {/* Confidence bar */}
                <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:6 }}>
                  <span style={{ fontSize:11, color:'#475569' }}>AI confidence</span>
                  <div style={{ height:5, width:120, borderRadius:999, background:'rgba(255,255,255,0.08)', overflow:'hidden' }}>
                    <div style={{ height:'100%', borderRadius:999, background:issue.confidence>=0.9?'#00ff94':issue.confidence>=0.75?'#ffe600':'#ef4444', width:`${issue.confidence*100}%` }}/>
                  </div>
                  <span style={{ fontSize:12, fontWeight:700, color:issue.confidence>=0.9?'#00ff94':issue.confidence>=0.75?'#ffe600':'#ef4444', fontFamily:'monospace' }}>{Math.round(issue.confidence*100)}%</span>
                </div>
              </div>

              {/* Actions */}
              {issue.status === 'pending' && (
                <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                  <button onClick={()=>startEdit(issue.id, issue.suggestion)} style={{ width:34, height:34, borderRadius:8, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#64748b' }}><Pencil size={14}/></button>
                  <button onClick={()=>reject(issue.id)} style={{ width:34, height:34, borderRadius:8, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#ef4444' }}><X size={15}/></button>
                  <button onClick={()=>approve(issue.id)} style={{ display:'flex', alignItems:'center', gap:6, padding:'0 14px', height:34, borderRadius:8, background:'rgba(0,255,148,0.15)', border:'1px solid rgba(0,255,148,0.3)', cursor:'pointer', color:'#00ff94', fontSize:12, fontWeight:700 }}><Check size={14}/>Apply</button>
                </div>
              )}
              {issue.status === 'fixed' && (
                <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:8, background:'rgba(0,255,148,0.1)', color:'#00ff94', fontSize:12, fontWeight:600, flexShrink:0 }}>
                  <Check size={13}/>Fixed
                </div>
              )}
              {issue.status === 'rejected' && (
                <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:8, background:'rgba(255,255,255,0.05)', color:'#475569', fontSize:12, flexShrink:0 }}>
                  <X size={13}/>Rejected
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
