import { MktNav } from '@/components/MktNav'
import { MktFooter } from '@/components/MktFooter'
import { Mail, MessageSquare, Zap } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setTimeout(() => setSent(true), 800)
  }

  return (
    <div style={{ background:'#060612', color:'#e2e8f0', minHeight:'100vh', fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif' }}>
      <MktNav/>
      <section style={{ padding:'140px 24px 100px', maxWidth:900, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:52 }}>
          <h1 style={{ fontSize:44, fontWeight:900, margin:'0 0 12px', letterSpacing:'-1.5px' }}>Get in touch</h1>
          <p style={{ fontSize:17, color:'#64748b' }}>We reply within 24 hours. Usually much faster.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:40 }}>
          <div>
            {[
              { icon:Mail, color:'#9d00ff', label:'Email us', val:'hello@issuevault.app' },
              { icon:MessageSquare, color:'#00f5ff', label:'Live chat', val:'Available 9am–6pm UTC' },
              { icon:Zap, color:'#ff2d78', label:'Sales', val:'sales@issuevault.app' },
            ].map(({ icon:Icon, color, label, val }) => (
              <div key={label} style={{ display:'flex', gap:14, alignItems:'flex-start', padding:'18px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width:40, height:40, borderRadius:11, background:`${color}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon size={17} color={color}/></div>
                <div><p style={{ fontSize:14, fontWeight:600, color:'white', margin:'0 0 3px' }}>{label}</p><p style={{ fontSize:13, color:'#64748b', margin:0 }}>{val}</p></div>
              </div>
            ))}
          </div>
          <div style={{ padding:32, borderRadius:18, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.08)' }}>
            {sent ? (
              <div style={{ textAlign:'center', padding:'40px 0' }}>
                <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
                <h3 style={{ fontSize:20, fontWeight:700, color:'white', margin:'0 0 8px' }}>Message sent!</h3>
                <p style={{ fontSize:14, color:'#64748b' }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <input placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                    style={{ padding:'11px 14px', borderRadius:9, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', color:'#e2e8f0', fontSize:13, outline:'none' }}/>
                  <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                    style={{ padding:'11px 14px', borderRadius:9, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', color:'#e2e8f0', fontSize:13, outline:'none' }}/>
                </div>
                <input placeholder="Subject" value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))}
                  style={{ padding:'11px 14px', borderRadius:9, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', color:'#e2e8f0', fontSize:13, outline:'none' }}/>
                <textarea rows={5} placeholder="Your message…" value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))}
                  style={{ padding:'11px 14px', borderRadius:9, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', color:'#e2e8f0', fontSize:13, outline:'none', resize:'vertical' }}/>
                <button type="submit" style={{ padding:'13px 0', borderRadius:10, background:'linear-gradient(135deg,#9d00ff,#ff2d78)', color:'white', fontWeight:700, fontSize:14, border:'none', cursor:'pointer' }}>
                  Send message →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      <MktFooter/>
    </div>
  )
}
