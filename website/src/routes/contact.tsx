import { createFileRoute } from "@tanstack/react-router";
import { MktNav } from "@/components/MktNav";
import { MktFooter } from "@/components/MktFooter";
import { useState } from "react";
import { Zap, Mail, MessageSquare, Building2, Check } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — IssueVault" }] }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name:"", email:"", company:"", type:"sales", message:"" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
  };

  return (
    <div className="mkt-body mkt-grid-bg" style={{ position:"relative" }}>
      <MktNav/>
      <div style={{ paddingTop:100 }}>
        <section className="mkt-section" style={{ textAlign:"center", paddingBottom:0 }}>
          <div className="mkt-container" style={{ maxWidth:600 }}>
            <span className="mkt-badge mkt-badge-pink" style={{ marginBottom:16 }}>Get in touch</span>
            <h1 style={{ fontSize:"clamp(28px,4vw,50px)", fontWeight:900, color:"white", fontFamily:"Syne,sans-serif", marginBottom:12 }}>How can we help?</h1>
            <p style={{ fontSize:17, color:"#64748b", maxWidth:440, margin:"0 auto" }}>Sales, support, or partnerships — we'll get back within one business day.</p>
          </div>
        </section>

        <section style={{ padding:"48px 24px 100px" }}>
          <div className="mkt-container">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32, alignItems:"start" }}>
              {/* Form */}
              <div className="mkt-card" style={{ padding:32 }}>
                {sent ? (
                  <div style={{ textAlign:"center", padding:32 }}>
                    <div style={{ width:56, height:56, borderRadius:16, background:"rgba(0,255,148,0.15)", border:"1px solid rgba(0,255,148,0.3)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                      <Check size={26} color="#00ff94"/>
                    </div>
                    <h3 style={{ fontSize:18, fontWeight:700, color:"white", marginBottom:8 }}>Message sent!</h3>
                    <p style={{ fontSize:14, color:"#64748b" }}>We'll get back to you within one business day.</p>
                  </div>
                ) : (
                  <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    <h2 style={{ fontSize:18, fontWeight:700, color:"white", marginBottom:4 }}>Send us a message</h2>
                    {[["Full Name","name","text","Jane Doe"],["Work Email","email","email","jane@company.com"],["Company","company","text","Acme Corp"]].map(([l,k,t,p]) => (
                      <div key={k}>
                        <label style={{ fontSize:11, color:"#64748b", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600 }}>{l}</label>
                        <input className="mkt-input" type={t} placeholder={p} value={(form as any)[k]} onChange={e=>setForm(p2=>({...p2,[k]:e.target.value}))} required={k!=="company"}/>
                      </div>
                    ))}
                    <div>
                      <label style={{ fontSize:11, color:"#64748b", display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600 }}>Topic</label>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                        {["sales","support","partnership","other"].map(v => (
                          <button key={v} type="button" onClick={()=>setForm(p=>({...p,type:v}))}
                            style={{ fontSize:12, padding:"6px 14px", borderRadius:999, cursor:"pointer", transition:"all 0.2s",
                              background: form.type===v?"rgba(157,0,255,0.2)":"rgba(255,255,255,0.04)",
                              border:`1px solid ${form.type===v?"rgba(157,0,255,0.4)":"rgba(255,255,255,0.08)"}`,
                              color: form.type===v?"#9d00ff":"#64748b" }}>
                            {v.charAt(0).toUpperCase()+v.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize:11, color:"#64748b", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.5px", fontWeight:600 }}>Message</label>
                      <textarea className="mkt-input" rows={4} placeholder="Tell us more…" value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} style={{ resize:"vertical" }} required/>
                    </div>
                    <button type="submit" className="mkt-btn-primary" style={{ justifyContent:"center", borderRadius:12 }} disabled={loading}>
                      {loading?"Sending…":<><Zap size={15}/>Send message</>}
                    </button>
                  </form>
                )}
              </div>

              {/* Options */}
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[
                  { icon:MessageSquare, color:"#9d00ff", title:"Live chat",    desc:"Mon–Fri 9am–6pm UTC. Response in minutes.",              cta:"Start chat",           href:"#" },
                  { icon:Mail,          color:"#ff2d78", title:"Email",        desc:"support@issuevault.com · Response within 24 hours.",     cta:"support@issuevault.com",href:"mailto:support@issuevault.com" },
                  { icon:Building2,     color:"#00f5ff", title:"Enterprise",   desc:"Custom plan, self-hosting, or volume pricing.",          cta:"Book a call",          href:"#" },
                ].map(({icon:Icon,color,title,desc,cta,href}) => (
                  <div key={title} className="mkt-card" style={{ padding:20, borderColor:`${color}22`, background:`${color}06` }}>
                    <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                      <div style={{ width:38, height:38, borderRadius:10, background:`${color}15`, border:`1px solid ${color}30`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <Icon size={17} color={color}/>
                      </div>
                      <div>
                        <h3 style={{ fontSize:15, fontWeight:600, color:"white", marginBottom:5 }}>{title}</h3>
                        <p style={{ fontSize:13, color:"#64748b", marginBottom:10, lineHeight:1.5 }}>{desc}</p>
                        <a href={href} style={{ fontSize:13, color, textDecoration:"none", fontWeight:600 }}>{cta} →</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <MktFooter/>
    </div>
  );
}
