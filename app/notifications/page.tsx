'use client'
import { useEffect, useState } from 'react'
import PageWrapper from '@/components/PageWrapper'
import { Bell, BellOff, CheckCheck, Trash2, Bug, Zap, Upload, AlertTriangle, Info, Circle } from 'lucide-react'

const TYPE_META: Record<string,{icon:any;color:string;bg:string}> = {
  issue:    { icon:Bug,          color:'#ff2d78', bg:'rgba(255,45,120,0.1)' },
  action:   { icon:Zap,          color:'#9d00ff', bg:'rgba(157,0,255,0.1)' },
  upload:   { icon:Upload,       color:'#00f5ff', bg:'rgba(0,245,255,0.1)' },
  critical: { icon:AlertTriangle,color:'#ef4444', bg:'rgba(239,68,68,0.1)' },
  info:     { icon:Info,         color:'#64748b', bg:'rgba(100,116,139,0.1)' },
}

export default function Notifications() {
  const [notifs,  setNotifs]  = useState<any[]>([])
  const [filter,  setFilter]  = useState('all')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const r = await fetch('/api/notifications')
    const d = await r.json()
    setNotifs(d.data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const markAll = async () => {
    await fetch('/api/notifications', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ mark_all_read:true }) })
    load()
  }
  const del = async (id: string) => {
    await fetch('/api/notifications', { method:'DELETE', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id}) })
    load()
  }
  const markRead = async (id: string) => {
    await fetch('/api/notifications', { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id, is_read:true }) })
    load()
  }

  const filtered = filter === 'all' ? notifs : filter === 'unread' ? notifs.filter(n=>!n.is_read) : notifs.filter(n=>n.notification_type===filter)
  const unreadCount = notifs.filter(n=>!n.is_read).length

  return (
    <PageWrapper title="Notifications" subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}>
      <div style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom:'20px', flexWrap:'wrap' }}>
        {['all','unread','issue','action','upload','critical'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ fontSize:'12px', padding:'6px 14px', borderRadius:'8px', cursor:'pointer',
              background: filter===f ? 'rgba(157,0,255,0.2)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${filter===f ? 'rgba(157,0,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
              color: filter===f ? '#9d00ff' : '#64748b', fontWeight: filter===f ? 600 : 400 }}>
            {f}{f==='unread' && unreadCount > 0 ? ` (${unreadCount})` : ''}
          </button>
        ))}
        {unreadCount > 0 && (
          <button onClick={markAll} className="btn-secondary" style={{ marginLeft:'auto', fontSize:'12px', padding:'6px 14px' }}>
            <CheckCheck size={12}/> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
          {Array.from({length:6}).map((_,i) => <div key={i} className="card" style={{ height:'68px', background:'rgba(255,255,255,0.03)', animation:'pulse 1.5s infinite' }}/>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:'64px 24px' }}>
          <BellOff size={40} color="#1e293b" style={{ margin:'0 auto 14px', display:'block' }}/>
          <p style={{ color:'#64748b', fontWeight:600 }}>{filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
          {filtered.map((n: any) => {
            const m = TYPE_META[n.notification_type] || TYPE_META.info
            const Icon = m.icon
            return (
              <div key={n.id} onClick={() => !n.is_read && markRead(n.id)}
                className={n.is_read ? 'card' : 'card card-hover'}
                style={{ padding:'14px 18px', display:'flex', alignItems:'center', gap:'12px', cursor: n.is_read ? 'default' : 'pointer',
                  opacity: n.is_read ? 0.65 : 1,
                  borderColor: n.is_read ? 'rgba(255,255,255,0.06)' : m.color + '30',
                  background: n.is_read ? 'rgba(13,13,32,0.5)' : m.bg }}>
                <div style={{ width:'36px', height:'36px', borderRadius:'9px', background:m.bg, border:`1px solid ${m.color}33`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={16} color={m.color}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'13px', color: n.is_read ? '#64748b' : '#e2e8f0', fontWeight: n.is_read ? 400 : 500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {n.message || n.title || 'Notification'}
                  </div>
                  <div style={{ fontSize:'11px', color:'#334155', marginTop:'2px' }}>{new Date(n.created_at||n.created_date).toLocaleString()}</div>
                </div>
                {!n.is_read && <Circle size={8} color={m.color} fill={m.color} style={{ flexShrink:0 }}/>}
                <button onClick={e=>{e.stopPropagation();del(n.id)}} className="btn-danger" style={{ padding:'4px 8px', fontSize:'11px', flexShrink:0 }}><Trash2 size={11}/></button>
              </div>
            )
          })}
        </div>
      )}
    </PageWrapper>
  )
}
