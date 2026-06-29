'use client'
import { useEffect, useState } from 'react'
import PageWrapper from '@/components/PageWrapper'
import Toast from '@/components/Toast'
import { Plus, Edit2, Trash2, X, Mail, Shield, Users } from 'lucide-react'

const ROLES = ['admin','developer','viewer','tester','manager']
const ROLE_COLORS: Record<string,string> = { admin:'#ff2d78', developer:'#9d00ff', tester:'#00f5ff', viewer:'#94a3b8', manager:'#00ff94' }
const GRADIENTS = [
  'linear-gradient(135deg,#9d00ff,#ff2d78)',
  'linear-gradient(135deg,#00f5ff,#9d00ff)',
  'linear-gradient(135deg,#ff2d78,#ffe600)',
  'linear-gradient(135deg,#00ff94,#00f5ff)',
  'linear-gradient(135deg,#ffe600,#f97316)',
]
const EMPTY = { name:'', email:'', role:'developer', department:'' }

export default function Team() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [toast,   setToast]   = useState<any>(null)
  const [modal,   setModal]   = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form,    setForm]    = useState<any>(EMPTY)
  const [saving,  setSaving]  = useState(false)

  const load = async () => {
    setLoading(true)
    const r = await fetch('/api/team')
    const d = await r.json()
    setMembers(d.data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY); setEditing(null); setModal(true) }
  const openEdit   = (m: any) => { setForm({...m}); setEditing(m); setModal(true) }

  const save = async () => {
    if (!form.name?.trim()) return setToast({ message:'Name is required', type:'error' })
    setSaving(true)
    const method = editing ? 'PUT' : 'POST'
    const body   = editing ? { id:editing.id, ...form } : form
    const r = await fetch('/api/team', { method, headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) })
    const d = await r.json()
    setSaving(false)
    if (d.error) return setToast({ message:d.error, type:'error' })
    setToast({ message: editing ? 'Member updated' : 'Member added!', type:'success' })
    setModal(false); load()
  }

  const del = async (id: string) => {
    if (!confirm('Remove this member?')) return
    await fetch('/api/team', { method:'DELETE', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id}) })
    setToast({ message:'Member removed', type:'info' })
    load()
  }

  const roleCount = ROLES.reduce((acc,r) => { acc[r] = members.filter(m=>m.role===r).length; return acc }, {} as Record<string,number>)

  return (
    <PageWrapper title="Team" subtitle={`${members.length} member${members.length!==1?'s':''}`}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Role summary bar */}
      <div style={{ display:'flex', gap:'10px', marginBottom:'24px', flexWrap:'wrap' }}>
        {ROLES.map(r => (
          <div key={r} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 12px', borderRadius:'8px', background:`${ROLE_COLORS[r]}12`, border:`1px solid ${ROLE_COLORS[r]}28` }}>
            <Shield size={12} color={ROLE_COLORS[r]}/>
            <span style={{ fontSize:'12px', color:ROLE_COLORS[r], fontWeight:600, textTransform:'capitalize' }}>{r}</span>
            <span style={{ fontSize:'12px', color:ROLE_COLORS[r], fontFamily:'monospace' }}>{roleCount[r]||0}</span>
          </div>
        ))}
        <button onClick={openCreate} className="btn-primary" style={{ marginLeft:'auto' }}><Plus size={14}/> Add Member</button>
      </div>

      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'14px' }}>
          {Array.from({length:6}).map((_,i)=><div key={i} className="card" style={{ height:'120px', background:'rgba(255,255,255,0.03)', animation:'pulse 1.5s infinite' }}/>)}
        </div>
      ) : members.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:'64px 24px' }}>
          <Users size={40} color="#1e293b" style={{ margin:'0 auto 14px', display:'block' }}/>
          <p style={{ color:'#64748b', fontWeight:600, marginBottom:'6px' }}>No team members yet</p>
          <button onClick={openCreate} className="btn-primary" style={{ margin:'0 auto' }}><Plus size={14}/> Add First Member</button>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'14px' }}>
          {members.map((m: any, idx: number) => (
            <div key={m.id} className="card card-hover" style={{ padding:'20px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'14px' }}>
                <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:GRADIENTS[idx%5], display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', fontWeight:700, color:'white', flexShrink:0 }}>
                  {m.name?.[0]?.toUpperCase()||'?'}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, color:'white', fontSize:'14px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.name}</div>
                  {m.department && <div style={{ fontSize:'11px', color:'#475569', marginTop:'1px' }}>{m.department}</div>}
                </div>
                <span style={{ fontSize:'10px', padding:'3px 9px', borderRadius:'999px', background:`${ROLE_COLORS[m.role]||'#475569'}18`, color:ROLE_COLORS[m.role]||'#94a3b8', border:`1px solid ${ROLE_COLORS[m.role]||'#475569'}30`, fontWeight:600 }}>
                  {m.role}
                </span>
              </div>
              {m.email && (
                <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'14px' }}>
                  <Mail size={11} color="#334155"/>
                  <span style={{ fontSize:'12px', color:'#475569', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.email}</span>
                </div>
              )}
              <div style={{ display:'flex', gap:'7px' }}>
                <button onClick={() => openEdit(m)} className="btn-secondary" style={{ flex:1, fontSize:'12px', padding:'7px', justifyContent:'center' }}><Edit2 size={12}/> Edit</button>
                <button onClick={() => del(m.id)} className="btn-danger" style={{ fontSize:'12px', padding:'7px 10px' }}><Trash2 size={12}/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" style={{ maxWidth:'440px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'16px', fontWeight:700, color:'white', margin:0 }}>{editing?'Edit Member':'Add Member'}</h2>
              <button onClick={() => setModal(false)}><X size={18} color="#475569"/></button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              {[
                {label:'Full Name',  key:'name',       placeholder:'Jane Doe',           required:true},
                {label:'Email',      key:'email',      placeholder:'jane@company.com'},
                {label:'Department', key:'department', placeholder:'Engineering, Design…'},
              ].map(({label,key,placeholder,required}) => (
                <div key={key}>
                  <label style={{ fontSize:'11px', color:'#64748b', display:'block', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:600 }}>{label}{required&&<span style={{color:'#ff2d78'}}> *</span>}</label>
                  <input className="input-dark" placeholder={placeholder} value={form[key]||''} onChange={e=>setForm((p:any)=>({...p,[key]:e.target.value}))}/>
                </div>
              ))}
              <div>
                <label style={{ fontSize:'11px', color:'#64748b', display:'block', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:600 }}>Role</label>
                <div style={{ display:'flex', gap:'7px', flexWrap:'wrap' }}>
                  {ROLES.map(r => (
                    <button key={r} type="button" onClick={() => setForm((p:any)=>({...p,role:r}))}
                      style={{ fontSize:'12px', padding:'6px 14px', borderRadius:'8px', cursor:'pointer', fontWeight:500,
                        background: form.role===r ? `${ROLE_COLORS[r]}20` : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${form.role===r ? ROLE_COLORS[r]+'55' : 'rgba(255,255,255,0.08)'}`,
                        color: form.role===r ? ROLE_COLORS[r] : '#64748b', transition:'all 0.15s' }}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
              <button onClick={save} disabled={saving} className="btn-primary" style={{ flex:1, justifyContent:'center', padding:'11px' }}>{saving?'Saving…':editing?'Save Changes':'Add Member'}</button>
              <button onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
