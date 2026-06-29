import { createFileRoute } from "@tanstack/react-router";
import { MktNav } from "@/components/MktNav";
import { MktFooter } from "@/components/MktFooter";
import { Book, Code2, Zap, GitBranch, Shield, ArrowRight, Search, Terminal } from "lucide-react";

export const Route = createFileRoute("/docs")({
  head: () => ({ meta: [{ title: "Docs — IssueVault" }] }),
  component: DocsPage,
});

const SECTIONS = [
  { icon:Zap,       color:"#9d00ff", title:"Getting Started",   desc:"Set up your account, create your first project, and import issues in under 5 minutes.",    links:["Quick start guide","Create a project","Import from GitHub"] },
  { icon:GitBranch, color:"#ff2d78", title:"Integrations",      desc:"Connect GitHub, Jira, Linear, Slack, and n8n. Sync issues with your existing tools.",        links:["GitHub sync","Jira integration","n8n automation"] },
  { icon:Code2,     color:"#00f5ff", title:"REST API",           desc:"Full REST API with JSON. Auth via API keys. Rate limits and pagination explained.",           links:["Authentication","Issues API","Webhooks"] },
  { icon:Shield,    color:"#00ff94", title:"Security & Admin",   desc:"SSO/SAML setup, role-based permissions, audit logs, IP allowlisting, data residency.",        links:["User roles","SSO setup","Audit logs"] },
  { icon:Book,      color:"#ffe600", title:"Guides",             desc:"Step-by-step guides for triage processes, escalation rules, and team setup.",                 links:["Triage workflow","Auto-assignment","Standup view"] },
  { icon:Terminal,  color:"#f97316", title:"CLI & SDK",          desc:"IssueVault CLI for terminal-based issue management. Node.js + Python SDKs.",                  links:["CLI reference","Node.js SDK","Python SDK"] },
];

const CODE = `# Install CLI
npm install -g @issuevault/cli

# Authenticate
issuevault auth login

# Create an issue
issuevault issue create \\
  --title "Login button broken" \\
  --severity critical \\
  --assignee @sarah`;

function DocsPage() {
  return (
    <div className="mkt-body mkt-grid-bg" style={{ position:"relative" }}>
      <MktNav/>
      <div style={{ paddingTop:100 }}>
        <section className="mkt-section" style={{ textAlign:"center" }}>
          <div className="mkt-container">
            <span className="mkt-badge mkt-badge-cyan" style={{ marginBottom:16 }}>Documentation</span>
            <h1 style={{ fontSize:"clamp(32px,5vw,56px)", fontWeight:900, color:"white", fontFamily:"Syne,sans-serif", marginBottom:16 }}>
              Everything you need to <span className="mkt-grad-text">build and ship</span>
            </h1>
            <p style={{ fontSize:17, color:"#64748b", maxWidth:480, margin:"0 auto 32px" }}>Comprehensive docs, API reference, and guides. Always up to date.</p>
            <div style={{ position:"relative", maxWidth:480, margin:"0 auto" }}>
              <Search size={16} style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", color:"#475569" }}/>
              <input className="mkt-input" style={{ paddingLeft:44, borderRadius:999 }} placeholder="Search docs…"/>
            </div>
          </div>
        </section>

        {/* Code block */}
        <section style={{ padding:"0 24px 64px" }}>
          <div className="mkt-container" style={{ maxWidth:720 }}>
            <div className="mkt-card" style={{ overflow:"hidden" }}>
              <div style={{ padding:"12px 16px", background:"rgba(157,0,255,0.08)", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:"#ef4444" }}/>
                <div style={{ width:10, height:10, borderRadius:"50%", background:"#f97316" }}/>
                <div style={{ width:10, height:10, borderRadius:"50%", background:"#00ff94" }}/>
                <span style={{ fontSize:12, color:"#475569", marginLeft:8, fontFamily:"JetBrains Mono,monospace" }}>terminal</span>
              </div>
              <pre style={{ padding:24, fontSize:13, fontFamily:"JetBrains Mono,monospace", color:"#00ff94", lineHeight:1.8, margin:0, overflowX:"auto" }}>{CODE}</pre>
            </div>
          </div>
        </section>

        <section style={{ padding:"0 24px 100px" }}>
          <div className="mkt-container">
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:16 }}>
              {SECTIONS.map(({icon:Icon,color,title,desc,links}) => (
                <div key={title} className="mkt-card" style={{ padding:24, borderColor:`${color}22`, background:`${color}06` }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:`${color}15`, border:`1px solid ${color}30`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
                    <Icon size={19} color={color}/>
                  </div>
                  <h3 style={{ fontSize:17, fontWeight:700, color:"white", marginBottom:8 }}>{title}</h3>
                  <p style={{ fontSize:13, color:"#64748b", lineHeight:1.6, marginBottom:16 }}>{desc}</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    {links.map(l => (
                      <a key={l} href="#" style={{ fontSize:13, color:"#9d00ff", textDecoration:"none", display:"flex", alignItems:"center", gap:4 }}>
                        <ArrowRight size={12}/>{l}
                      </a>
                    ))}
                  </div>
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
