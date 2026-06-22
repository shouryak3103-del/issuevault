'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PageWrapper from '@/components/PageWrapper'
import { Database, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'

function RecordsContent() {
  const searchParams = useSearchParams()
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [uploads, setUploads] = useState<any[]>([])
  const [selectedUpload, setSelectedUpload] = useState(searchParams.get('upload_id') || 'all')
  const [columns, setColumns] = useState<string[]>([])

  const load = async (p = 1) => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(p) })
    if (selectedUpload !== 'all') params.set('upload_id', selectedUpload)
    const r = await fetch('/api/records?' + params)
    const d = await r.json()
    const recs = d.data || []
    setRecords(recs)
    setPage(p)
    setTotalPages(d.totalPages || 1)
    setTotal(d.count || 0)
    if (recs.length > 0) setColumns(Object.keys(recs[0].data || {}).slice(0, 10))
    setLoading(false)
  }

  useEffect(() => {
    fetch('/api/uploads').then(r=>r.json()).then(d=>setUploads(d.data||[]))
  }, [])
  useEffect(() => { load(1) }, [selectedUpload])

  return (
    <PageWrapper title="Records" subtitle={`${total} total records stored from CSV uploads`}>
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <select className="input-dark w-64" value={selectedUpload} onChange={e=>setSelectedUpload(e.target.value)}>
          <option value="all">All Uploads</option>
          {uploads.map((u:any)=>(
            <option key={u.id} value={u.id}>{u.filename} ({u.row_count} rows)</option>
          ))}
        </select>
        <button onClick={()=>load(page)} className="btn-secondary flex items-center gap-1"><RefreshCw size={13}/>Refresh</button>
        <span className="text-slate-500 text-sm ml-auto">Page {page} of {totalPages} · {total} records</span>
      </div>

      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="p-10 text-center text-neon-purple animate-pulse font-mono">Loading records...</div>
        ) : records.length === 0 ? (
          <div className="p-10 text-center">
            <Database size={40} className="mx-auto mb-3 text-slate-600"/>
            <p className="text-slate-400 mb-4">No records yet. Upload a CSV to get started.</p>
            <a href="/upload" className="btn-primary inline-block text-sm">Upload CSV</a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-dark">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Upload</th>
                  {columns.map(c=><th key={c}>{c}</th>)}
                  <th>Ingested At</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec:any, i:number)=>(
                  <tr key={rec.id}>
                    <td className="text-slate-600 font-mono text-xs">{(page-1)*50+i+1}</td>
                    <td className="text-xs text-slate-500 max-w-[120px] truncate">{rec.upload?.filename||'—'}</td>
                    {columns.map(c=>(
                      <td key={c} className="max-w-[140px]">
                        <span className="truncate block">{String(rec.data?.[c]??'—')}</span>
                      </td>
                    ))}
                    <td className="text-xs text-slate-500">{new Date(rec.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button onClick={()=>load(Math.max(1,page-1))} disabled={page===1} className="btn-secondary flex items-center gap-1 disabled:opacity-40">
            <ChevronLeft size={14}/>Prev
          </button>
          <span className="text-slate-400 text-sm">{page} / {totalPages}</span>
          <button onClick={()=>load(Math.min(totalPages,page+1))} disabled={page===totalPages} className="btn-secondary flex items-center gap-1 disabled:opacity-40">
            Next<ChevronRight size={14}/>
          </button>
        </div>
      )}
    </PageWrapper>
  )
}

export default function RecordsPage() {
  return <Suspense fallback={<div className="p-8 text-slate-400">Loading...</div>}><RecordsContent/></Suspense>
}
