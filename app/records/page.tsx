'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PageWrapper from '@/components/PageWrapper'
import { Database, ChevronLeft, ChevronRight, Download } from 'lucide-react'

function RecordsContent() {
  const searchParams = useSearchParams()
  const [records,      setRecords]      = useState<any[]>([])
  const [loading,      setLoading]      = useState(true)
  const [page,         setPage]         = useState(1)
  const [totalPages,   setTotalPages]   = useState(1)
  const [total,        setTotal]        = useState(0)
  const [uploads,      setUploads]      = useState<any[]>([])
  const [selectedUpload, setSelectedUpload] = useState(searchParams.get('upload_id') || 'all')
  const [columns,      setColumns]      = useState<string[]>([])

  const load = async (p = 1) => {
    setLoading(true)
    const params = new URLSearchParams({ page:String(p), limit:'20' })
    if (selectedUpload !== 'all') params.set('upload_id', selectedUpload)
    const r = await fetch('/api/records?' + params)
    const d = await r.json()
    setRecords(d.data || [])
    setTotalPages(d.total_pages || 1)
    setTotal(d.total || 0)
    if (d.data?.length > 0) {
      const cols = Object.keys(d.data[0]).filter(c => !['id','created_at','upload_id','created_date','updated_date','created_by'].includes(c))
      setColumns(cols.slice(0, 8))
    }
    setLoading(false)
  }

  const loadUploads = async () => {
    const r = await fetch('/api/uploads'); const d = await r.json()
    setUploads(d.data || [])
  }

  useEffect(() => { loadUploads() }, [])
  useEffect(() => { setPage(1); load(1) }, [selectedUpload])
  useEffect(() => { load(page) }, [page])

  return (
    <PageWrapper title="Records" subtitle={`${total} record${total!==1?'s':''} imported`}>
      <div style={{ display:'flex', gap:'10px', alignItems:'center', marginBottom:'20px', flexWrap:'wrap' }}>
        <div style={{ position:'relative' }}>
          <select className="input-dark" style={{ minWidth:'220px' }} value={selectedUpload} onChange={e=>{setSelectedUpload(e.target.value);setPage(1)}}>
            <option value="all">All Uploads</option>
            {uploads.map((u:any) => <option key={u.id} value={u.id}>{u.filename} ({u.row_count} rows)</option>)}
          </select>
        </div>
        <span style={{ fontSize:'12px', color:'#475569', marginLeft:'auto' }}>
          Page {page} of {totalPages} &nbsp;·&nbsp; {total} total
        </span>
      </div>

      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        {loading ? (
          <div style={{ padding:'48px', textAlign:'center', color:'#475569' }}>Loading records…</div>
        ) : records.length === 0 ? (
          <div style={{ padding:'64px', textAlign:'center' }}>
            <Database size={32} color="#1e293b" style={{ margin:'0 auto 12px', display:'block' }}/>
            <p style={{ color:'#475569', fontWeight:600 }}>No records found</p>
            <p style={{ fontSize:'13px', color:'#334155' }}>Upload a CSV file to see records here</p>
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table className="table-dark" style={{ width:'100%' }}>
              <thead>
                <tr>
                  {columns.map(c => <th key={c} style={{ whiteSpace:'nowrap' }}>{c.toUpperCase()}</th>)}
                </tr>
              </thead>
              <tbody>
                {records.map((row: any, i: number) => (
                  <tr key={row.id||i}>
                    {columns.map(c => (
                      <td key={c} style={{ maxWidth:'180px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {String(row[c]??'').slice(0,80)||<span style={{color:'#1e293b'}}>—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', marginTop:'16px' }}>
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="btn-secondary" style={{ padding:'7px 12px', fontSize:'12px' }}><ChevronLeft size={14}/></button>
          <span style={{ fontSize:'13px', color:'#64748b' }}>Page {page} of {totalPages}</span>
          <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="btn-secondary" style={{ padding:'7px 12px', fontSize:'12px' }}><ChevronRight size={14}/></button>
        </div>
      )}
    </PageWrapper>
  )
}

export default function Records() {
  return <Suspense fallback={<PageWrapper title="Records" subtitle="Loading..."><div style={{padding:'48px',textAlign:'center',color:'#475569'}}>Loading…</div></PageWrapper>}><RecordsContent/></Suspense>
}
