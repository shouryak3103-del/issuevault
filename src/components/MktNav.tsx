import { useState } from "react";

import { Zap, Menu, X } from "lucide-react";

const NAV = [
  { label:"Product", href:"/landing#features" },
  { label:"Pricing",  href:"/pricing"  },
  { label:"Docs",     href:"/docs"     },
  { label:"Blog",     href:"/blog"     },
  { label:"About",    href:"/about"    },
];

export function MktNav() {
  const [open, setOpen] = useState(false);
  const [scrolled] = useState(false);

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:100,
      background: "rgba(6,6,18,0.85)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      backdropFilter: "blur(20px)",
      padding: "0 24px",
    }}>
      <div style={{ maxWidth:1200, margin:"0 auto", height:64, display:"flex", alignItems:"center", gap:32 }}>
        {/* Logo */}
        <a href="/landing" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none", flexShrink:0 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#9d00ff,#ff2d78)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Zap size={17} color="white" strokeWidth={2.5}/>
          </div>
          <span style={{ fontWeight:800, fontSize:18, fontFamily:"Syne,monospace", background:"linear-gradient(135deg,#9d00ff,#ff2d78)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            IssueVault
          </span>
        </a>

        {/* Desktop links */}
        <div className="mkt-hide-mobile" style={{ display:"flex", gap:28, flex:1 }}>
          {NAV.map(n => <a key={n.label} href={n.href} className="mkt-nav-link">{n.label}</a>)}
        </div>

        {/* CTA */}
        <div className="mkt-hide-mobile" style={{ display:"flex", gap:10, alignItems:"center", marginLeft:"auto" }}>
          <a href="/login" className="mkt-btn-sm mkt-btn-sm-outline">Log in</a>
          <a href="/signup" className="mkt-btn-sm mkt-btn-sm-solid"><Zap size={13}/> Start free</a>
        </div>

        {/* Hamburger */}
        <button onClick={() => setOpen(!open)} style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:"white", display:"none" }} className="mkt-show-mobile">
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background:"rgba(6,6,18,0.98)", borderTop:"1px solid rgba(255,255,255,0.06)", padding:"16px 24px" }}>
          {NAV.map(n => <a key={n.label} href={n.href} className="mkt-nav-link" style={{ display:"block", padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }} onClick={() => setOpen(false)}>{n.label}</a>)}
          <div style={{ display:"flex", gap:10, marginTop:16 }}>
            <a href="/login" className="mkt-btn-sm mkt-btn-sm-outline" style={{ flex:1, justifyContent:"center" }}>Log in</a>
            <a href="/signup" className="mkt-btn-sm mkt-btn-sm-solid" style={{ flex:1, justifyContent:"center" }}>Start free</a>
          </div>
        </div>
      )}
    </nav>
  );
}
