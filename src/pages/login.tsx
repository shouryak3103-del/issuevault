import { useState } from 'react'
import { Zap, Eye, EyeOff, Github } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) return setError('Please fill in all fields')
    setLoading(true); setError('')
    setTimeout(() => { setLoading(false); window.location.href = '/' }, 1200)
  }

  return (
    <div style={{ background:'#060612', color:'#e2e8f0', minHeight:'100vh', display:'flex', fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif' }}>
      {/* Brand panel */}
      <div style={{ width:'46%', background:'linear-gradient(135deg,rgba(157,0,255,0.1),rgba(255,45,120,0.06))', borderRight:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', padding:48, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-100, left:-100, width:400, height:400, borderRadius:'50%', background:'rgba(157,0,255,0.08)', filter:'blur(80px)', pointerEvents:'none' }}/>
        <a href="/landing" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', position:'relative', zIndex:1 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#9d00ff,#ff2d78)', display:'flex', alignItems:'center', justifyContent:'center' }}><Zap size={17} color="white"/></div>
          <span style={{ fontWeight:800, fontSize:18, fontFamily:'monospace', background:'linear-gradient(135deg,#9d00ff,#ff2d78)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>IssueVault</span>
        </a>
        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', position:'relative', zIndex:1 }}>
          <blockquote style={{ fontSize:22, fontWeight:700, color:'white', lineHeight:1.5, marginBottom:20 }}>
            "IssueVault reduced our bug backlog by 60% in the first month."
          </blockquote>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:'linear-gradient(135deg,#9d00ff,#ff2d78)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, color:'white' }}>SC</div>
            <div>
              <p style={{ fontSize:14, fontWeight:600, color:'white', margin:0 }}>Sarah Chen</p>
              <p style={{ fontSize:12, color:'#64748b', margin:0 }}>Engineering Lead @ Stripe</p>
            </div>
          </div>
        </div>
      </div>
      {/* Form panel */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:48 }}>
        <div style={{ width:'100%', maxWidth:400 }}>
          <h2 style={{ fontSize:28, fontWeight:800, margin:'0 0 6px', letterSpacing:'-0.5px' }}>Welcome back</h2>
          <p style={{ fontSize:14, color:'#64748b', margin:'0 0 32px' }}>Sign in to your workspace.<Link to="/signup" style={{ color:'#9d00ff', marginLeft:4, textDecoration:'none', fontWeight:600 }}>No account? Sign up</Link></p>
          <button style={{ width:'100%', padding:'12px 0', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8', fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:20 }}>
            <Github size={16}/>Continue with GitHub
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
            <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.07)' }}/>
            <span style={{ fontSize:12, color:'#334155' }}>or</span>
            <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.07)' }}/>
          </div>
          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {error && <p style={{ padding:'10px 14px', borderRadius:8, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', color:'#ef4444', fontSize:13, margin:0 }}>{error}</p>}
            <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
              style={{ padding:'12px 16px', borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#e2e8f0', fontSize:14, outline:'none' }}/>
            <div style={{ position:'relative' }}>
              <input type={show?'text':'password'} placeholder="Password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}
                style={{ width:'100%', padding:'12px 44px 12px 16px', borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#e2e8f0', fontSize:14, outline:'none', boxSizing:'border-box' }}/>
              <button type="button" onClick={()=>setShow(s=>!s)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#64748b' }}>
                {show?<EyeOff size={16}/>:<Eye size={16}/>}
              </button>
            </div>
            <button type="submit" disabled={loading} style={{ padding:'13px 0', borderRadius:10, background:'linear-gradient(135deg,#9d00ff,#ff2d78)', color:'white', fontWeight:700, fontSize:15, border:'none', cursor:'pointer', opacity:loading?0.7:1 }}>
              {loading?'Signing in…':'Sign in →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
