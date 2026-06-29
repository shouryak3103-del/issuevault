import { useState } from 'react'
import PageWrapper from '@/components/PageWrapper'
import { Search, Filter, Download } from 'lucide-react'

const RECORDS = [
  {id:'R-1001',vendor:'Acme Corp',email:'billing@acme.com',taxId:'12-3456789',amount:'$4,200.00',date:'2026-05-14',status:'clean'},
  {id:'R-1002',vendor:'acme corp.',email:'billing@acme.com',taxId:'12-3456789',amount:'$4200',date:'2026-05-14',status:'issue'},
  {id:'R-1003',vendor:'Globex Inc',email:'ap@globex',taxId:'',amount:'$1,820.50',date:'2026-05-15',status:'issue'},
  {id:'R-1004',vendor:'Initech',email:'finance@initech.com',taxId:'98-7654321',amount:'$925.00',date:'2026-05-16',status:'clean'},
  {id:'R-1005',vendor:'Soylent Co',email:'pay@soylent.com',taxId:'55-1234567',amount:'$12,400',date:'05/17/2026',status:'issue'},
  {id:'R-1006',vendor:'Umbrella Corp',email:'',taxId:'44-9988776',amount:'$3,300.00',date:'2026-05-18',status:'issue'},
  {id:'R-1007',vendor:'Hooli',email:'ap@hooli.com',taxId:'77-1122334',amount:'$8,750.00',date:'2026-05-18',status:'clean'},
  {id:'R-1008',vendor:'HOOLI',email:'ap@hooli.com',taxId:'77-1122334',amount:'$8,750.00',date:'2026-05-18',status:'issue'},
]

export default function RecordsPage() {
  const [search, setSearch] = useState('')
  const filtered = RECORDS.filter(r => r.vendor.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search))
  return (
    <PageWrapper title="Records" subtitle={`${filtered.length} records`}
      action={<button style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:9, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8', cursor:'pointer', fontSize:12, fontWeight:500 }}><Download size={13}/>Export</button>}>
      <div style={{ display:'flex', gap:10, marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:9, padding:'8px 12px' }}>
          <Search size={13} color="#475569"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search records…" style={{ background:'none', border:'none', outline:'none', color:'#94a3b8', fontSize:13, flex:1 }}/>
        </div>
      </div>
      <div style={{ borderRadius:12, border:'1px solid rgba(255,255,255,0.07)', overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'80px 1fr 160px 120px 90px 100px 70px', padding:'10px 16px', background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          {['ID','Vendor','Email','Tax ID','Amount','Date','Status'].map(h => <span key={h} style={{ fontSize:11, color:'#475569', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</span>)}
        </div>
        {filtered.map((r,i) => (
          <div key={r.id} style={{ display:'grid', gridTemplateColumns:'80px 1fr 160px 120px 90px 100px 70px', padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', background:i%2===0?'transparent':'rgba(255,255,255,0.01)' }}>
            <span style={{ fontSize:12, color:'#9d00ff', fontFamily:'monospace', fontWeight:600 }}>{r.id}</span>
            <span style={{ fontSize:13, color:'#cbd5e1' }}>{r.vendor}</span>
            <span style={{ fontSize:12, color:r.email?'#64748b':'#334155', fontStyle:r.email?'normal':'italic' }}>{r.email||'—'}</span>
            <span style={{ fontSize:12, color:r.taxId?'#64748b':'#334155', fontFamily:'monospace' }}>{r.taxId||'—'}</span>
            <span style={{ fontSize:12, color:'#94a3b8', fontFamily:'monospace' }}>{r.amount}</span>
            <span style={{ fontSize:12, color:'#64748b', fontFamily:'monospace' }}>{r.date}</span>
            <span style={{ fontSize:10, padding:'2px 8px', borderRadius:999, background:r.status==='clean'?'rgba(0,255,148,0.1)':'rgba(255,45,120,0.1)', color:r.status==='clean'?'#00ff94':'#ff2d78', fontWeight:600 }}>{r.status}</span>
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}
