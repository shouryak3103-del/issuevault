import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Zap, Eye, EyeOff, Github, ArrowLeft, Check } from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — IssueVault" }] }),
  component: SignupPage,
});

const PERKS = ["14-day Pro trial, free","No credit card required","Setup in under 5 minutes","Cancel anytime"];

function SignupPage() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState("pro");
  const [form, setForm] = useState({ name:"", email:"", password:"", company:"" });
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) return setStep(2);
    setLoading(true);
    setTimeout(() => { setLoading(false); window.location.href = "/"; }, 1400);
  };

  return (
    <div className="mkt-body" style={{ minHeight:"100vh", display:"flex" }}>
      {/* Left */}
      <div className="mkt-hide-mobile" style={{ width:"44%", background:"linear-gradient(135deg,rgba(157,0,255,0.08),rgba(0,245,255,0.04))", borderRight:"1px solid rgba(255,255,255,0.06)", display:"flex", flexDirection:"column", padding:48, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-80, right:-80, width:300, height:300, borderRadius:"50%", background:"rgba(157,0,255,0.08)", filter:"blur(60px)", pointerEvents:"none" }}/>
        <a href="/landing" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#9d00ff,#ff2d78)", display:"flex", alignItems:"center", justifyContent:"center" }}><Zap size={17} color="white"/></div>
          <span style={{ fontWeight:800, fontSize:18, fontFamily:"Syne,monospace", background:"linear-gradient(135deg,#9d00ff,#ff2d78)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>IssueVault</span>
        </a>
        <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", position:"relative", zIndex:1 }}>
          <h2 style={{ fontSize:26, fontWeight:800, color:"white", fontFamily:"Syne,sans-serif", marginBottom:28 }}>Start tracking issues in minutes.</h2>
          {PERKS.map(p => (
            <div key={p} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <div style={{ width:22, height:22, borderRadius:6, background:"rgba(0,255,148,0.15)", border:"1px solid rgba(0,255,148,0.3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Check size={12} color="#00ff94"/>
              </div>
              <span style={{ fontSize:14, color:"#cbd5e1" }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"48px 24px", position:"relative" }}>
        <a href="/landing" style={{ position:"absolute", top:24, left:24, display:"flex", alignItems:"center", gap:6, fontSize:13, color:"#475569", textDecoration:"none" }}>
          <ArrowLeft size={14}/> Back
        </a>
        <div style={{ width:"100%", maxWidth:400 }}>
          {/* Step pills */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:28 }}>
            {[1,2].map(s => (
              <div key={s} style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700,
                  background: step>=s ? "linear-gradient(135deg,#9d00ff,#ff2d78)" : "rgba(255,255,255,0.06)",
                  color: step>=s ? "white" : "#334155", border: step>=s ? "none" : "1px solid rgba(255,255,255,0.1)" }}>{s}</div>
                {s < 2 && <div style={{ width:40, height:1, background: step>s ? "rgba(157,0,255,0.5)" : "rgba(255,255,255,0.08)" }}/>}
              </div>
            ))}
            <span style={{ fontSize:12, color:"#475569", marginLeft:8 }}>Step {step} of 2</span>
          </div>

          <div style={{ marginBottom:28 }}>
            <h1 style={{ fontSize:26, fontWeight:800, color:"white", fontFamily:"Syne,sans-serif", marginBottom:6 }}>{step===1?"Create your account":"Set up your workspace"}</h1>
            <p style={{ fontSize:14, color:"#475569" }}>{step===1?"Join thousands of engineering teams":"Almost there — just a couple more details"}</p>
          </div>

          {step===1 && (
            <>
              <button style={{ width:"100%", padding:12, borderRadius:12, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"#cbd5e1", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10, fontSize:14, fontWeight:500, marginBottom:20 }}>
                <Github size={17}/> Continue with GitHub
              </button>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }}/><span style={{ fontSize:12, color:"#334155" }}>or</span><div style={{ flex:1, height:1, background:"rgba(255,255,255,0.07)" }}/>
              </div>
            </>
          )}

          <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {step===1 ? (
              <>
                {[["Full Name","name","text","Jane Doe"],["Work Email","email","email","you@company.com"],["Password","password","password","At least 8 characters"]].map(([label,key,type,placeholder]) => (
                  <div key={key}>
                    <label style={{ fontSize:11, color:"#64748b", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600 }}>{label}</label>
                    {type==="password" ? (
                      <div style={{ position:"relative" }}>
                        <input className="mkt-input" type={show?"text":"password"} placeholder={placeholder} value={(form as any)[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} required style={{ paddingRight:44 }}/>
                        <button type="button" onClick={()=>setShow(s=>!s)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#475569" }}>
                          {show?<EyeOff size={16}/>:<Eye size={16}/>}
                        </button>
                      </div>
                    ) : (
                      <input className="mkt-input" type={type} placeholder={placeholder} value={(form as any)[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} required/>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <>
                <div>
                  <label style={{ fontSize:11, color:"#64748b", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600 }}>Company / Team Name</label>
                  <input className="mkt-input" placeholder="Acme Engineering" value={form.company} onChange={e=>setForm(p=>({...p,company:e.target.value}))}/>
                </div>
                <div>
                  <label style={{ fontSize:11, color:"#64748b", display:"block", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600 }}>Plan</label>
                  {[
                    {id:"free",label:"Free",desc:"100 issues/mo, 3 projects",color:"#00f5ff"},
                    {id:"pro", label:"Pro — 14 days free",desc:"Unlimited + all integrations",color:"#9d00ff"},
                  ].map(p => (
                    <div key={p.id} onClick={()=>setPlan(p.id)}
                      style={{ padding:"14px 16px", borderRadius:12, cursor:"pointer", display:"flex", alignItems:"center", gap:12, marginBottom:8,
                        background: plan===p.id?`${p.color}12`:"rgba(255,255,255,0.03)",
                        border:`1px solid ${plan===p.id?p.color+"44":"rgba(255,255,255,0.08)"}` }}>
                      <div style={{ width:16, height:16, borderRadius:"50%", border:`2px solid ${plan===p.id?p.color:"#334155"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {plan===p.id && <div style={{ width:8, height:8, borderRadius:"50%", background:p.color }}/>}
                      </div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:600, color:"white" }}>{p.label}</div>
                        <div style={{ fontSize:12, color:"#475569" }}>{p.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            <button type="submit" className="mkt-btn-primary" style={{ justifyContent:"center", width:"100%", borderRadius:12 }} disabled={loading}>
              {loading?"Creating account…":step===1?"Continue →":<><Zap size={15}/>Create account</>}
            </button>
          </form>
          <p style={{ fontSize:13, color:"#475569", textAlign:"center", marginTop:20 }}>
            Already have an account? <a href="/login" style={{ color:"#9d00ff", textDecoration:"none", fontWeight:600 }}>Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
