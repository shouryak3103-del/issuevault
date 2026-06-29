import { MktNav } from '@/components/MktNav'
import { MktFooter } from '@/components/MktFooter'
import { Zap, GitBranch, BarChart3, Bell, Users, Code2, ArrowRight, Star, Check } from 'lucide-react'

const FEATURES = [
  { icon:GitBranch, color:"#9d00ff", title:"GitHub & Jira Sync",   desc:"Two-way sync with GitHub, Jira, and Linear. Smart deduplication — no double imports, ever." },
  { icon:Zap,       color:"#ff2d78", title:"n8n Automation",       desc:"Trigger 400+ workflows on issue events. Auto-escalate criticals to PagerDuty, Slack, or email." },
  { icon:BarChart3, color:"#00f5ff", title:"Deep Analytics",        desc:"30-day trends, severity heat maps, resolution times, and top contributor leaderboards." },
  { icon:Bell,      color:"#ffe600", title:"Smart Alerts",          desc:"Critical issue pings, daily digests, and unread badges. Never miss a blocker." },
  { icon:Users,     color:"#00ff94", title:"Team Management",       desc:"Role-based access (admin/dev/tester/viewer), department groups, per-member stats." },
  { icon:Code2,     color:"#f97316", title:"Developer API",         desc:"Full REST API + inbound webhooks. Push issues from any CI/CD pipeline or monitoring tool." },
]
const INTEGRATIONS = [
  {name:"GitHub",emoji:"🐙"},{name:"Jira",emoji:"🔵"},{name:"Linear",emoji:"🟣"},
  {name:"Slack",emoji:"💬"},{name:"n8n",emoji:"🔶"},{name:"Notion",emoji:"📋"},
  {name:"PagerDuty",emoji:"🚨"},{name:"GitHub Actions",emoji:"⚙️"},
]
const TESTIMONIALS = [
  { name:"Sarah Chen",   role:"Engineering Lead @ Stripe",  avatar:"SC", text:"IssueVault replaced three tools. The GitHub sync alone saves us 2 hours every single day.", rating:5 },
  { name:"Marcus Rivera",role:"CTO @ Finova",               avatar:"MR", text:"The n8n integration is insane. Critical bugs auto-escalate to PagerDuty before engineers open their laptops.", rating:5 },
  { name:"Priya Patel",  role:"Staff Engineer @ Vercel",    avatar:"PP", text:"Finally a tracker that doesn't fight my workflow. Clean API, great UI, ships fast.", rating:5 },
]
const STATS = [
  {value:"10k+",label:"Issues tracked"},{value:"500+",label:"Teams worldwide"},
  {value:"99.9%",label:"Uptime SLA"},{value:"<2s",label:"Sync time"},
]

export default function LandingPage() {
  return (
    <div style={{ background:'#060612', color:'#e2e8f0', minHeight:'100vh', fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif' }}>
      <MktNav/>

      {/* HERO */}
      <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'140px 24px 80px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'15%', left:'20%', width:500, height:500, borderRadius:'50%', background:'rgba(157,0,255,0.08)', filter:'blur(80px)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'20%', right:'15%', width:400, height:400, borderRadius:'50%', background:'rgba(255,45,120,0.07)', filter:'blur(80px)', pointerEvents:'none' }}/>
        <div style={{ position:'relative', maxWidth:820, zIndex:1 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px', borderRadius:999, background:'rgba(157,0,255,0.12)', border:'1px solid rgba(157,0,255,0.3)', color:'#c084fc', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:28 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#00ff94', boxShadow:'0 0 8px #00ff94', display:'inline-block' }}/> Now with n8n automation
          </div>
          <h1 style={{ fontSize:'clamp(40px,7vw,80px)', fontWeight:900, lineHeight:1.05, margin:'0 0 24px', letterSpacing:'-2px' }}>
            The issue tracker<br/>
            <span style={{ background:'linear-gradient(135deg,#9d00ff,#ff2d78,#ffe600)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              built for speed.
            </span>
          </h1>
          <p style={{ fontSize:'clamp(16px,2vw,20px)', color:'#64748b', maxWidth:600, margin:'0 auto 36px', lineHeight:1.7 }}>
            Track bugs, sync with GitHub & Jira, automate workflows with n8n. One place for your entire engineering team.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <a href="/signup" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 28px', borderRadius:12, background:'linear-gradient(135deg,#9d00ff,#ff2d78)', color:'white', fontWeight:700, fontSize:15, textDecoration:'none', boxShadow:'0 0 30px rgba(157,0,255,0.4)' }}>
              <Zap size={16}/>Start free — no card needed<ArrowRight size={15}/>
            </a>
            <a href="/login" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 28px', borderRadius:12, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8', fontWeight:600, fontSize:15, textDecoration:'none' }}>
              Sign in
            </a>
          </div>
          {/* Stats */}
          <div style={{ display:'flex', gap:32, justifyContent:'center', marginTop:56, flexWrap:'wrap' }}>
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign:'center' }}>
                <p style={{ fontSize:28, fontWeight:800, fontFamily:'monospace', background:'linear-gradient(135deg,#9d00ff,#ff2d78)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', margin:'0 0 4px' }}>{s.value}</p>
                <p style={{ fontSize:12, color:'#475569', margin:0, textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:600 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding:'80px 24px', maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <h2 style={{ fontSize:36, fontWeight:800, margin:'0 0 12px', letterSpacing:'-1px' }}>Everything your team needs</h2>
          <p style={{ fontSize:16, color:'#64748b', margin:0 }}>No more juggling five tools.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:20 }}>
          {FEATURES.map(({ icon:Icon, color, title, desc }) => (
            <div key={title} style={{ padding:28, borderRadius:16, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', transition:'all 0.2s' }}>
              <div style={{ width:44, height:44, borderRadius:12, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                <Icon size={20} color={color}/>
              </div>
              <h3 style={{ fontSize:17, fontWeight:700, color:'white', margin:'0 0 8px' }}>{title}</h3>
              <p style={{ fontSize:14, color:'#64748b', lineHeight:1.6, margin:0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section style={{ padding:'60px 24px', background:'rgba(255,255,255,0.01)', borderTop:'1px solid rgba(255,255,255,0.05)', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ textAlign:'center', fontSize:12, color:'#475569', textTransform:'uppercase', letterSpacing:'2px', fontWeight:700, marginBottom:28 }}>Integrates with your stack</p>
        <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
          {INTEGRATIONS.map(i => (
            <div key={i.name} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 18px', borderRadius:10, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', fontSize:13, fontWeight:500, color:'#94a3b8' }}>
              <span style={{ fontSize:18 }}>{i.emoji}</span>{i.name}
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding:'80px 24px', maxWidth:1100, margin:'0 auto' }}>
        <h2 style={{ textAlign:'center', fontSize:32, fontWeight:800, margin:'0 0 48px', letterSpacing:'-1px' }}>Loved by engineering teams</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} style={{ padding:28, borderRadius:16, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display:'flex', gap:3, marginBottom:16 }}>
                {[...Array(t.rating)].map((_,i) => <Star key={i} size={14} fill="#ffe600" color="#ffe600"/>)}
              </div>
              <p style={{ fontSize:15, color:'#94a3b8', lineHeight:1.7, margin:'0 0 20px', fontStyle:'italic' }}>"{t.text}"</p>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#9d00ff,#ff2d78)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'white' }}>{t.avatar}</div>
                <div><p style={{ fontSize:14, fontWeight:600, color:'white', margin:0 }}>{t.name}</p><p style={{ fontSize:12, color:'#475569', margin:0 }}>{t.role}</p></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'80px 24px', textAlign:'center' }}>
        <div style={{ maxWidth:600, margin:'0 auto', padding:48, borderRadius:24, background:'linear-gradient(135deg,rgba(157,0,255,0.1),rgba(255,45,120,0.08))', border:'1px solid rgba(157,0,255,0.25)' }}>
          <h2 style={{ fontSize:34, fontWeight:800, margin:'0 0 12px', letterSpacing:'-1px' }}>Ready to ship faster?</h2>
          <p style={{ fontSize:16, color:'#64748b', margin:'0 0 28px' }}>Join 500+ teams. Free forever for small teams.</p>
          <a href="/signup" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 32px', borderRadius:12, background:'linear-gradient(135deg,#9d00ff,#ff2d78)', color:'white', fontWeight:700, fontSize:15, textDecoration:'none', boxShadow:'0 0 30px rgba(157,0,255,0.4)' }}>
            <Zap size={16}/>Get started free<ArrowRight size={15}/>
          </a>
        </div>
      </section>

      <MktFooter/>
    </div>
  )
}
