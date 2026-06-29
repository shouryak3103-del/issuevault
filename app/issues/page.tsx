'use client'
import { useEffect, useState, useCallback } from 'react'
import PageWrapper from '@/components/PageWrapper'
import Toast from '@/components/Toast'
import { Plus, Search, Edit2, Trash2, Zap, X, ExternalLink, Filter, Bug, ChevronDown } from 'lucide-react'
import Link from 'next/link'

const TYPES     = ['all','bug','feature','task','enhancement','security']
const SEVERITIES= ['all','critical','high','medium','low']
const STATUSES  = ['all','open','in_progress','resolved','closed','rejected']

const SEV_BAR: Record<string,string> = { critical:'#ef4444', high:'#f97316', medium:'#ffe600', low:'#00f5ff' }

const EMPTY = { title:'', description:'', issue_type:'bug', severity:'medium', status:'open', assignee:'', reporter:'' }

export default function Issues() {
  const [issues,    setIssues]    = useState<any[]>([])
  const [loading,   setLoading]   = useState(true)
  const [filters,   setFilters]   = useState({ status:'all', severity:'all', issue_type:'all', search:'' })
  const [showModal, setShowModal] = useState(false)
  const [editIssue, setEditIssue] = useState<any>(null)
  const [toast,     setToast]     = useState<any>(null)
  const [form,      setForm]      = useState<any>(EMPTY)
  const [saving,    setSaving]    = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const p = new URLSearchParams()
    if (filters.status     !== 'all') p.set('status', filters.status)
    if (filters.severity   !== 'all') p.set('severity', filters.severity)
    if (filters.issue_type !== 'all') p.set('issue_type', filters.issue_type)
    if (filters.search)               p.set('search', filters.search)
    const r = await fetch('/api/issues?' + p)
    const d = await r.json()
    setIssues(d.data || [])
    setLoading(false)
  }, [filters])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(EMPTY); setEditIssue(null); setShowModal(true) }
  const openEdit   = (issue: any) => { setForm({ ...issue }); setEditIssue(issue); setShowModal(true) }

  const save = async () => {
    if (!form.title?.trim()) return setToast({ message: 'Title is required', type: 'error' })
    setSaving(true)
    const method = editIssue ? 'PUT' : 'POST'
    const body   = editIssue ? { id: editIssue.id, ...form } : form
    const r = await fetch('/api/issues', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const d = await r.json()
    setSaving(false)
    if (d.error) return setToast({ message: d.error, type: 'error' })
    setToast({ message: editIssue ? 'Issue updated' : 'Issue created!', type: 'success' })
    setShowModal(false)
    load()
  }

  const del = async (id: string) => {
    if (!confirm('Delete this issue?')) return
    await fetch('/api/issues', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setToast({ message: 'Issue deleted', type: 'info' })
    load()
  }

  const F = (k: string, v: string) => setFilters(p => ({ ...p, [k]: v }))

  return (
    <PageWrapper title="Issues" subtitle={`${issues.length} issue${issues.length !== 1 ? 's' : ''} found`}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Toolbar */}
      <div style={{ display:'flex', gap:'10px', alignItems:'center', marginBottom:'20px', flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:'200px' }}>
          <Search size={14} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:'#475569' }}/>
          <input className="input-dark" style={{ paddingLeft:'36px' }} placeholder="Search by title, reporter, assignee…"
            value={filters.search} onChange={e => F('search', e.target.value)}/>
        </div>
        {(['status','severity','issue_type'] as const).map(key => (
          <div key={key} style={{ position:'relative' }}>
            <select className="input-dark" style={{ paddingRight:'28px', minWidth:'130px', appearance:'none' }}
              value={filters[key]} onChange={e => F(key, e.target.value)}>
              {(key==='status' ? STATUSES : key==='severity' ? SEVERITIES : TYPES).map(v=>(
                <option key={v} value={v}>{v === 'all' ? `All ${key.replace('_',' ')}s` : v.replace('_',' ')}</option>
              ))}
            </select>
            <ChevronDown size={12} style={{ position:'absolute', right:'8px', top:'50%', transform:'translateY(-50%)', color:'#475569', pointerEvents:'none' }}/>
          </div>
        ))}
        <button onClick={openCreate} className="btn-primary" style={{ flexShrink:0 }}>
          <Plus size={14}/> New Issue
        </button>
      </div>

      {/* Table */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <table className="table-dark" style={{ width:'100%' }}>
          <thead>
            <tr>
              <th>TITLE</th>
              <th>TYPE</th>
              <th>SEVERITY</th>
              <th>STATUS</th>
              <th>ASSIGNEE</th>
              <th>REPORTER</th>
              <th>SOURCE</th>
              <th style={{ textAlign:'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({length:6}).map((_,i) => (
                <tr key={i}><td colSpan={8}>
                  <div style={{ height:'18px', background:'rgba(255,255,255,0.04)', borderRadius:'4px', margin:'4px 0', animation:'pulse 1.5s infinite' }}/>
                </td></tr>
              ))
            ) : issues.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign:'center', padding:'48px', color:'#334155' }}>
                <Bug size={32} style={{ margin:'0 auto 12px', opacity:0.3, display:'block' }}/>
                No issues match your filters
              </td></tr>
            ) : issues.map((issue: any) => (
              <tr key={issue.id} style={{ cursor:'pointer' }} onClick={() => window.location.href=`/issues/${issue.id}`}>
                <td style={{ maxWidth:'260px' }}>
                  <div style={{ fontWeight:500, color:'#e2e8f0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{issue.title}</div>
                  {issue.external_url && <a href={issue.external_url} target="_blank" onClick={e=>e.stopPropagation()} style={{ fontSize:'10px', color:'#475569', display:'flex', alignItems:'center', gap:'3px', marginTop:'2px' }}><ExternalLink size={9}/>{issue.source}</a>}
                </td>
                <td><span className={`badge badge-${issue.issue_type}`}>{issue.issue_type}</span></td>
                <td>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <span style={{ width:'6px', height:'6px', borderRadius:'50%', background: SEV_BAR[issue.severity]||'#475569', display:'inline-block', flexShrink:0 }}/>
                    <span className={`badge badge-${issue.severity}`}>{issue.severity}</span>
                  </div>
                </td>
                <td><span className={`badge badge-${issue.status}`}>{issue.status?.replace('_',' ')}</span></td>
                <td style={{ color:'#64748b', fontSize:'12px' }}>{issue.assignee || <span style={{ color:'#1e293b' }}>—</span>}</td>
                <td style={{ color:'#64748b', fontSize:'12px' }}>{issue.reporter || <span style={{ color:'#1e293b' }}>—</span>}</td>
                <td><span style={{ fontSize:'10px', padding:'2px 7px', borderRadius:'999px', background:'rgba(255,255,255,0.05)', color:'#475569', border:'1px solid rgba(255,255,255,0.06)' }}>{issue.source||'manual'}</span></td>
                <td style={{ textAlign:'right' }}>
                  <div style={{ display:'flex', gap:'6px', justifyContent:'flex-end' }}>
                    <button onClick={e=>{e.stopPropagation();openEdit(issue)}} className="btn-secondary" style={{ padding:'4px 9px', fontSize:'11px' }}><Edit2 size={11}/></button>
                    <button onClick={e=>{e.stopPropagation();del(issue.id)}} className="btn-danger" style={{ padding:'4px 9px', fontSize:'11px' }}><Trash2 size={11}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'16px', fontWeight:700, color:'white', margin:0 }}>{editIssue ? 'Edit Issue' : 'New Issue'}</h2>
              <button onClick={() => setShowModal(false)}><X size={18} color="#475569"/></button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              {[
                { label:'Title', key:'title', type:'text', placeholder:'Short descriptive title…', required:true },
                { label:'Assignee', key:'assignee', type:'text', placeholder:'Username or email' },
                { label:'Reporter', key:'reporter', type:'text', placeholder:'Who reported this' },
              ].map(({label,key,type,placeholder,required}) => (
                <div key={key}>
                  <label style={{ fontSize:'11px', color:'#64748b', display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:600 }}>{label}{required && <span style={{ color:'#ff2d78' }}> *</span>}</label>
                  <input className="input-dark" type={type} placeholder={placeholder} value={form[key]||''} onChange={e => setForm((p:any) => ({...p,[key]:e.target.value}))}/>
                </div>
              ))}
              <div>
                <label style={{ fontSize:'11px', color:'#64748b', display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:600 }}>Description</label>
                <textarea className="input-dark" rows={3} placeholder="Detailed description of the issue…" value={form.description||''} onChange={e => setForm((p:any) => ({...p,description:e.target.value}))} style={{ resize:'vertical' }}/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px' }}>
                {[
                  { label:'Type', key:'issue_type', opts:TYPES.slice(1) },
                  { label:'Severity', key:'severity', opts:SEVERITIES.slice(1) },
                  { label:'Status', key:'status', opts:STATUSES.slice(1) },
                ].map(({label,key,opts}) => (
                  <div key={key}>
                    <label style={{ fontSize:'11px', color:'#64748b', display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:600 }}>{label}</label>
                    <select className="input-dark" value={form[key]||''} onChange={e => setForm((p:any) => ({...p,[key]:e.target.value}))}>
                      {opts.map(o => <option key={o} value={o}>{o.replace('_',' ')}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
              <button onClick={save} disabled={saving} className="btn-primary" style={{ flex:1, justifyContent:'center', padding:'11px' }}>
                {saving ? 'Saving…' : editIssue ? 'Save Changes' : 'Create Issue'}
              </button>
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
