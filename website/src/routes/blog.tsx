import { createFileRoute } from "@tanstack/react-router";
import { MktNav } from "@/components/MktNav";
import { MktFooter } from "@/components/MktFooter";
import { Clock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({ meta: [{ title: "Blog — IssueVault" }] }),
  component: BlogPage,
});

const POSTS = [
  { slug:"n8n", title:"How to automate issue routing with n8n", excerpt:"Build zero-code workflows that auto-route bugs to the right team and escalate criticals to PagerDuty.", date:"Jun 20, 2026", readTime:"8 min", tag:"Tutorial", tagColor:"#9d00ff", author:"Priya Sharma", avatar:"PS" },
  { slug:"github", title:"Deep dive: GitHub ↔ IssueVault two-way sync", excerpt:"What we learned about rate limits, deduplication, and keeping 50k repos in sync without melting Supabase.", date:"Jun 14, 2026", readTime:"12 min", tag:"Engineering", tagColor:"#00f5ff", author:"Marcus Lee", avatar:"ML" },
  { slug:"compare", title:"Linear vs Jira vs IssueVault: an honest comparison", excerpt:"We spent 6 months using all three. Here's what each is actually good at — no sponsorships, no agenda.", date:"Jun 7, 2026", readTime:"15 min", tag:"Opinion", tagColor:"#ff2d78", author:"Alex Kim", avatar:"AK" },
  { slug:"search", title:"Full-text search in Supabase: the right way", excerpt:"How we built fast, ranked full-text search across issues, actions, records, and audit logs without ElasticSearch.", date:"May 30, 2026", readTime:"10 min", tag:"Engineering", tagColor:"#00f5ff", author:"Priya Sharma", avatar:"PS" },
  { slug:"audit", title:"Why every SaaS needs audit logs (and how to build them)", excerpt:"Audit logs aren't just compliance. They're a superpower for debugging and customer trust.", date:"May 22, 2026", readTime:"9 min", tag:"Best Practices", tagColor:"#00ff94", author:"Sofia Ruiz", avatar:"SR" },
  { slug:"launch", title:"IssueVault Launch Week: everything we shipped", excerpt:"n8n automation, Linear sync, full-text search, advanced analytics, team roles, and a CLI — in 5 days.", date:"May 15, 2026", readTime:"6 min", tag:"Product", tagColor:"#ffe600", author:"Alex Kim", avatar:"AK" },
];

function BlogPage() {
  return (
    <div className="mkt-body mkt-grid-bg" style={{ position:"relative" }}>
      <MktNav/>
      <div style={{ paddingTop:100 }}>
        <section className="mkt-section" style={{ textAlign:"center", paddingBottom:0 }}>
          <div className="mkt-container">
            <span className="mkt-badge mkt-badge-purple" style={{ marginBottom:16 }}>Engineering Blog</span>
            <h1 style={{ fontSize:"clamp(32px,5vw,56px)", fontWeight:900, color:"white", fontFamily:"Syne,sans-serif", marginBottom:16 }}>
              What we're <span className="mkt-grad-text">building & learning</span>
            </h1>
            <p style={{ fontSize:17, color:"#64748b", maxWidth:480, margin:"0 auto" }}>Deep dives, tutorials, and opinions from the IssueVault team.</p>
          </div>
        </section>

        {/* Featured */}
        <section style={{ padding:"48px 24px 0" }}>
          <div className="mkt-container">
            <div className="mkt-card" style={{ padding:36, borderColor:"rgba(157,0,255,0.25)", background:"rgba(157,0,255,0.05)", display:"grid", gridTemplateColumns:"1fr auto", gap:32, alignItems:"center" }}>
              <div>
                <span className="mkt-badge mkt-badge-purple" style={{ marginBottom:14 }}>Featured</span>
                <h2 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:800, color:"white", fontFamily:"Syne,sans-serif", marginBottom:12, lineHeight:1.3 }}>{POSTS[0].title}</h2>
                <p style={{ fontSize:15, color:"#64748b", lineHeight:1.7, marginBottom:20 }}>{POSTS[0].excerpt}</p>
                <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#9d00ff,#ff2d78)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"white" }}>{POSTS[0].avatar}</div>
                    <span style={{ fontSize:13, color:"#64748b" }}>{POSTS[0].author}</span>
                  </div>
                  <span style={{ fontSize:12, color:"#334155" }}>{POSTS[0].date}</span>
                  <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:12, color:"#334155" }}><Clock size={11}/>{POSTS[0].readTime}</span>
                </div>
              </div>
              <a href="#" className="mkt-btn-primary" style={{ flexShrink:0, whiteSpace:"nowrap" }}>Read post <ArrowRight size={15}/></a>
            </div>
          </div>
        </section>

        <section style={{ padding:"32px 24px 100px" }}>
          <div className="mkt-container">
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:16 }}>
              {POSTS.slice(1).map(post => (
                <a key={post.slug} href="#" style={{ textDecoration:"none" }}>
                  <div className="mkt-card" style={{ padding:24, height:"100%" }}>
                    <span style={{ fontSize:11, padding:"3px 10px", borderRadius:999, background:`${post.tagColor}15`, color:post.tagColor, border:`1px solid ${post.tagColor}30`, fontWeight:600, marginBottom:12, display:"inline-block" }}>{post.tag}</span>
                    <h3 style={{ fontSize:17, fontWeight:700, color:"white", marginBottom:10, lineHeight:1.4 }}>{post.title}</h3>
                    <p style={{ fontSize:13, color:"#64748b", lineHeight:1.6, marginBottom:16 }}>{post.excerpt.slice(0,110)}…</p>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:28, height:28, borderRadius:7, background:"linear-gradient(135deg,#9d00ff,#ff2d78)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"white" }}>{post.avatar}</div>
                      <span style={{ fontSize:12, color:"#475569" }}>{post.author}</span>
                      <span style={{ fontSize:12, color:"#334155", marginLeft:"auto", display:"flex", alignItems:"center", gap:4 }}><Clock size={11}/>{post.readTime}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
      <MktFooter/>
    </div>
  );
}
