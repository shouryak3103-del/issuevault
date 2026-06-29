import { MktNav } from '@/components/MktNav'
import { MktFooter } from '@/components/MktFooter'

const POSTS = [
  { tag:'Product', color:'#9d00ff', title:'Introducing n8n Automation for IssueVault', date:'Jun 15, 2026', author:'Devon Kim', avatar:'DK', excerpt:'Trigger 400+ n8n workflows directly from issue events. Auto-escalate criticals, sync with Notion, and more.' },
  { tag:'Engineering', color:'#00f5ff', title:'How we built real-time GitHub sync in under 3 weeks', date:'May 28, 2026', author:'Luca Bianchi', avatar:'LB', excerpt:'A deep dive into our webhook architecture, deduplication engine, and the edge cases that almost broke us.' },
  { tag:'Guide', color:'#00ff94', title:'The ultimate guide to setting up team roles in IssueVault', date:'May 10, 2026', author:'Priya Shah', avatar:'PS', excerpt:'Admin, developer, tester, viewer — how to structure permissions for a 10-person or 100-person team.' },
  { tag:'Company', color:'#ff2d78', title:'IssueVault hits 500 teams worldwide 🎉', date:'Apr 22, 2026', author:'Maya Rodriguez', avatar:'MR', excerpt:"From zero to 500 teams in 14 months. Here's what we learned, what surprised us, and what comes next." },
]

export default function BlogPage() {
  return (
    <div style={{ background:'#060612', color:'#e2e8f0', minHeight:'100vh', fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif' }}>
      <MktNav/>
      <section style={{ padding:'140px 24px 80px', maxWidth:900, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:52 }}>
          <h1 style={{ fontSize:44, fontWeight:900, margin:'0 0 12px', letterSpacing:'-1.5px' }}>Blog</h1>
          <p style={{ fontSize:17, color:'#64748b' }}>Product updates, engineering deep-dives, and company news.</p>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {POSTS.map(post => (
            <a key={post.title} href="#" style={{ display:'block', padding:28, borderRadius:16, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', textDecoration:'none', transition:'border-color 0.2s' }}
              onMouseEnter={e=>(e.currentTarget.style.borderColor='rgba(157,0,255,0.3)')} onMouseLeave={e=>(e.currentTarget.style.borderColor='rgba(255,255,255,0.07)')}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                <span style={{ fontSize:11, padding:'2px 10px', borderRadius:999, background:`${post.color}15`, color:post.color, border:`1px solid ${post.color}30`, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.5px' }}>{post.tag}</span>
                <span style={{ fontSize:12, color:'#334155' }}>{post.date}</span>
              </div>
              <h3 style={{ fontSize:20, fontWeight:700, color:'white', margin:'0 0 10px', lineHeight:1.4 }}>{post.title}</h3>
              <p style={{ fontSize:14, color:'#64748b', lineHeight:1.6, margin:'0 0 16px' }}>{post.excerpt}</p>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#9d00ff,#ff2d78)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'white' }}>{post.avatar}</div>
                <span style={{ fontSize:13, color:'#64748b' }}>{post.author}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
      <MktFooter/>
    </div>
  )
}
