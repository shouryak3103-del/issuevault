'use client'
import { useEffect, useState, useCallback } from 'react'
import PageWrapper from '@/components/PageWrapper'
import Toast from '@/components/Toast'
import { Plus, Search, Filter, Edit2, Trash2, Zap, ChevronDown, X, RefreshCw } from 'lucide-react'

const TYPES = ['all','bug','feature','task','enhancement','security']
const SEVERITIES = ['all','critical','high','medium','low']
const STATUSES = ['all','open','in_progress','resolved','closed','rejected']

export default function Issues() {
  const [issues, setIssues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: 'all', severity: 'all', issue_type: 'all', search: '' })
  const [showModal, setShowModal] = useState(false)
  const [editIssue, setEditIssue] = useState<any>(null)
  const [actionModal, setActionModal] = useState<any>(null)
  const [toast, setToast] = useState<any>(null)
  const [form, setForm] = useState({ title: '', description: '', issue_type: 'bug', severity: 'medium', status: 'open', assignee: '', reporter: 'shourya' })

  const load = useCallback(async () => {
    setLoading(true)
    const p = new URLSearchParams()
    if (filters.status !== 'all') p.set('status', filters.status)
    if (filters.severity !== 'all') p.set('severity', filters.severity)
    if (filters.issue_type !== 'all') p.set('issue_type', filters.issue_type)
    if (filters.search) p.set('search', filters.search)
    const r = await fetch('/api/issues?' + p)
    const d = await r.json()
    setIssues(d.data || [])
    setLoading(false)
  }, [filters])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setEditIssue(null); setForm({ title: '', description: '', issue_type: 'bug', severity: 'medium', status: 'open', assignee: '', reporter: 'shourya' }); setShowModal(true) }
  const openEdit = (issue: any) => { setEditIssue(issue); setForm({ title: issue.title, description: issue.description||'', issue_type: issue.issue_type, severity: issue.severity, status: issue.status, assignee: issue.assignee||'', reporter: issue.reporter }); setShowModal(true) }

  const save = async () => {
    if (!form.title.trim()) return setToast({ message: 'Title required', type: 'error' })
    const method = editIssue ? 'PUT' : 'POST'
    const body = editIssue ? { ...form, id: editIssue.id } : form
    const r = await fetch('/api/issues', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const d = await r.json()
    if (d.error) return setToast({ message: d.error, type: 'error' })
    setToast({ message: editIssue ? 'Issue updated!' : 'Issue created!', type: 'success' })
    setShowModal(false)
    load()
  }

  const del = async (id: string) => {
    if (!confirm('Delete this issue?')) return
    await fetch('/api/issues?id=' + id, { method: 'DELETE' })
    setToast({ message: 'Issue deleted', type: 'info' })
    load()
  }

  const doAction = async (action: string) => {
    const notes = actionModal.notes || ''
    const r = await fetch('/api/actions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ issue_id: actionModal.issue.id, action_type: action, notes }) })
    const d = await r.json()
    if (d.error) return setToast({ message: d.error, type: 'error' })
    setToast({ message: `Action "${action}" recorded!`, type: 'success' })
    setActionModal(null)
    load()
  }

  const f = (key: string, val: string) => setFilters(p => ({ ...p, [key]: val }))

  return (
    <PageWrapper title="Issues" subtitle={`${issues.length} issues found`}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Filter bar */}
      <div className="card mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input className="input-dark pl-9" placeholder="Search issues..." value={filters.search} onChange={e => f('search', e.target.value)} />
          </div>
          {[{key:'status', opts: STATUSES}, {key:'severity', opts: SEVERITIES}, {key:'issue_type', opts: TYPES}].map(({key, opts}) => (
            <select key={key} className="input-dark w-40" value={filters[key as keyof typeof filters]} onChange={e => f(key, e.target.value)}>
              {opts.map(o => <option key={o} value={o}>{o === 'all' ? `All ${key.replace('_',' ')}s` : o}</option>)}
            </select>
          ))}
          <button onClick={load} className="btn-secondary flex items-center gap-1"><RefreshCw size={13} />Refresh</button>
          <button onClick={openCreate} className="btn-primary flex items-center gap-1"><Plus size={14} />New Issue</button>
        </div>
      </div>

      {/* Issues table */}
      <div className="card overflow-hidden p-0">
        <table className="table-dark">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Reporter</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center text-slate-500 py-10">Loading...</td></tr>
            ) : issues.length === 0 ? (
              <tr><td colSpan={7} className="text-center text-slate-500 py-10">No issues found. Create one!</td></tr>
            ) : issues.map(issue => (
              <tr key={issue.id}>
                <td className="max-w-[260px]">
                  <div className="font-medium text-slate-200 truncate">{issue.title}</div>
                  {issue.description && <div className="text-xs text-slate-500 truncate mt-0.5">{issue.description}</div>}
                </td>
                <td><span className={`badge badge-${issue.issue_type}`}>{issue.issue_type}</span></td>
                <td><span className={`badge badge-${issue.severity}`}>{issue.severity}</span></td>
                <td><span className={`badge badge-${issue.status}`}>{issue.status.replace('_',' ')}</span></td>
                <td><span className="text-slate-400">{issue.reporter}</span></td>
                <td className="text-slate-500 text-xs">{new Date(issue.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setActionModal({issue, notes:''})} className="p-1.5 rounded-md hover:bg-purple-500/20 text-purple-400 transition-colors" title="Actions"><Zap size={13} /></button>
                    <button onClick={() => openEdit(issue)} className="p-1.5 rounded-md hover:bg-blue-500/20 text-blue-400 transition-colors" title="Edit"><Edit2 size={13} /></button>
                    <button onClick={() => del(issue.id)} className="p-1.5 rounded-md hover:bg-red-500/20 text-red-400 transition-colors" title="Delete"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold gradient-header">{editIssue ? 'Edit Issue' : 'Create New Issue'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider">Title *</label>
                <input className="input-dark" placeholder="Brief description of the issue" value={form.title} onChange={e => setForm(p=>({...p, title:e.target.value}))} />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider">Description</label>
                <textarea className="input-dark resize-none" rows={3} placeholder="Detailed description..." value={form.description} onChange={e => setForm(p=>({...p, description:e.target.value}))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider">Type</label>
                  <select className="input-dark" value={form.issue_type} onChange={e => setForm(p=>({...p, issue_type:e.target.value}))}>
                    {['bug','feature','task','enhancement','security'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider">Severity</label>
                  <select className="input-dark" value={form.severity} onChange={e => setForm(p=>({...p, severity:e.target.value}))}>
                    {['critical','high','medium','low'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider">Status</label>
                  <select className="input-dark" value={form.status} onChange={e => setForm(p=>({...p, status:e.target.value}))}>
                    {['open','in_progress','resolved','closed','rejected'].map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider">Assignee</label>
                  <input className="input-dark" placeholder="assignee@email.com" value={form.assignee} onChange={e => setForm(p=>({...p, assignee:e.target.value}))} />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider">Reporter</label>
                <input className="input-dark" placeholder="reporter name" value={form.reporter} onChange={e => setForm(p=>({...p, reporter:e.target.value}))} />
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={save} className="btn-primary">{editIssue ? 'Save Changes' : 'Create Issue'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {actionModal && (
        <div className="modal-overlay" onClick={() => setActionModal(null)}>
          <div className="modal max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold gradient-header">Take Action</h2>
              <button onClick={() => setActionModal(null)} className="text-slate-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="card mb-4 p-3">
              <div className="text-sm font-medium text-slate-200 mb-1">{actionModal.issue.title}</div>
              <div className="flex gap-2">
                <span className={`badge badge-${actionModal.issue.status}`}>{actionModal.issue.status}</span>
                <span className={`badge badge-${actionModal.issue.severity}`}>{actionModal.issue.severity}</span>
              </div>
            </div>
            <textarea className="input-dark mb-4 resize-none" rows={3} placeholder="Add notes (optional)..." value={actionModal.notes} onChange={e => setActionModal((p: any) => ({...p, notes: e.target.value}))} />
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => doAction('approve')} className="btn-success text-sm py-2">✓ Approve</button>
              <button onClick={() => doAction('reject')} className="btn-danger text-sm py-2">✗ Reject</button>
              <button onClick={() => doAction('fix')} className="btn-primary text-sm py-2">⚡ Fix</button>
              <button onClick={() => doAction('reopen')} className="btn-secondary text-sm py-2">↺ Reopen</button>
              <button onClick={() => doAction('comment')} className="btn-secondary text-sm py-2">💬 Comment</button>
              <button onClick={() => doAction('assign')} className="btn-secondary text-sm py-2">👤 Assign</button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
