import { createFileRoute } from "@tanstack/react-router";
import { MktNav } from "@/components/MktNav";
import { MktFooter } from "@/components/MktFooter";
import { Zap, GitBranch, BarChart3, Bell, Users, Code2, ArrowRight, Star, Check } from "lucide-react";

export const Route = createFileRoute("/landing")({
  head: () => ({ meta: [{ title: "IssueVault — Track. Fix. Ship." }] }),
  component: LandingPage,
});

const FEATURES = [
  { icon:GitBranch, color:"#9d00ff", title:"GitHub & Jira Sync",   desc:"Two-way sync with GitHub, Jira, and Linear. Smart deduplication — no double imports, ever." },
  { icon:Zap,       color:"#ff2d78", title:"n8n Automation",       desc:"Trigger 400+ workflows on issue events. Auto-escalate criticals to PagerDuty, Slack, or email." },
  { icon:BarChart3, color:"#00f5ff", title:"Deep Analytics",        desc:"30-day trends, severity heat maps, resolution times, and top contributor leaderboards." },
  { icon:Bell,      color:"#ffe600", title:"Smart Alerts",          desc:"Critical issue pings, daily digests, and unread badges. Never miss a blocker." },
  { icon:Users,     color:"#00ff94", title:"Team Management",       desc:"Role-based access (admin/dev/tester/viewer), department groups, per-member stats." },
  { icon:Code2,     color:"#f97316", title:"Developer API",         desc:"Full REST API + inbound webhooks. Push issues from any CI/CD pipeline or monitoring tool." },
];
const INTEGRATIONS = [
  {name:"GitHub",logo:"🐙"},{name:"Jira",logo:"🔵"},{name:"Linear",logo:"🟣"},
  {name:"Slack",logo:"💬"},{name:"n8n",logo:"🔶"},{name:"Notion",logo:"📋"},
  {name:"PagerDuty",logo:"🚨"},{name:"GitHub Actions",logo:"⚙️"},
];
const TESTIMONIALS = [
  { name:"Sarah Chen",   role:"Engineering Lead @ Stripe",  avatar:"SC", text:"IssueVault replaced three tools. The GitHub sync alone saves us 2 hours every single day.", rating:5 },
  { name:"Marcus Rivera",role:"CTO @ Finova",               avatar:"MR", text:"The n8n integration is insane. Critical bugs auto-escalate to PagerDuty before engineers open their laptops.", rating:5 },
  { name:"Priya Patel",  role:"Staff Engineer @ Vercel",   avatar:"PP", text:"Finally a tracker that doesn't fight my workflow. Clean API, great UI, ships fast.", rating:5 },
];
const STATS = [
  {value:"10k+",label:"Issues tracked"},{value:"500+",label:"Teams worldwide"},
  {value:"99.9%",label:"Uptime SLA"},{value:"<2s",label:"Sync time"},
];

function LandingPage() {
  return (
    <div className="mkt-body mkt-grid-bg" style={{ position:"relative" }}>
      <MktNav/>

      {/* ── HERO ── */}
      <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"140px 24px 80px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"15%", left:"8%", width:500, height:500, borderRadius:"50%", background:"rgba(157,0,255,0.07)", filter:"blur(100px)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:"30%", right:"8%", width:400, height:400, borderRadius:"50%", background:"rgba(255,45,120,0.05)", filter:"blur(90px)", pointerEvents:"none" }}/>

        <div style={{ position:"relative", zIndex:1, maxWidth:820 }}>
          <span className="mkt-badge mkt-badge-purple" style={{ marginBottom:24 }}>✦ Now with n8n Automation</span>
          <h1 style={{ fontSize:"clamp(44px,7vw,82px)", fontWeight:900, lineHeight:1.04, letterSpacing:"-2px", marginBottom:28, color:"white", fontFamily:"Syne,sans-serif" }}>
            The issue tracker<br/>
            <span className="mkt-grad-text">built to ship faster</span>
          </h1>
          <p style={{ fontSize:"clamp(16px,2vw,20px)", color:"#64748b", lineHeight:1.7, maxWidth:560, margin:"0 auto 44px" }}>
            Connect GitHub, Jira, Linear and Slack. Automate with n8n. Get deep analytics. Ship with confidence.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", marginBottom:20 }}>
            <a href="/signup" className="mkt-btn-primary"><Zap size={16}/> Start for free</a>
            <a href="/pricing" className="mkt-btn-secondary">See pricing <ArrowRight size={16}/></a>
          </div>
          <p style={{ fontSize:13, color:"#334155" }}>No credit card · Free forever plan · Setup in 5 min</p>
        </div>

        {/* App mockup */}
        <div style={{ position:"relative", zIndex:1, marginTop:72, maxWidth:960, width:"100%" }}>
          <div style={{ borderRadius:20, border:"1px solid rgba(157,0,255,0.25)", overflow:"hidden", boxShadow:"0 40px 120px rgba(157,0,255,0.15)", background:"#0a0a1a" }}>
            <div style={{ background:"rgba(255,255,255,0.03)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"12px 16px", display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:"#ef4444" }}/>
              <div style={{ width:10, height:10, borderRadius:"50%", background:"#f97316" }}/>
              <div style={{ width:10, height:10, borderRadius:"50%", background:"#00ff94" }}/>
              <div style={{ flex:1, margin:"0 16px", background:"rgba(255,255,255,0.05)", borderRadius:6, padding:"5px 12px", fontSize:12, color:"#334155", fontFamily:"JetBrains Mono,monospace", textAlign:"center" }}>
                app.issuevault.com/dashboard
              </div>
            </div>
            <div style={{ padding:24, display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:4 }}>
              {[["Total Issues","248","↑12%","#ff2d78"],["Critical","8","↓3","#ef4444"],["Resolved Today","34","↑28%","#00ff94"],["Avg Fix Time","4.2h","↓0.5h","#00f5ff"]].map(([l,v,d,c]) => (
                <div key={String(l)} style={{ padding:16, borderRadius:10, background:"rgba(255,255,255,0.03)", border:`1px solid ${c}18` }}>
                  <div style={{ fontSize:11, color:"#475569", marginBottom:8 }}>{l}</div>
                  <div style={{ fontSize:24, fontWeight:700, color:"white", fontFamily:"Syne,sans-serif", marginBottom:4 }}>{v}</div>
                  <div style={{ fontSize:11, color: String(d).startsWith("↑")?"#00ff94":"#ff2d78" }}>{d}</div>
                </div>
              ))}
            </div>
            <div style={{ padding:"0 24px 24px", display:"flex", alignItems:"flex-end", gap:6, height:80 }}>
              {[40,60,35,80,55,90,45,70,88,62,75,95,50,84].map((h,i) => (
                <div key={i} style={{ flex:1, height:`${h}%`, borderRadius:"3px 3px 0 0", background:i===13?"#9d00ff":"rgba(157,0,255,0.3)" }}/>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding:"60px 24px", borderTop:"1px solid rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <div className="mkt-container" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:32, textAlign:"center" }}>
          {STATS.map(({value,label}) => (
            <div key={label}>
              <div className="mkt-grad-text" style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:900, fontFamily:"Syne,sans-serif", marginBottom:6 }}>{value}</div>
              <div style={{ fontSize:14, color:"#475569" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── INTEGRATIONS ── */}
      <section className="mkt-section" style={{ textAlign:"center" }}>
        <div className="mkt-container">
          <span className="mkt-badge mkt-badge-cyan" style={{ marginBottom:16 }}>400+ Integrations</span>
          <h2 style={{ fontSize:"clamp(26px,4vw,44px)", fontWeight:800, color:"white", fontFamily:"Syne,sans-serif", marginBottom:12 }}>Works with your <span className="mkt-grad-text-2">entire stack</span></h2>
          <p style={{ color:"#64748b", fontSize:16, marginBottom:44 }}>Connect your tools in minutes. No complex setup.</p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            {INTEGRATIONS.map(({name,logo}) => (
              <div key={name} className="mkt-card" style={{ padding:"14px 22px", display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:22 }}>{logo}</span>
                <span style={{ fontSize:14, fontWeight:600, color:"#cbd5e1" }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mkt-divider mkt-container"/>

      {/* ── FEATURES ── */}
      <section id="features" className="mkt-section">
        <div className="mkt-container">
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <span className="mkt-badge mkt-badge-purple" style={{ marginBottom:16 }}>Everything you need</span>
            <h2 style={{ fontSize:"clamp(28px,4vw,50px)", fontWeight:800, color:"white", fontFamily:"Syne,sans-serif", marginBottom:16 }}>
              Built for <span className="mkt-grad-text">engineering teams</span>
            </h2>
            <p style={{ fontSize:17, color:"#64748b", maxWidth:500, margin:"0 auto" }}>Fast, opinionated, built around the way engineers actually work.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:20 }}>
            {FEATURES.map(({icon:Icon,color,title,desc}) => (
              <div key={title} className="mkt-card" style={{ padding:28, borderColor:`${color}22`, background:`${color}06` }}>
                <div style={{ width:46, height:46, borderRadius:12, background:`${color}15`, border:`1px solid ${color}30`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18 }}>
                  <Icon size={21} color={color}/>
                </div>
                <h3 style={{ fontSize:17, fontWeight:700, color:"white", marginBottom:10 }}>{title}</h3>
                <p style={{ fontSize:14, color:"#64748b", lineHeight:1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mkt-divider mkt-container"/>

      {/* ── TESTIMONIALS ── */}
      <section className="mkt-section">
        <div className="mkt-container">
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <span className="mkt-badge mkt-badge-green" style={{ marginBottom:16 }}>Loved by engineers</span>
            <h2 style={{ fontSize:"clamp(26px,4vw,44px)", fontWeight:800, color:"white", fontFamily:"Syne,sans-serif" }}>Don't take our word for it</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:20 }}>
            {TESTIMONIALS.map(({name,role,avatar,text,rating}) => (
              <div key={name} className="mkt-card" style={{ padding:28 }}>
                <div style={{ display:"flex", gap:3, marginBottom:16 }}>
                  {Array.from({length:rating}).map((_,i) => <Star key={i} size={14} color="#ffe600" fill="#ffe600"/>)}
                </div>
                <p style={{ fontSize:15, color:"#cbd5e1", lineHeight:1.7, marginBottom:20 }}>"{text}"</p>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:"linear-gradient(135deg,#9d00ff,#ff2d78)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"white", fontFamily:"Syne,sans-serif" }}>{avatar}</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:"white" }}>{name}</div>
                    <div style={{ fontSize:12, color:"#475569" }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="mkt-section" style={{ paddingTop:0 }}>
        <div className="mkt-container">
          <div style={{ textAlign:"center", padding:"72px 48px", borderRadius:28, background:"linear-gradient(135deg,rgba(157,0,255,0.12),rgba(255,45,120,0.08))", border:"1px solid rgba(157,0,255,0.25)", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220, borderRadius:"50%", background:"rgba(157,0,255,0.1)", filter:"blur(50px)", pointerEvents:"none" }}/>
            <span className="mkt-badge mkt-badge-pink" style={{ marginBottom:20 }}>Free to start</span>
            <h2 style={{ fontSize:"clamp(24px,4vw,44px)", fontWeight:800, color:"white", fontFamily:"Syne,sans-serif", marginBottom:16 }}>Ready to ship without the chaos?</h2>
            <p style={{ fontSize:16, color:"#64748b", marginBottom:36 }}>Join thousands of engineers who track, fix, and ship with IssueVault.</p>
            <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
              <a href="/signup" className="mkt-btn-primary"><Zap size={16}/> Get started free</a>
              <a href="/pricing" className="mkt-btn-secondary">View pricing <ArrowRight size={16}/></a>
            </div>
          </div>
        </div>
      </section>

      <MktFooter/>
    </div>
  );
}
