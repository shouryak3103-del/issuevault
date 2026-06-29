import { createFileRoute } from "@tanstack/react-router";
import { MktNav } from "@/components/MktNav";
import { MktFooter } from "@/components/MktFooter";
import { Check, X, Zap, ArrowRight, Star } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing — IssueVault" }] }),
  component: PricingPage,
});

const PLANS = [
  {
    name:"Free", price:0, color:"#00f5ff", popular:false,
    desc:"Perfect for solo devs and tiny projects.",
    features:["3 projects","100 issues / month","GitHub sync","CSV upload","7-day audit log","Email support"],
    missing:["Jira / Linear sync","n8n automation","Analytics","Team management","REST API","SSO / SAML"],
  },
  {
    name:"Pro", price:29, color:"#9d00ff", popular:true,
    desc:"For growing teams that move fast.",
    features:["Unlimited projects","Unlimited issues","GitHub sync","CSV upload","90-day audit log","Priority support","Jira / Linear sync","n8n automation","Full analytics","Team management","REST API access"],
    missing:["SSO / SAML"],
  },
  {
    name:"Enterprise", price:-1, color:"#ff2d78", popular:false,
    desc:"For large teams with advanced security needs.",
    features:["Everything in Pro","Unlimited audit log","Dedicated support","Custom analytics","SSO / SAML","Self-hosting option","SLA guarantee","Custom contracts"],
    missing:[],
  },
];

const FAQ = [
  { q:"Can I cancel anytime?",          a:"Yes. No contracts, no penalties. Cancel in one click from Settings." },
  { q:"What counts as a seat?",         a:"Any member with write access. Read-only viewers are free." },
  { q:"Is there a free trial for Pro?", a:"Yes — 14 days free, no credit card required." },
  { q:"Can I self-host?",               a:"Enterprise plans include a Docker-based self-hosting option." },
  { q:"Does the Free plan expire?",     a:"Never. Free forever. Upgrade when you need more power." },
];

function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="mkt-body mkt-grid-bg" style={{ position:"relative" }}>
      <MktNav/>
      <div style={{ paddingTop:100 }}>

        {/* Header */}
        <section className="mkt-section" style={{ textAlign:"center", paddingBottom:0 }}>
          <div className="mkt-container">
            <span className="mkt-badge mkt-badge-cyan" style={{ marginBottom:16 }}>Simple pricing</span>
            <h1 style={{ fontSize:"clamp(32px,5vw,62px)", fontWeight:900, fontFamily:"Syne,sans-serif", color:"white", marginBottom:16, lineHeight:1.05 }}>
              Pay for what you use.<br/><span className="mkt-grad-text">Not what you don't.</span>
            </h1>
            <p style={{ fontSize:18, color:"#64748b", maxWidth:480, margin:"0 auto 32px" }}>Start free, upgrade when you need to. No surprise bills.</p>

            {/* Toggle */}
            <div style={{ display:"inline-flex", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:4, marginBottom:72 }}>
              {["Monthly","Annual"].map(t => (
                <button key={t} onClick={() => setAnnual(t==="Annual")}
                  style={{ padding:"8px 24px", borderRadius:9, fontSize:13, fontWeight:600, border:"none", cursor:"pointer", transition:"all 0.2s",
                    background: (t==="Annual") === annual ? "linear-gradient(135deg,#9d00ff,#ff2d78)" : "transparent",
                    color: (t==="Annual") === annual ? "white" : "#64748b" }}>
                  {t}{t==="Annual" && <span style={{ fontSize:11, color:"#00ff94", marginLeft:4 }}> –20%</span>}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="mkt-section" style={{ paddingTop:0 }}>
          <div className="mkt-container">
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:20, alignItems:"start" }}>
              {PLANS.map(plan => (
                <div key={plan.name} style={{ borderRadius:24, border:`1px solid ${plan.popular?plan.color+"55":"rgba(255,255,255,0.08)"}`, background:plan.popular?`${plan.color}08`:"rgba(255,255,255,0.02)", padding:32, position:"relative" }}>
                  {plan.popular && (
                    <div style={{ position:"absolute", top:-14, left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,#9d00ff,#ff2d78)", color:"white", fontSize:12, fontWeight:700, padding:"5px 16px", borderRadius:999, whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:5 }}>
                      <Star size={11} fill="white"/> Most popular
                    </div>
                  )}
                  <h2 style={{ fontSize:20, fontWeight:700, color:"white", fontFamily:"Syne,sans-serif", marginBottom:6 }}>{plan.name}</h2>
                  <p style={{ fontSize:13, color:"#475569", marginBottom:20 }}>{plan.desc}</p>
                  <div style={{ display:"flex", alignItems:"flex-end", gap:4, marginBottom:24 }}>
                    {plan.price === -1
                      ? <span style={{ fontSize:36, fontWeight:900, color:"white", fontFamily:"Syne,sans-serif" }}>Custom</span>
                      : <>
                          <span style={{ fontSize:52, fontWeight:900, color:"white", fontFamily:"Syne,sans-serif", lineHeight:1 }}>${annual ? Math.round(plan.price*0.8) : plan.price}</span>
                          <span style={{ fontSize:13, color:"#475569", marginBottom:6 }}>/seat/mo</span>
                        </>
                    }
                  </div>
                  <a href={plan.price===-1?"/contact":"/signup"} className={plan.popular?"mkt-btn-primary":"mkt-btn-secondary"}
                    style={{ width:"100%", justifyContent:"center", marginBottom:24, display:"flex", borderRadius:12 }}>
                    {plan.price===0?"Start free":plan.price===-1?"Talk to sales":"Start 14-day trial"} <ArrowRight size={15}/>
                  </a>
                  <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:20 }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                        <Check size={14} color={plan.color} style={{ flexShrink:0 }}/>
                        <span style={{ fontSize:14, color:"#cbd5e1" }}>{f}</span>
                      </div>
                    ))}
                    {plan.missing.map(f => (
                      <div key={f} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                        <X size={14} color="#1e293b" style={{ flexShrink:0 }}/>
                        <span style={{ fontSize:14, color:"#334155" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mkt-section" style={{ paddingTop:0 }}>
          <div className="mkt-container" style={{ maxWidth:720 }}>
            <h2 style={{ fontSize:"clamp(24px,3vw,38px)", fontWeight:800, color:"white", fontFamily:"Syne,sans-serif", textAlign:"center", marginBottom:48 }}>
              Frequently asked <span className="mkt-grad-text">questions</span>
            </h2>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {FAQ.map(({q,a}) => (
                <div key={q} className="mkt-card" style={{ padding:"20px 24px" }}>
                  <h3 style={{ fontSize:15, fontWeight:600, color:"white", marginBottom:8 }}>{q}</h3>
                  <p style={{ fontSize:14, color:"#64748b", lineHeight:1.6, margin:0 }}>{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <MktFooter/>
    </div>
  );
}
