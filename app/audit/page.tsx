'use client'
import { useEffect, useState } from 'react'
import PageWrapper from '@/components/PageWrapper'
import { History, ChevronLeft, ChevronRight, RefreshCw, Plus, Edit2, Trash2, Upload, Zap, Database } from 'lucide-react'

const META: Record<string,{icon:any;color:string;bg:string}> = {
  CREATE:    { icon:Plus,     color:'#00ff94', bg:'rgba(0,255,148,0.1)' },
  UPDATE:    { icon:Edit2,    color:'#00f5ff', bg:'rgba(0,245,255,0.1)' },
  DELETE:    { icon:Trash2,   color:'#ef4444', bg:'rgba(239,68,68,0.1)' },
  CSV_UPLOAD:{ icon:Upload,   color:'#9d00ff', bg:'rgba(157,0,255,0.1)' },
  SYNC:      { icon:RefreshCw,color:'#ffe600', bg:'rgba(255,230,0,0.1)' },
}
const getMeta = (action: string) => {
  for (const k of Object.keys(META)) if (action?.toUpperCase().includes(k)) return META[k]
  return { icon:Zap, color:'#9d00ff', bg:'rgba(157,0,255,0.1)' }
}

export default function AuditPage() {
  const [logs,    setLogs]    = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page,    setPage]    = useState(1)
  const [total,   setTotal]   = useState(0)
  const [filter,  setFilter]  = useState('all')
  const PER = 25

  const load = async (p = 1) => {
    setLoading(true)
    const params = new URLSearchParams({ page:String(p), limit:String(PER) })
    if (filter !== 'all') params.set('table', filter)
    const r = await fetch('/api/audit?' + params)
    const d = await r.json()
    setLogs(d.data || [])
    setTotal(d.total || 0)
    setLoading(false)
  }
  useEffect(() => { load(page) }, [page, filter])

  const tables = ['all','issues','actions','records','integrations','team']
  const totalPages = Math.max(1, Math.ceil(total / PER))

  return (
    <PageWrapper title="Audit Log" subtitle={`${total} total change${total!==1?'s':''} tracked`}>
      <div style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom:'20px', flexWrap:'wrap' }}>
        {tables.map(t => (
          <button key={t} onClick={() => { setFilter(t); setPage(1) }}
            style={{ fontSize:'12px', padding:'6px 14px', borderRadius:'8px', cursor:'pointer',
              background: filter===t ? 'rgba(157,0,255,0.2)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${filter===t ? 'rgba(157,0,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
              color: filter===t ? '#9d00ff' : '#64748b', fontWeight: filter===t ? 600 : 400 }}>
            {t === 'all' ? 'All Tables' : t}
          </button>
        ))}
        <button onClick={() => load(page)} className="btn-secondary" style={{ marginLeft:'auto', padding:'6px 14px', fontSize:'12px' }}>
          <RefreshCw size={12}/> Refresh
        </button>
      </div>

      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <table className="table-dark" style={{ width:'100%' }}>
          <thead>
            <tr>
              <th style={{ width:'36px' }}></th>
              <th>ACTION</th>
              <th>TABLE</th>
              <th>PERFORMED BY</th>
              <th>RECORD ID</th>
              <th>TIMESTAMP</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({length:10}).map((_,i) => (
                <tr key={i}><td colSpan={6}><div style={{ height:'16px', background:'rgba(255,255,255,0.03)', borderRadius:'3px', margin:'3px 0', animation:'pulse 1.5s infinite' }}/></td></tr>
              ))
            ) : logs.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign:'center', padding:'48px', color:'#334155' }}>
                <History size={32} style={{ margin:'0 auto 12px', opacity:0.2, display:'block' }}/>
                No audit entries yet
              </td></tr>
            ) : logs.map((log: any) => {
              const m = getMeta(log.action || '')
              const Icon = m.icon
              return (
                <tr key={log.id}>
                  <td style={{ padding:'12px 8px 12px 16px' }}>
                    <div style={{ width:'28px', height:'28px', borderRadius:'7px', background:m.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Icon size={13} color={m.color}/>
                    </div>
                  </td>
                  <td style={{ maxWidth:'320px' }}>
                    <span style={{ fontSize:'13px', color:'#cbd5e1', overflow:'hidden', display:'block', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{log.action}</span>
                  </td>
                  <td>
                    <span style={{ fontSize:'11px', padding:'2px 8px', borderRadius:'999px', background:'rgba(157,0,255,0.1)', color:'#9d00ff', border:'1px solid rgba(157,0,255,0.2)' }}>{log.table_name}</span>
                  </td>
                  <td style={{ fontSize:'12px', color:'#64748b' }}>{log.performed_by || <span style={{ color:'#1e293b' }}>—</span>}</td>
                  <td>
                    <span style={{ fontSize:'11px', fontFamily:'monospace', color:'#334155' }}>{log.record_id?.slice(0,8)||'—'}</span>
                  </td>
                  <td style={{ fontSize:'11px', color:'#475569', whiteSpace:'nowrap' }}>{new Date(log.created_at||log.created_date).toLocaleString()}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', marginTop:'16px' }}>
          <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} className="btn-secondary" style={{ padding:'7px 12px', fontSize:'12px' }}><ChevronLeft size={14}/></button>
          <span style={{ fontSize:'13px', color:'#64748b' }}>Page {page} of {totalPages} &nbsp;·&nbsp; {total} entries</span>
          <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="btn-secondary" style={{ padding:'7px 12px', fontSize:'12px' }}><ChevronRight size={14}/></button>
        </div>
      )}
    </PageWrapper>
  )
}
