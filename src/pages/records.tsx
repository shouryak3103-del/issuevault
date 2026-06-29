import { useState, useMemo } from 'react'
import { records, issueTypeLabel, type IssueType, type DataRecord } from '@/lib/mock-data'
import { Search, Eye, ChevronRight, Wand2 } from 'lucide-react'

const FILTERS = [
  { key:'all',           label:'All' },
  { key:'problems',      label:'Has issues' },
  { key:'duplicate',     label:'Duplicates' },
  { key:'missing',       label:'Missing' },
  { key:'invalid_format',label:'Invalid format' },
  { key:'inconsistent',  label:'Inconsistent' },
] as const

const ISSUE_COLOR: Record<IssueType,string> = {
  duplicate:     '#ff2d78',
  missing:       '#ef4444',
  invalid_format:'#ffe600',
  inconsistent:  '#00f5ff',
}

function severityOf(r: DataRecord): 'high'|'medium'|'low'|'clean' {
  if (!r.issues.length) return 'clean'
  if (r.issues.includes('duplicate') || r.issues.includes('missing')) return 'high'
  if (r.issues.includes('invalid_format')) return 'medium'
  return 'low'
}

const SEV_DOT: Record<ReturnType<typeof severityOf>,string> = {
  high:'#ef4444', medium:'#ffe600', low:'#00f5ff', clean:'#00ff94'
}

export default function RecordsPage() {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<typeof FILTERS[number]['key']>('all')
  const [expanded, setExpanded] = useState<string|null>(null)

  const filtered = useMemo(() => records.filter(r => {
    const matchQ = !q || [r.id,r.vendor,r.email,r.taxId].join(' ').toLowerCase().includes(q.toLowerCase())
    const matchF = filter==='all' ? true
      : filter==='problems' ? r.issues.length > 0
      : r.issues.includes(filter as IssueType)
    return matchQ && matchF
  }), [q, filter])

  return (
    <div style={{ maxWidth:1100, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h2 style={{ fontSize:24, fontWeight:800, color:'white', fontFamily:'monospace', margin:'0 0 4px' }}>Records</h2>
          <p style={{ fontSize:13, color:'#475569', margin:0 }}>{filtered.length} of {records.length} records</p>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flex:1, minWidth:200, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:9, padding:'8px 12px' }}>
          <Search size={13} color="#475569"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search vendor, email, tax ID…" style={{ background:'none', border:'none', outline:'none', color:'#94a3b8', fontSize:13, flex:1 }}/>
        </div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {FILTERS.map(f => (
            <button key={f.key} onClick={()=>setFilter(f.key)}
              style={{ padding:'7px 13px', borderRadius:8, fontSize:12, fontWeight:500, border:`1px solid ${filter===f.key?'#9d00ff':'rgba(255,255,255,0.08)'}`, background:filter===f.key?'rgba(157,0,255,0.18)':'rgba(255,255,255,0.03)', color:filter===f.key?'#c084fc':'#64748b', cursor:'pointer' }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ borderRadius:14, border:'1px solid rgba(255,255,255,0.07)', overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'16px 80px 1fr 160px 110px 90px 90px 80px', gap:0, padding:'10px 16px', background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          {['','ID','Vendor','Email','Tax ID','Amount','Date','Issues'].map(h=>(
            <span key={h} style={{ fontSize:10, color:'#475569', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</span>
          ))}
        </div>
        {filtered.map((r,i) => {
          const sev = severityOf(r)
          const isOpen = expanded === r.id
          return (
            <div key={r.id}>
              <div onClick={()=>setExpanded(isOpen?null:r.id)}
                style={{ display:'grid', gridTemplateColumns:'16px 80px 1fr 160px 110px 90px 90px 80px', gap:0, padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', background:isOpen?'rgba(157,0,255,0.06)':i%2===0?'transparent':'rgba(255,255,255,0.01)', cursor:'pointer', alignItems:'center' }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background:SEV_DOT[sev], display:'inline-block' }}/>
                <span style={{ fontSize:12, color:'#9d00ff', fontFamily:'monospace', fontWeight:600 }}>{r.id}</span>
                <span style={{ fontSize:13, color:'#cbd5e1', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', paddingRight:8 }}>{r.vendor}</span>
                <span style={{ fontSize:12, color:r.email?'#64748b':'#334155', fontStyle:r.email?'normal':'italic', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.email||'—'}</span>
                <span style={{ fontSize:12, color:r.taxId?'#64748b':'#334155', fontFamily:'monospace' }}>{r.taxId||'—'}</span>
                <span style={{ fontSize:12, color:'#94a3b8', fontFamily:'monospace' }}>{r.amount}</span>
                <span style={{ fontSize:12, color:'#64748b', fontFamily:'monospace' }}>{r.date}</span>
                <div style={{ display:'flex', gap:3, flexWrap:'wrap' }}>
                  {r.issues.length===0
                    ? <span style={{ fontSize:10, padding:'2px 7px', borderRadius:999, background:'rgba(0,255,148,0.1)', color:'#00ff94', fontWeight:600 }}>clean</span>
                    : r.issues.map(t => <span key={t} style={{ fontSize:10, padding:'2px 6px', borderRadius:999, background:`${ISSUE_COLOR[t]}12`, color:ISSUE_COLOR[t], border:`1px solid ${ISSUE_COLOR[t]}28`, fontWeight:600 }}>{t.split('_')[0]}</span>)
                  }
                </div>
              </div>
              {isOpen && (
                <div style={{ padding:'14px 24px 16px', background:'rgba(157,0,255,0.05)', borderBottom:'1px solid rgba(157,0,255,0.15)' }}>
                  <p style={{ fontSize:12, color:'#475569', marginBottom:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>Detected issues for {r.id}</p>
                  {r.issues.length === 0
                    ? <p style={{ fontSize:13, color:'#00ff94' }}>✓ No issues detected — this record is clean</p>
                    : r.issues.map(t => (
                        <div key={t} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                          <span style={{ fontSize:11, padding:'2px 8px', borderRadius:999, background:`${ISSUE_COLOR[t]}12`, color:ISSUE_COLOR[t], fontWeight:600 }}>{issueTypeLabel[t]}</span>
                          <span style={{ fontSize:13, color:'#94a3b8' }}>Review recommended for field: <code style={{ color:'#c084fc', fontSize:12 }}>{t === 'duplicate' ? 'vendor' : t === 'missing' ? 'email/taxId' : t === 'invalid_format' ? 'amount/date' : 'vendor'}</code></span>
                        </div>
                      ))
                  }
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
