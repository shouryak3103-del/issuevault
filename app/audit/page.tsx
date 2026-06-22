'use client'
import { useEffect, useState } from 'react'
import PageWrapper from '@/components/PageWrapper'
import { History, ChevronLeft, ChevronRight, RefreshCw, Database, Edit2, Trash2, Plus, Zap, Upload } from 'lucide-react'

const ACTION_META: Record<string, { icon: any; color: string; badge: string }> = {
  CREATE:   { icon: Plus,     color: 'text-neon-green',  badge: 'badge-resolved'    },
  UPDATE:   { icon: Edit2,    color: 'text-neon-cyan',   badge: 'badge-in_progress' },
  DELETE:   { icon: Trash2,   color: 'text-red-400',     badge: 'badge-rejected'    },
  CSV_UPLOAD:{ icon: Upload,  color: 'text-neon-purple', badge: 'badge-feature'     },
}

function getActionMeta(action: string) {
  for (const key of Object.keys(ACTION_META)) {
    if (action.includes(key)) return ACTION_META[key]
  }
  return { icon: Zap, color: 'text-neon-yellow', badge: 'badge-open' }
}

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [tableFilter, setTableFilter] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const load = async (p = 1) => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(p) })
    if (tableFilter !== 'all') params.set('table', tableFilter)
    const r = await fetch('/api/audit?' + params)
    const d = await r.json()
    setLogs(d.data || [])
    setPage(p)
    setTotalPages(d.totalPages || 1)
    setTotal(d.count || 0)
    setLoading(false)
  }

  useEffect(() => { load(1) }, [tableFilter])

  return (
    <PageWrapper title="Audit Log" subtitle={`${total} total events recorded`}>
      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <History size={14} className="text-neon-purple"/>
          <span className="text-slate-400 text-sm">Filter by table:</span>
        </div>
        {['all','issues','uploads','records'].map(t=>(
          <button
            key={t}
            onClick={()=>setTableFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tableFilter===t ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/40' : 'bg-white/5 text-slate-400 border border-white/10 hover:border-neon-purple/30'}`}
          >{t === 'all' ? 'All Tables' : t}</button>
        ))}
        <button onClick={()=>load(page)} className="btn-secondary flex items-center gap-1 ml-auto"><RefreshCw size={13}/>Refresh</button>
        <span className="text-slate-500 text-sm">Page {page}/{totalPages}</span>
      </div>

      {/* Log table */}
      <div className="card overflow-hidden p-0">
        <table className="table-dark">
          <thead>
            <tr>
              <th>Action</th>
              <th>Table</th>
              <th>Record ID</th>
              <th>By</th>
              <th>Changes</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center text-neon-purple py-10 animate-pulse font-mono">Loading audit log...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-slate-500 py-10">
                No audit events yet — start creating issues and taking actions to see logs here.
              </td></tr>
            ) : logs.map((log: any) => {
              const meta = getActionMeta(log.action)
              const Icon = meta.icon
              const isExpanded = expanded === log.id
              return (
                <>
                  <tr key={log.id} className="cursor-pointer" onClick={()=>setExpanded(isExpanded ? null : log.id)}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Icon size={13} className={meta.color}/>
                        <span className={`badge ${meta.badge}`}>{log.action}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Database size={11} className="text-slate-500"/>
                        <span className="text-slate-300 text-xs">{log.table_name}</span>
                      </div>
                    </td>
                    <td className="font-mono text-xs text-slate-500">{log.record_id ? log.record_id.slice(0,12)+'…' : '—'}</td>
                    <td className="text-slate-400 text-sm">{log.performed_by}</td>
                    <td>
                      {(log.old_data || log.new_data) ? (
                        <button className="text-xs text-neon-cyan hover:underline">{isExpanded ? 'Hide ▲' : 'View ▼'}</button>
                      ) : <span className="text-slate-600 text-xs">—</span>}
                    </td>
                    <td className="text-slate-500 text-xs">{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                  {isExpanded && (log.old_data || log.new_data) && (
                    <tr key={log.id+'-expanded'}>
                      <td colSpan={6} className="bg-black/20 px-4 py-3">
                        <div className="grid grid-cols-2 gap-4">
                          {log.old_data && (
                            <div>
                              <p className="text-xs text-red-400 mb-1 font-mono uppercase tracking-wider">Before</p>
                              <pre className="text-xs text-slate-400 bg-red-500/5 border border-red-500/10 rounded p-2 overflow-auto max-h-32">{JSON.stringify(log.old_data, null, 2)}</pre>
                            </div>
                          )}
                          {log.new_data && (
                            <div>
                              <p className="text-xs text-neon-green mb-1 font-mono uppercase tracking-wider">After</p>
                              <pre className="text-xs text-slate-400 bg-green-500/5 border border-green-500/10 rounded p-2 overflow-auto max-h-32">{JSON.stringify(log.new_data, null, 2)}</pre>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
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
