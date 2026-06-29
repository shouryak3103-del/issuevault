'use client'
import { useEffect, useState } from 'react'
import PageWrapper from '@/components/PageWrapper'
import Toast from '@/components/Toast'
import { Zap, CheckCircle, XCircle, Wrench, MessageSquare, RotateCcw, UserCheck, Plus, X, Trash2, RefreshCw } from 'lucide-react'
import Link from 'next/link'

const ACTION_META: Record<string,{icon:any;color:string;bg:string}> = {
  approve: { icon:CheckCircle, color:'#00ff94', bg:'rgba(0,255,148,0.1)' },
  reject:  { icon:XCircle,    color:'#ef4444', bg:'rgba(239,68,68,0.1)' },
  fix:     { icon:Wrench,     color:'#9d00ff', bg:'rgba(157,0,255,0.1)' },
  comment: { icon:MessageSquare,color:'#00f5ff',bg:'rgba(0,245,255,0.1)' },
  reopen:  { icon:RotateCcw,  color:'#ffe600', bg:'rgba(255,230,0,0.1)' },
  assign:  { icon:UserCheck,  color:'#ff2d78', bg:'rgba(255,45,120,0.1)' },
}
const TYPES = ['approve','reject','fix','comment','reopen','assign']

export default function Actions() {
  const [actions, setActions] = useState<any[]>([])
  const [issues,  setIssues]  = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [toast,   setToast]   = useState<any>(null)
  const [modal,   setModal]   = useState(false)
  const [saving,  setSaving]  = useState(false)
  const [form, setForm] = useState({ issue_id:'', action_type:'approve', notes:'', performed_by:'' })

  const load = async () => {
    setLoading(true)
    const [ar, ir] = await Promise.all([fetch('/api/actions'), fetch('/api/issues')])
    const [ad, id_] = await Promise.all([ar.json(), ir.json()])
    setActions(ad.data || [])
    setIssues(id_.data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.issue_id) return setToast({ message:'Select an issue', type:'error' })
    setSaving(true)
    const r = await fetch('/api/actions', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
    const d = await r.json()
    setSaving(false)
    if (d.error) return setToast({ message:d.error, type:'error' })
    setToast({ message:'Action logged!', type:'success' })
    setModal(false)
    setForm({ issue_id:'', action_type:'approve', notes:'', performed_by:'' })
    load()
  }

  const del = async (id: string) => {
    await fetch('/api/actions', { method:'DELETE', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id}) })
    setToast({ message:'Action deleted', type:'info' })
    load()
  }

  // Group by issue
  const grouped: Record<string,any[]> = {}
  actions.forEach(a => { const k = a.issue_id || 'unlinked'; if (!grouped[k]) grouped[k]=[]; grouped[k].push(a) })
  const issueMap: Record<string,any> = {}
  issues.forEach(i => issueMap[i.id] = i)

  return (
    <PageWrapper title="Actions" subtitle="All logged actions across every issue">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
        <div style={{ display:'flex', gap:'10px' }}>
          {TYPES.map(t => {
            const m = ACTION_META[t]
            const Icon = m.icon
            const count = actions.filter(a => a.action_type === t).length
            return (
              <div key={t} style={{ display:'flex', alignItems:'center', gap:'5px', padding:'5px 10px', borderRadius:'8px', background:m.bg, border:`1px solid ${m.color}22` }}>
                <Icon size={12} color={m.color}/><span style={{ fontSize:'11px', color:m.color, fontWeight:600 }}>{t}</span>
                {count > 0 && <span style={{ fontSize:'11px', color:m.color, fontFamily:'monospace' }}>{count}</span>}
              </div>
            )
          })}
        </div>
        <button onClick={() => setModal(true)} className="btn-primary"><Plus size={14}/> Log Action</button>
      </div>

      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {Array.from({length:4}).map((_,i) => <div key={i} className="card" style={{ height:'80px', background:'rgba(255,255,255,0.03)', animation:'pulse 1.5s infinite' }}/>)}
        </div>
      ) : actions.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:'64px 24px' }}>
          <Zap size={40} color="#1e293b" style={{ margin:'0 auto 14px', display:'block' }}/>
          <p style={{ color:'#64748b', fontWeight:600, marginBottom:'6px' }}>No actions logged yet</p>
          <p style={{ fontSize:'13px', color:'#334155', marginBottom:'20px' }}>Log approvals, fixes, comments, and more on any issue</p>
          <button onClick={() => setModal(true)} className="btn-primary" style={{ margin:'0 auto' }}><Plus size={14}/> Log First Action</button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {actions.map((action: any) => {
            const m = ACTION_META[action.action_type] || { icon:Zap, color:'#9d00ff', bg:'rgba(157,0,255,0.1)' }
            const Icon = m.icon
            const issue = issueMap[action.issue_id]
            return (
              <div key={action.id} className="card" style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:'14px' }}>
                <div style={{ width:'38px', height:'38px', borderRadius:'10px', background:m.bg, border:`1px solid ${m.color}33`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={17} color={m.color}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'3px' }}>
                    <span style={{ fontWeight:600, fontSize:'13px', color:'white', textTransform:'capitalize' }}>{action.action_type}</span>
                    {issue && (
                      <Link href={`/issues/${issue.id}`} onClick={e=>e.stopPropagation()}
                        style={{ fontSize:'11px', color:'#475569', textDecoration:'none', padding:'1px 7px', borderRadius:'999px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.07)' }}>
                        {issue.title?.slice(0,40)}{issue.title?.length>40?'…':''}
                      </Link>
                    )}
                  </div>
                  {action.notes && <p style={{ fontSize:'12px', color:'#64748b', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{action.notes}</p>}
                </div>
                <div style={{ flexShrink:0, textAlign:'right' }}>
                  {action.performed_by && <div style={{ fontSize:'12px', color:'#64748b', marginBottom:'2px' }}>{action.performed_by}</div>}
                  <div style={{ fontSize:'11px', color:'#334155' }}>{new Date(action.created_at||action.created_date).toLocaleString()}</div>
                </div>
                <button onClick={() => del(action.id)} className="btn-danger" style={{ padding:'5px 9px', fontSize:'11px', flexShrink:0 }}><Trash2 size={11}/></button>
              </div>
            )
          })}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" style={{ maxWidth:'480px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'16px', fontWeight:700, color:'white', margin:0 }}>Log Action</h2>
              <button onClick={() => setModal(false)}><X size={18} color="#475569"/></button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              <div>
                <label style={{ fontSize:'11px', color:'#64748b', display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:600 }}>Issue <span style={{ color:'#ff2d78' }}>*</span></label>
                <select className="input-dark" value={form.issue_id} onChange={e => setForm(p => ({...p,issue_id:e.target.value}))}>
                  <option value="">— Select issue —</option>
                  {issues.map((i:any) => <option key={i.id} value={i.id}>{i.title}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:'11px', color:'#64748b', display:'block', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:600 }}>Action Type</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                  {TYPES.map(t => {
                    const m = ACTION_META[t]; const sel = form.action_type === t
                    return (
                      <button key={t} type="button" onClick={() => setForm(p => ({...p,action_type:t}))}
                        style={{ fontSize:'12px', padding:'6px 14px', borderRadius:'8px', cursor:'pointer', fontWeight:500,
                          background: sel ? m.bg : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${sel ? m.color+'55' : 'rgba(255,255,255,0.08)'}`,
                          color: sel ? m.color : '#64748b', transition:'all 0.15s' }}>
                        {t}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <label style={{ fontSize:'11px', color:'#64748b', display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:600 }}>Notes</label>
                <textarea className="input-dark" rows={3} placeholder="What was done?" value={form.notes} onChange={e => setForm(p => ({...p,notes:e.target.value}))} style={{ resize:'vertical' }}/>
              </div>
              <div>
                <label style={{ fontSize:'11px', color:'#64748b', display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:600 }}>Performed By</label>
                <input className="input-dark" placeholder="Your name or username" value={form.performed_by} onChange={e => setForm(p => ({...p,performed_by:e.target.value}))}/>
              </div>
            </div>
            <div style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
              <button onClick={save} disabled={saving} className="btn-primary" style={{ flex:1, justifyContent:'center', padding:'11px' }}>{saving?'Saving…':'Log Action'}</button>
              <button onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
