import { useState } from 'react'
import PageWrapper from '@/components/PageWrapper'
import { Plus, Search, Filter, Bug, AlertTriangle, Zap } from 'lucide-react'

const SEV: Record<string,string> = { critical:'#ef4444', high:'#f97316', medium:'#ffe600', low:'#00f5ff' }
const STS: Record<string,string> = { open:'#ff2d78', in_progress:'#ffe600', resolved:'#00ff94', closed:'#475569', rejected:'#94a3b8' }

const ISSUES = [
  {id:'ISS-042',title:'Login button unresponsive on Safari',severity:'critical',status:'open',type:'bug',assignee:'SC',created:'Jun 26'},
  {id:'ISS-041',title:'Memory leak in analytics worker',severity:'high',status:'in_progress',type:'bug',assignee:'MR',created:'Jun 25'},
  {id:'ISS-040',title:'CSV upload silently drops last row',severity:'medium',status:'open',type:'bug',assignee:'DK',created:'Jun 24'},
  {id:'ISS-039',title:'Audit timestamps in wrong timezone',severity:'low',status:'resolved',type:'bug',assignee:'PS',created:'Jun 23'},
  {id:'ISS-038',title:'n8n webhook 403 on second trigger',severity:'high',status:'open',type:'bug',assignee:'LB',created:'Jun 22'},
  {id:'ISS-037',title:'Add dark mode toggle',severity:'low',status:'open',type:'feature',assignee:'SR',created:'Jun 21'},
  {id:'ISS-036',title:'Bulk issue import from Jira',severity:'medium',status:'in_progress',type:'feature',assignee:'MR',created:'Jun 20'},
  {id:'ISS-035',title:'Rate limit GitHub API calls',severity:'high',status:'resolved',type:'task',assignee:'SC',created:'Jun 19'},
]

export default function IssuesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sevFilter, setSevFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)

  const filtered = ISSUES.filter(i =>
    (statusFilter === 'all' || i.status === statusFilter) &&
    (sevFilter === 'all' || i.severity === sevFilter) &&
    (i.title.toLowerCase().includes(search.toLowerCase()) || i.id.includes(search))
  )

  return (
    <PageWrapper title="Issues" subtitle={`${filtered.length} issues`}
      action={<button onClick={() => setShowModal(true)} style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 18px', borderRadius:10, background:'linear-gradient(135deg,#9d00ff,#ff2d78)', color:'white', border:'none', cursor:'pointer', fontSize:13, fontWeight:600 }}><Plus size={15}/>New issue</button>}>

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:9, padding:'8px 12px' }}>
          <Search size={13} color="#475569"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search issues…" style={{ background:'none', border:'none', outline:'none', color:'#94a3b8', fontSize:13, flex:1 }}/>
        </div>
        {[['all','open','in_progress','resolved','closed'].map(s => (
          <button key={s} onClick={()=>setStatusFilter(s)} style={{ padding:'8px 14px', borderRadius:9, fontSize:12, fontWeight:500, border:'none', cursor:'pointer', transition:'all 0.2s', background:statusFilter===s?'rgba(157,0,255,0.2)':'rgba(255,255,255,0.04)', color:statusFilter===s?'#9d00ff':'#64748b' }}>{s}</button>
        ))]}
      </div>

      {/* Table */}
      <div style={{ borderRadius:12, border:'1px solid rgba(255,255,255,0.07)', overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'90px 1fr 90px 100px 80px 60px', gap:0, padding:'10px 16px', background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          {['ID','Title','Severity','Status','Type','Assgn'].map(h => <span key={h} style={{ fontSize:11, color:'#475569', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</span>)}
        </div>
        {filtered.map((issue,i) => (
          <div key={issue.id} style={{ display:'grid', gridTemplateColumns:'90px 1fr 90px 100px 80px 60px', gap:0, padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', background:i%2===0?'transparent':'rgba(255,255,255,0.01)', cursor:'pointer', transition:'background 0.15s' }}>
            <span style={{ fontSize:12, color:'#9d00ff', fontFamily:'monospace', fontWeight:600 }}>{issue.id}</span>
            <span style={{ fontSize:13, color:'#cbd5e1', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', paddingRight:16 }}>{issue.title}</span>
            <span style={{ fontSize:11, padding:'2px 8px', borderRadius:999, background:`${SEV[issue.severity]}18`, color:SEV[issue.severity], border:`1px solid ${SEV[issue.severity]}28`, fontWeight:600, alignSelf:'center', display:'inline-flex', width:'fit-content' }}>{issue.severity}</span>
            <span style={{ fontSize:11, padding:'2px 8px', borderRadius:999, background:`${STS[issue.status]}12`, color:STS[issue.status], border:`1px solid ${STS[issue.status]}25`, fontWeight:500, alignSelf:'center', display:'inline-flex', width:'fit-content' }}>{issue.status.replace('_',' ')}</span>
            <span style={{ fontSize:12, color:'#64748b', alignSelf:'center' }}>{issue.type}</span>
            <div style={{ width:28, height:28, borderRadius:7, background:'linear-gradient(135deg,#9d00ff,#ff2d78)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'white' }}>{issue.assignee}</div>
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}
