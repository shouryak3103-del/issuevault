'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import PageWrapper from '@/components/PageWrapper'
import Toast from '@/components/Toast'
import { ArrowLeft, Edit2, Trash2, Zap, Clock, User, Tag, AlertTriangle, CheckCircle, X, MessageSquare, Activity } from 'lucide-react'
import Link from 'next/link'

export default function IssueDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [issue, setIssue] = useState<any>(null)
  const [actions, setActions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<any>(null)
  const [actionModal, setActionModal] = useState(false)
  const [actionForm, setActionForm] = useState({ action_type: 'approve', notes: '' })
  const [editModal, setEditModal] = useState(false)
  const [form, setForm] = useState<any>({})

  const load = async () => {
    const [ir, ar] = await Promise.all([
      fetch(`/api/issues?id=${id}`),
      fetch(`/api/actions?issue_id=${id}`)
    ])
    const id_data = await ir.json()
    const act_data = await ar.json()
    const found = (id_data.data || []).find((x: any) => x.id === id)
    setIssue(found || null)
    setActions(act_data.data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const doAction = async () => {
    const r = await fetch('/api/actions', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ issue_id: id, ...actionForm, performed_by: 'shourya' }) })
    const d = await r.json()
    if (d.error) return setToast({ message: d.error, type: 'error' })
    setToast({ message: `Action "${actionForm.action_type}" recorded!`, type: 'success' })
    setActionModal(false)
    load()
  }

  const saveEdit = async () => {
    const r = await fetch('/api/issues', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, ...form }) })
    const d = await r.json()
    if (d.error) return setToast({ message: d.error, type: 'error' })
    setToast({ message: 'Issue updated!', type: 'success' })
    setEditModal(false)
    load()
  }

  const del = async () => {
    if (!confirm('Delete this issue permanently?')) return
    await fetch('/api/issues?id=' + id, { method: 'DELETE' })
    router.push('/issues')
  }

  if (loading) return <PageWrapper title="Issue Detail"><div className="text-slate-500 text-center py-20">Loading...</div></PageWrapper>
  if (!issue) return <PageWrapper title="Issue Detail"><div className="text-center py-20"><p className="text-slate-400 mb-4">Issue not found.</p><Link href="/issues" className="btn-primary">Back to Issues</Link></div></PageWrapper>

  const statusColors: any = { open:'#ff2d78', in_progress:'#ffe600', resolved:'#00ff94', closed:'#94a3b8', rejected:'#ef4444' }
  const sevColors: any = { critical:'#ef4444', high:'#f97316', medium:'#ffe600', low:'#00f5ff' }

  return (
    <PageWrapper title="" subtitle="">
      {toast && <Toast {...toast} onClose={() => setToast(null)}/>}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
        <Link href="/issues" className="flex items-center gap-1 hover:text-white transition-colors"><ArrowLeft size={14}/>Issues</Link>
        <span>/</span>
        <span className="text-slate-300 truncate max-w-xs">{issue.title}</span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main content */}
        <div className="col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className={`badge badge-${issue.status}`}>{issue.status.replace('_',' ')}</span>
                  <span className={`badge badge-${issue.severity}`}>{issue.severity}</span>
                  <span className={`badge badge-${issue.issue_type}`}>{issue.issue_type}</span>
                </div>
                <h1 className="text-xl font-bold text-white mb-3">{issue.title}</h1>
                <p className="text-slate-400 text-sm leading-relaxed">{issue.description || 'No description provided.'}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-5 pt-4 border-t border-white/5">
              <button onClick={() => { setForm({ title:issue.title, description:issue.description||'', issue_type:issue.issue_type, severity:issue.severity, status:issue.status, assignee:issue.assignee||'', reporter:issue.reporter }); setEditModal(true) }} className="btn-secondary"><Edit2 size={13}/>Edit</button>
              <button onClick={() => setActionModal(true)} className="btn-primary"><Zap size={13}/>Take Action</button>
              <button onClick={del} className="btn-danger" style={{marginLeft:'auto'}}><Trash2 size={13}/>Delete</button>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="card">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2"><Activity size={14} color="#9d00ff"/>Activity Timeline</h3>
            {actions.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">No actions taken yet.</p>
            ) : (
              <div className="space-y-4">
                {actions.map((a: any) => (
                  <div key={a.id} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{background:'rgba(157,0,255,0.2)',border:'1px solid rgba(157,0,255,0.4)'}}>
                      <Zap size={11} color="#9d00ff"/>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-white">{a.performed_by}</span>
                        <span className="text-xs text-slate-500">performed</span>
                        <span className={`badge badge-${a.action_type}`} style={{fontSize:'10px'}}>{a.action_type}</span>
                        {a.old_status && a.new_status && a.old_status !== a.new_status && (
                          <span className="text-xs text-slate-500">{a.old_status} → <span style={{color: statusColors[a.new_status]||'#fff'}}>{a.new_status}</span></span>
                        )}
                      </div>
                      {a.notes && <p className="text-xs text-slate-400 mt-1">{a.notes}</p>}
                      <p className="text-xs text-slate-600 mt-1">{new Date(a.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Details</h3>
            <div className="space-y-3">
              {[
                { label:'Reporter', value: issue.reporter, icon: User },
                { label:'Assignee', value: issue.assignee || 'Unassigned', icon: User },
                { label:'Created', value: new Date(issue.created_at).toLocaleDateString(), icon: Clock },
                { label:'Updated', value: new Date(issue.updated_at).toLocaleDateString(), icon: Clock },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5"><Icon size={11}/>{label}</span>
                  <span className="text-xs text-slate-300">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {['approve','fix','reject','reopen','close'].map(act => (
                <button key={act} onClick={() => { setActionForm({ action_type: act, notes: '' }); setActionModal(true) }}
                  className="w-full btn-secondary justify-start text-xs" style={{padding:'7px 10px'}}>
                  <Zap size={11}/>{act.charAt(0).toUpperCase() + act.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Stats</h3>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Total Actions</span>
              <span className="text-sm font-bold text-white">{actions.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {actionModal && (
        <div className="modal-overlay" onClick={() => setActionModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold gradient-header">Take Action</h2>
              <button onClick={() => setActionModal(false)}><X size={18} color="#64748b"/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider">Action Type</label>
                <select className="input-dark" value={actionForm.action_type} onChange={e => setActionForm(p => ({...p, action_type: e.target.value}))}>
                  {['approve','reject','fix','reopen','close','comment','assign'].map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider">Notes</label>
                <textarea className="input-dark resize-none" rows={3} placeholder="Add context or notes..." value={actionForm.notes} onChange={e => setActionForm(p => ({...p, notes: e.target.value}))}/>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={doAction} className="btn-primary flex-1">Confirm Action</button>
                <button onClick={() => setActionModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="modal-overlay" onClick={() => setEditModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold gradient-header">Edit Issue</h2>
              <button onClick={() => setEditModal(false)}><X size={18} color="#64748b"/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider">Title</label>
                <input className="input-dark" value={form.title} onChange={e => setForm((p:any) => ({...p, title: e.target.value}))}/>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider">Description</label>
                <textarea className="input-dark resize-none" rows={3} value={form.description} onChange={e => setForm((p:any) => ({...p, description: e.target.value}))}/>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[{key:'issue_type',opts:['bug','feature','task','enhancement','security']},{key:'severity',opts:['critical','high','medium','low']},{key:'status',opts:['open','in_progress','resolved','closed','rejected']}].map(({key,opts})=>(
                  <div key={key}>
                    <label className="text-xs text-slate-400 mb-1.5 block uppercase tracking-wider">{key.replace('_',' ')}</label>
                    <select className="input-dark" value={form[key]} onChange={e => setForm((p:any) => ({...p, [key]: e.target.value}))}>
                      {opts.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={saveEdit} className="btn-primary flex-1">Save Changes</button>
                <button onClick={() => setEditModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
