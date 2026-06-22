'use client'
import { useEffect, useState } from 'react'
import PageWrapper from '@/components/PageWrapper'
import { Zap, CheckCircle, XCircle, Wrench, MessageSquare, RefreshCw, RotateCcw, UserCheck } from 'lucide-react'

const ACTION_ICONS: Record<string, any> = {
  approve: CheckCircle,
  reject: XCircle,
  fix: Wrench,
  comment: MessageSquare,
  reopen: RotateCcw,
  assign: UserCheck,
}

const ACTION_COLORS: Record<string, string> = {
  approve: 'text-neon-green',
  reject: 'text-red-400',
  fix: 'text-neon-purple',
  comment: 'text-neon-cyan',
  reopen: 'text-neon-yellow',
  assign: 'text-blue-400',
}

const BADGE_COLORS: Record<string, string> = {
  approve: 'badge-resolved',
  reject: 'badge-rejected',
  fix: 'badge-feature',
  comment: 'badge-task',
  reopen: 'badge-open',
  assign: 'badge-in_progress',
}

export default function ActionsPage() {
  const [actions, setActions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const load = async () => {
    setLoading(true)
    const r = await fetch('/api/actions')
    const d = await r.json()
    setActions(d.data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = filter === 'all' ? actions : actions.filter(a => a.action_type === filter)

  const counts = actions.reduce((acc: any, a) => {
    acc[a.action_type] = (acc[a.action_type] || 0) + 1
    return acc
  }, {})

  return (
    <PageWrapper title="Actions" subtitle="All approve / reject / fix actions across issues">
      {/* Summary cards */}
      <div className="grid grid-cols-6 gap-3 mb-6">
        {['approve','reject','fix','comment','reopen','assign'].map(type => {
          const Icon = ACTION_ICONS[type]
          const color = ACTION_COLORS[type]
          return (
            <button
              key={type}
              onClick={() => setFilter(filter === type ? 'all' : type)}
              className={`card card-hover text-center cursor-pointer transition-all ${filter === type ? 'border-neon-purple/50 bg-neon-purple/10' : ''}`}
            >
              <Icon size={20} className={`${color} mx-auto mb-2`}/>
              <div className="text-xl font-bold text-white font-mono">{counts[type] || 0}</div>
              <div className="text-xs text-slate-500 capitalize mt-1">{type}</div>
            </button>
          )
        })}
      </div>

      {/* Filter + refresh */}
      <div className="flex items-center gap-3 mb-4">
        <select className="input-dark w-48" value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="all">All Actions</option>
          {['approve','reject','fix','comment','reopen','assign'].map(t=>(
            <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>
          ))}
        </select>
        <button onClick={load} className="btn-secondary flex items-center gap-1"><RefreshCw size={13}/>Refresh</button>
        <span className="text-slate-500 text-sm ml-auto">{filtered.length} actions</span>
      </div>

      {/* Actions table */}
      <div className="card overflow-hidden p-0">
        <table className="table-dark">
          <thead>
            <tr>
              <th>Action</th>
              <th>Issue</th>
              <th>Status Change</th>
              <th>Performed By</th>
              <th>Notes</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center text-neon-purple py-10 animate-pulse">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center text-slate-500 py-10">
                No actions yet. Go to Issues and take an action on one.
              </td></tr>
            ) : filtered.map((action: any) => {
              const Icon = ACTION_ICONS[action.action_type] || Zap
              const color = ACTION_COLORS[action.action_type] || 'text-slate-400'
              return (
                <tr key={action.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Icon size={14} className={color}/>
                      <span className={`badge ${BADGE_COLORS[action.action_type] || 'badge-task'}`}>{action.action_type}</span>
                    </div>
                  </td>
                  <td className="max-w-[220px]">
                    {action.issue ? (
                      <div>
                        <p className="text-slate-200 text-sm truncate">{action.issue.title}</p>
                        <div className="flex gap-1 mt-0.5">
                          <span className={`badge badge-${action.issue.severity} text-[10px]`}>{action.issue.severity}</span>
                          <span className={`badge badge-${action.issue.issue_type} text-[10px]`}>{action.issue.issue_type}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-xs font-mono">{action.issue_id?.slice(0,8)}…</span>
                    )}
                  </td>
                  <td>
                    {action.old_status && action.new_status && action.old_status !== action.new_status ? (
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`badge badge-${action.old_status}`}>{action.old_status}</span>
                        <span className="text-slate-500">→</span>
                        <span className={`badge badge-${action.new_status}`}>{action.new_status}</span>
                      </div>
                    ) : (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                  </td>
                  <td className="text-slate-400 text-sm">{action.performed_by}</td>
                  <td className="max-w-[200px]">
                    {action.notes ? (
                      <span className="text-slate-400 text-xs truncate block">{action.notes}</span>
                    ) : (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                  </td>
                  <td className="text-slate-500 text-xs">{new Date(action.created_at).toLocaleString()}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  )
}
