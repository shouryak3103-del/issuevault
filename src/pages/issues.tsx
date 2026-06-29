import { useState, useMemo } from 'react'
import { issues, issueTypeLabel, type IssueType } from '@/lib/mock-data'
import { Copy, FileQuestion, AlertCircle, Shuffle } from 'lucide-react'

const SEV: Record<string,string> = { high:'#ef4444', medium:'#ffe600', low:'#00f5ff', fixed:'#00ff94' }
const STATUS: Record<string,string> = { pending:'#ffe600', approved:'#9d00ff', rejected:'#ef4444', fixed:'#00ff94' }

const TABS = [
  { key:'all',            label:'All issues',      icon:AlertCircle },
  { key:'duplicate',      label:'Duplicates',      icon:Copy },
  { key:'missing',        label:'Missing fields',  icon:FileQuestion },
  { key:'invalid_format', label:'Invalid format',  icon:AlertCircle },
  { key:'inconsistent',  label:'Inconsistent',    icon:Shuffle },
] as const

export default function IssuesPage() {
  const [type, setType] = useState<'all'|IssueType>('all')

  const counts = useMemo(() => ({
    all: issues.length,
    duplicate: issues.filter(i=>i.type==='duplicate').length,
    missing: issues.filter(i=>i.type==='missing').length,
    invalid_format: issues.filter(i=>i.type==='invalid_format').length,
    inconsistent: issues.filter(i=>i.type==='inconsistent').length,
  }), [])

  const list = type === 'all' ? issues : issues.filter(i => i.type === type)

  return (
    <div style={{ maxWidth:1100, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:24, fontWeight:800, color:'white', fontFamily:'monospace', margin:'0 0 4px' }}>Issues</h2>
        <p style={{ fontSize:13, color:'#475569', margin:0 }}>{list.length} issues detected by AI</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
        {TABS.map(tab => {
          const active = type === tab.key
          return (
            <button key={tab.key} onClick={()=>setType(tab.key as any)}
              style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'8px 14px', borderRadius:999, border:`1px solid ${active?'#9d00ff':'rgba(255,255,255,0.1)'}`, background:active?'rgba(157,0,255,0.2)':'rgba(255,255,255,0.03)', color:active?'#c084fc':'#64748b', fontSize:13, fontWeight:600, cursor:'pointer', transition:'all 0.15s' }}>
              <tab.icon size={13}/>
              {tab.label}
              <span style={{ padding:'1px 7px', borderRadius:999, background:active?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.06)', fontSize:11, fontFamily:'monospace' }}>{counts[tab.key as keyof typeof counts]}</span>
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div style={{ borderRadius:14, border:'1px solid rgba(255,255,255,0.08)', overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'70px 80px 90px 80px 1fr 80px 90px', padding:'10px 18px', background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          {['ID','Record','Field','Type','Suggestion','Conf.','Status'].map(h=>(
            <span key={h} style={{ fontSize:10, color:'#475569', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</span>
          ))}
        </div>
        {list.map((issue, i) => (
          <div key={issue.id} style={{ display:'grid', gridTemplateColumns:'70px 80px 90px 80px 1fr 80px 90px', padding:'13px 18px', borderBottom:'1px solid rgba(255,255,255,0.04)', background:i%2===0?'transparent':'rgba(255,255,255,0.01)', alignItems:'center' }}>
            <span style={{ fontSize:12, color:'#9d00ff', fontFamily:'monospace', fontWeight:700 }}>{issue.id}</span>
            <span style={{ fontSize:12, color:'#00f5ff', fontFamily:'monospace' }}>{issue.recordId}</span>
            <span style={{ fontSize:12, color:'#94a3b8', fontFamily:'monospace' }}>{issue.field}</span>
            <span style={{ fontSize:11, padding:'2px 8px', borderRadius:999, background:'rgba(255,255,255,0.06)', color:'#94a3b8', width:'fit-content' }}>{issueTypeLabel[issue.type]}</span>
            <span style={{ fontSize:13, color:'#cbd5e1', paddingRight:12 }}>{issue.suggestion}</span>
            <div style={{ display:'flex', alignItems:'center', gap:4 }}>
              <div style={{ height:4, flex:1, borderRadius:999, background:'rgba(255,255,255,0.08)', overflow:'hidden' }}>
                <div style={{ height:'100%', borderRadius:999, background:issue.confidence>0.9?'#00ff94':issue.confidence>0.75?'#ffe600':'#ef4444', width:`${issue.confidence*100}%` }}/>
              </div>
              <span style={{ fontSize:11, color:'#64748b', fontFamily:'monospace', flexShrink:0 }}>{Math.round(issue.confidence*100)}%</span>
            </div>
            <span style={{ fontSize:11, padding:'2px 8px', borderRadius:999, background:`${STATUS[issue.status]}12`, color:STATUS[issue.status], border:`1px solid ${STATUS[issue.status]}25`, fontWeight:600, width:'fit-content' }}>{issue.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
