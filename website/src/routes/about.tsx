import { createFileRoute } from "@tanstack/react-router";
import { MktNav } from "@/components/MktNav";
import { MktFooter } from "@/components/MktFooter";
import { Zap, Globe, Heart, Shield, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — IssueVault" }] }),
  component: AboutPage,
});

const TEAM = [
  { name:"Alex Kim",     role:"CEO & Co-founder",    avatar:"AK", grad:"linear-gradient(135deg,#9d00ff,#ff2d78)" },
  { name:"Priya Sharma", role:"CTO & Co-founder",    avatar:"PS", grad:"linear-gradient(135deg,#00f5ff,#9d00ff)" },
  { name:"Marcus Lee",   role:"Head of Engineering", avatar:"ML", grad:"linear-gradient(135deg,#ff2d78,#ffe600)" },
  { name:"Sofia Ruiz",   role:"Head of Design",      avatar:"SR", grad:"linear-gradient(135deg,#00ff94,#00f5ff)" },
  { name:"James Park",   role:"Head of Product",     avatar:"JP", grad:"linear-gradient(135deg,#ffe600,#f97316)" },
  { name:"Nina Chen",    role:"Head of Growth",      avatar:"NC", grad:"linear-gradient(135deg,#9d00ff,#00f5ff)" },
];
const VALUES = [
  { icon:Zap,    color:"#9d00ff", title:"Speed first",        desc:"Every decision optimizes for helping teams ship faster. No bloat." },
  { icon:Heart,  color:"#ff2d78", title:"Engineer-native",    desc:"Built by engineers, for engineers. We eat our own dog food every day." },
  { icon:Globe,  color:"#00f5ff", title:"Radically open",     desc:"Our roadmap is public. Our API is open. We build with our community." },
  { icon:Shield, color:"#00ff94", title:"Security by default",desc:"SOC2 compliant, end-to-end encrypted, zero-trust architecture." },
];

function AboutPage() {
  return (
    <div className="mkt-body mkt-grid-bg" style={{ position:"relative" }}>
      <MktNav/>
      <div style={{ paddingTop:100 }}>
        {/* Hero */}
        <section className="mkt-section" style={{ textAlign:"center" }}>
          <div className="mkt-container" style={{ maxWidth:760 }}>
            <span className="mkt-badge mkt-badge-green" style={{ marginBottom:16 }}>Our story</span>
            <h1 style={{ fontSize:"clamp(32px,5vw,58px)", fontWeight:900, color:"white", fontFamily:"Syne,sans-serif", marginBottom:20, lineHeight:1.05 }}>
              We got tired of<br/><span className="mkt-grad-text">bad issue trackers.</span>
            </h1>
            <p style={{ fontSize:17, color:"#64748b", lineHeight:1.8, marginBottom:20 }}>
              IssueVault started in 2024 as a side project. Two engineers tired of Jira's slowness, GitHub Issues' lack of analytics, and Linear's price tag.
            </p>
            <p style={{ fontSize:15, color:"#475569", lineHeight:1.8 }}>
              Today 500+ engineering teams use IssueVault to track, triage, and ship. We're a small team that moves fast and ships every week.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section style={{ padding:"0 24px 80px" }}>
          <div className="mkt-container" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:16, textAlign:"center" }}>
            {[["2024","Founded"],["12","Team members"],["500+","Teams worldwide"],["99.9%","Uptime SLA"]].map(([v,l]) => (
              <div key={l} className="mkt-card" style={{ padding:24 }}>
                <div className="mkt-grad-text" style={{ fontSize:36, fontWeight:900, fontFamily:"Syne,sans-serif", marginBottom:6 }}>{v}</div>
                <div style={{ fontSize:13, color:"#475569" }}>{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section style={{ padding:"0 24px 80px" }}>
          <div className="mkt-container">
            <h2 style={{ fontSize:"clamp(24px,3vw,40px)", fontWeight:800, color:"white", fontFamily:"Syne,sans-serif", textAlign:"center", marginBottom:48 }}>What we believe in</h2>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:16 }}>
              {VALUES.map(({icon:Icon,color,title,desc}) => (
                <div key={title} className="mkt-card" style={{ padding:24, borderColor:`${color}22`, background:`${color}06` }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:`${color}15`, border:`1px solid ${color}30`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
                    <Icon size={19} color={color}/>
                  </div>
                  <h3 style={{ fontSize:16, fontWeight:700, color:"white", marginBottom:8 }}>{title}</h3>
                  <p style={{ fontSize:13, color:"#64748b", lineHeight:1.6 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section style={{ padding:"0 24px 80px" }}>
          <div className="mkt-container">
            <h2 style={{ fontSize:"clamp(24px,3vw,40px)", fontWeight:800, color:"white", fontFamily:"Syne,sans-serif", textAlign:"center", marginBottom:48 }}>Meet the team</h2>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:16 }}>
              {TEAM.map(({name,role,avatar,grad}) => (
                <div key={name} className="mkt-card" style={{ padding:24, textAlign:"center" }}>
                  <div style={{ width:60, height:60, borderRadius:16, background:grad, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:700, color:"white", fontFamily:"Syne,sans-serif", margin:"0 auto 14px" }}>{avatar}</div>
                  <div style={{ fontWeight:700, color:"white", fontSize:15, marginBottom:4 }}>{name}</div>
                  <div style={{ fontSize:12, color:"#475569" }}>{role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding:"0 24px 100px", textAlign:"center" }}>
          <div className="mkt-container" style={{ maxWidth:540 }}>
            <div style={{ padding:"56px 32px", borderRadius:28, background:"linear-gradient(135deg,rgba(157,0,255,0.12),rgba(255,45,120,0.08))", border:"1px solid rgba(157,0,255,0.25)" }}>
              <h2 style={{ fontSize:30, fontWeight:800, color:"white", fontFamily:"Syne,sans-serif", marginBottom:12 }}>Join our team</h2>
              <p style={{ color:"#64748b", marginBottom:28 }}>We're hiring engineers and designers who care about developer tools.</p>
              <a href="/contact" className="mkt-btn-primary" style={{ display:"inline-flex" }}>View open roles <ArrowRight size={15}/></a>
            </div>
          </div>
        </section>
      </div>
      <MktFooter/>
    </div>
  );
}
