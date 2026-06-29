import { Zap, Github, Twitter, Linkedin } from "lucide-react";

const LINKS = {
  Product:   [["Features","/landing#features"],["Pricing","/pricing"],["Changelog","#"],["Roadmap","#"]],
  Company:   [["About","/about"],["Blog","/blog"],["Careers","#"],["Press","#"]],
  Legal:     [["Privacy","#"],["Terms","#"],["Security","#"]],
  Dev:       [["Docs","/docs"],["API","/docs#api"],["Status","#"],["GitHub","https://github.com"]],
};

export function MktFooter() {
  return (
    <footer style={{ borderTop:"1px solid rgba(255,255,255,0.06)", background:"rgba(6,6,18,0.9)", padding:"64px 24px 32px" }}>
      <div className="mkt-container">
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", gap:48, marginBottom:48 }}>
          <div>
            <a href="/landing" style={{ display:"inline-flex", alignItems:"center", gap:10, textDecoration:"none", marginBottom:16 }}>
              <div style={{ width:34, height:34, borderRadius:9, background:"linear-gradient(135deg,#9d00ff,#ff2d78)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Zap size={16} color="white" strokeWidth={2.5}/>
              </div>
              <span style={{ fontWeight:800, fontSize:17, fontFamily:"Syne,monospace", background:"linear-gradient(135deg,#9d00ff,#ff2d78)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>IssueVault</span>
            </a>
            <p style={{ fontSize:13, color:"#475569", lineHeight:1.7, maxWidth:220, marginBottom:20 }}>
              The issue tracker built for modern engineering teams. Track, fix, ship.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              {[["https://github.com",Github],["https://twitter.com",Twitter],["https://linkedin.com",Linkedin]].map(([href, Icon]: any) => (
                <a key={href} href={href} target="_blank" rel="noreferrer"
                  style={{ width:34, height:34, borderRadius:8, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", color:"#64748b", transition:"all 0.2s" }}>
                  <Icon size={15}/>
                </a>
              ))}
            </div>
          </div>
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <h4 style={{ fontSize:11, fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"1px", marginBottom:16 }}>{group}</h4>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {items.map(([label, href]) => <a key={label} href={href} className="mkt-footer-link">{label}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div className="mkt-divider" style={{ marginBottom:24 }}/>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <p style={{ fontSize:13, color:"#334155" }}>© 2026 IssueVault. All rights reserved.</p>
          <span style={{ fontSize:11, padding:"3px 12px", borderRadius:999, background:"rgba(0,255,148,0.1)", color:"#00ff94", border:"1px solid rgba(0,255,148,0.2)" }}>● All systems operational</span>
        </div>
      </div>
    </footer>
  );
}
