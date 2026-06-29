import { useState } from 'react'
import { Zap, Check, Github } from 'lucide-react'
import { Link } from 'react-router-dom'

const STEPS = ['Account', 'Workspace', 'Done']

export default function SignupPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name:'', email:'', password:'', workspace:'' })
  const [loading, setLoading] = useState(false)

  const next = (e: React.FormEvent) => {
    e.preventDefault()
    if (step < 1) { setStep(s=>s+1); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); setStep(2) }, 1200)
  }

  return (
    <div style={{ background:'#060612', color:'#e2e8f0', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif', padding:24 }}>
      <div style={{ width:'100%', maxWidth:460 }}>
        <a href="/landing" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', justifyContent:'center', marginBottom:36 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#9d00ff,#ff2d78)', display:'flex', alignItems:'center', justifyContent:'center' }}><Zap size={17} color="white"/></div>
          <span style={{ fontWeight:800, fontSize:18, fontFamily:'monospace', background:'linear-gradient(135deg,#9d00ff,#ff2d78)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>IssueVault</span>
        </a>
        {/* Step indicators */}
        <div style={{ display:'flex', gap:0, marginBottom:32, alignItems:'center', justifyContent:'center' }}>
          {STEPS.map((s,i) => (
            <div key={s} style={{ display:'flex', alignItems:'center' }}>
              <div style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700,
                background:i<=step?'linear-gradient(135deg,#9d00ff,#ff2d78)':'rgba(255,255,255,0.07)',
                color:i<=step?'white':'#334155', border:i===step?'2px solid #ff2d78':'none' }}>
                {i<step?<Check size={13}/>:i+1}
              </div>
              <span style={{ marginLeft:6, fontSize:12, fontWeight:i===step?700:400, color:i===step?'white':'#334155' }}>{s}</span>
              {i<STEPS.length-1 && <div style={{ width:36, height:1, background:'rgba(255,255,255,0.07)', margin:'0 10px' }}/>}
            </div>
          ))}
        </div>

        <div style={{ padding:36, borderRadius:20, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.08)' }}>
          {step === 2 ? (
            <div style={{ textAlign:'center', padding:'20px 0' }}>
              <div style={{ width:64, height:64, borderRadius:16, background:'rgba(0,255,148,0.12)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                <Check size={28} color="#00ff94"/>
              </div>
              <h2 style={{ fontSize:24, fontWeight:800, margin:'0 0 8px' }}>You're in! 🎉</h2>
              <p style={{ fontSize:14, color:'#64748b', margin:'0 0 28px' }}>Your workspace is ready. Let's get started.</p>
              <a href="/" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'12px 28px', borderRadius:11, background:'linear-gradient(135deg,#9d00ff,#ff2d78)', color:'white', fontWeight:700, textDecoration:'none' }}>
                Go to dashboard →
              </a>
            </div>
          ) : (
            <form onSubmit={next} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div>
                <h2 style={{ fontSize:22, fontWeight:800, margin:'0 0 4px' }}>{step===0?'Create your account':'Set up your workspace'}</h2>
                <p style={{ fontSize:13, color:'#64748b', margin:0 }}>{step===0?<>Already have an account? <Link to="/login" style={{ color:'#9d00ff', textDecoration:'none' }}>Sign in</Link></>:'Pick a name for your team workspace.'}</p>
              </div>
              {step===0 && <>
                <button type="button" style={{ padding:'12px 0', borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8', fontSize:14, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  <Github size={16}/>Continue with GitHub
                </button>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.07)' }}/><span style={{ fontSize:12, color:'#334155' }}>or</span><div style={{ flex:1, height:1, background:'rgba(255,255,255,0.07)' }}/>
                </div>
                <input placeholder="Full name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                  style={{ padding:'12px 16px', borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#e2e8f0', fontSize:14, outline:'none' }}/>
                <input type="email" placeholder="Work email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                  style={{ padding:'12px 16px', borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#e2e8f0', fontSize:14, outline:'none' }}/>
                <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}
                  style={{ padding:'12px 16px', borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#e2e8f0', fontSize:14, outline:'none' }}/>
              </>}
              {step===1 && <>
                <input placeholder="Workspace name (e.g. Acme Engineering)" value={form.workspace} onChange={e=>setForm(f=>({...f,workspace:e.target.value}))}
                  style={{ padding:'12px 16px', borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#e2e8f0', fontSize:14, outline:'none' }}/>
                <p style={{ fontSize:12, color:'#475569', margin:0 }}>Your team members will join this workspace. You can always change it later.</p>
              </>}
              <button type="submit" disabled={loading} style={{ padding:'13px 0', borderRadius:10, background:'linear-gradient(135deg,#9d00ff,#ff2d78)', color:'white', fontWeight:700, fontSize:15, border:'none', cursor:'pointer', opacity:loading?0.7:1 }}>
                {loading?'Creating…':step===0?'Continue →':'Create workspace →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
