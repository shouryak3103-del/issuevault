import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Zap, Eye, EyeOff, Github, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — IssueVault" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError("Please fill in all fields");
    setLoading(true); setError("");
    setTimeout(() => { setLoading(false); window.location.href = "/"; }, 1200);
  };

  return (
    <div className="mkt-body" style={{ minHeight:"100vh", display:"flex" }}>
      {/* Left brand panel */}
      <div className="mkt-hide-mobile" style={{ width:"46%", background:"linear-gradient(135deg,rgba(157,0,255,0.1),rgba(255,45,120,0.06))", borderRight:"1px solid rgba(255,255,255,0.06)", display:"flex", flexDirection:"column", padding:48, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-100, left:-100, width:400, height:400, borderRadius:"50%", background:"rgba(157,0,255,0.08)", filter:"blur(80px)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:-100, right:-100, width:300, height:300, borderRadius:"50%", background:"rgba(255,45,120,0.07)", filter:"blur(80px)", pointerEvents:"none" }}/>
        <a href="/landing" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none", position:"relative", zIndex:1 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#9d00ff,#ff2d78)", display:"flex", alignItems:"center", justifyContent:"center" }}><Zap size={17} color="white"/></div>
          <span style={{ fontWeight:800, fontSize:18, fontFamily:"Syne,monospace", background:"linear-gradient(135deg,#9d00ff,#ff2d78)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>IssueVault</span>
        </a>
        <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", position:"relative", zIndex:1 }}>
          <blockquote style={{ fontSize:22, fontWeight:700, color:"white", fontFamily:"Syne,sans-serif", lineHeight:1.5, marginBottom:20 }}>
            "IssueVault reduced our bug backlog by 60% in the first month."
          </blockquote>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:"linear-gradient(135deg,#9d00ff,#ff2d78)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"white" }}>SC</div>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:"white" }}>Sarah Chen</div>
              <div style={{ fontSize:12, color:"#64748b" }}>Engineering Lead @ Stripe</div>
            </div>
          </div>
        </div>
        <p style={{ fontSize:13, color:"#334155", position:"relative", zIndex:1 }}>© 2026 IssueVault</p>
      </div>

      {/* Right form */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"48px 24px", position:"relative" }}>
        <a href="/landing" style={{ position:"absolute", top:24, left:24, display:"flex", alignItems:"center", gap:6, fontSize:13, color:"#475569", textDecoration:"none" }}>
          <ArrowLeft size={14}/> Back
        </a>
        <div style={{ width:"100%", maxWidth:380 }}>
          <div style={{ marginBottom:32 }}>
            <h1 style={{ fontSize:28, fontWeight:800, color:"white", fontFamily:"Syne,sans-serif", marginBottom:8 }}>Welcome back</h1>
            <p style={{ fontSize:14, color:"#475569" }}>Sign in to your IssueVault account</p>
          </div>
          <button style={{ width:"100%", padding:12, borderRadius:12, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"#cbd5e1", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10, fontSize:14, fontWeight:500, marginBottom:20, transition:"background 0.2s" }}>
            <Github size={17}/> Continue with GitHub
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }}/><span style={{ fontSize:12, color:"#334155" }}>or email</span><div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }}/>
          </div>
          {error && <div style={{ padding:"12px 14px", borderRadius:10, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", color:"#ef4444", fontSize:13, marginBottom:16 }}>{error}</div>}
          <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div>
              <label style={{ fontSize:11, color:"#64748b", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600 }}>Email</label>
              <input className="mkt-input" type="email" placeholder="you@company.com" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))} required/>
            </div>
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <label style={{ fontSize:11, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600 }}>Password</label>
                <a href="#" style={{ fontSize:12, color:"#9d00ff", textDecoration:"none" }}>Forgot?</a>
              </div>
              <div style={{ position:"relative" }}>
                <input className="mkt-input" type={show?"text":"password"} placeholder="••••••••" value={form.password} onChange={e => setForm(p=>({...p,password:e.target.value}))} required style={{ paddingRight:44 }}/>
                <button type="button" onClick={() => setShow(s=>!s)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#475569" }}>
                  {show ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            <button type="submit" className="mkt-btn-primary" style={{ justifyContent:"center", width:"100%", borderRadius:12 }} disabled={loading}>
              {loading ? "Signing in…" : <><Zap size={15}/> Sign in</>}
            </button>
          </form>
          <p style={{ fontSize:13, color:"#475569", textAlign:"center", marginTop:24 }}>
            Don't have an account? <a href="/signup" style={{ color:"#9d00ff", textDecoration:"none", fontWeight:600 }}>Sign up free</a>
          </p>
        </div>
      </div>
    </div>
  );
}
