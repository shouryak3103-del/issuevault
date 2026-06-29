import { MktNav } from '@/components/MktNav'
import { MktFooter } from '@/components/MktFooter'
import { Zap } from 'lucide-react'

const TEAM = [
  { name:"Maya Rodriguez", role:"Co-founder & CEO", avatar:"MR", bio:"Ex-Stripe. Obsessed with developer tooling." },
  { name:"Devon Kim",       role:"Co-founder & CTO", avatar:"DK", bio:"Previously staff eng at Vercel. Loves distributed systems." },
  { name:"Priya Shah",      role:"Head of Product",  avatar:"PS", bio:"Ex-Linear. Ships fast, thinks clearly." },
  { name:"Luca Bianchi",    role:"Lead Engineer",    avatar:"LB", bio:"Open-source contributor, ex-PlanetScale." },
]
const VALUES = [
  { emoji:"⚡", title:"Ship fast",       desc:"We don't wait for perfect. We ship, learn, and iterate." },
  { emoji:"🔍", title:"Stay honest",     desc:"No dark patterns, no vendor lock-in. Simple honest pricing." },
  { emoji:"🤝", title:"Build for devs",  desc:"Every feature starts with a real engineering pain point." },
  { emoji:"🌍", title:"Default to open", desc:"Open API, open roadmap, open feedback. Always." },
]

export default function AboutPage() {
  return (
    <div style={{ background:'#060612', color:'#e2e8f0', minHeight:'100vh', fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif' }}>
      <MktNav/>
      <section style={{ padding:'140px 24px 80px', maxWidth:900, margin:'0 auto', textAlign:'center' }}>
        <span style={{ display:'inline-block', padding:'4px 14px', borderRadius:999, background:'rgba(157,0,255,0.1)', border:'1px solid rgba(157,0,255,0.25)', color:'#c084fc', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:20 }}>About</span>
        <h1 style={{ fontSize:44, fontWeight:900, margin:'0 0 20px', letterSpacing:'-1.5px' }}>We're building the issue tracker<br/>teams actually love</h1>
        <p style={{ fontSize:17, color:'#64748b', lineHeight:1.7, maxWidth:600, margin:'0 auto 48px' }}>IssueVault started because every existing tracker was either too simple, too complex, or too expensive. We set out to fix that.</p>
        <div style={{ display:'flex', gap:32, justifyContent:'center', flexWrap:'wrap' }}>
          {[{v:"2024",l:"Founded"},{v:"500+",l:"Teams"},{v:"$2M",l:"ARR"},{v:"4",l:"Full-time"}].map(({v,l}) => (
            <div key={l}>
              <p style={{ fontSize:32, fontWeight:800, fontFamily:'monospace', background:'linear-gradient(135deg,#9d00ff,#ff2d78)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', margin:'0 0 4px' }}>{v}</p>
              <p style={{ fontSize:12, color:'#475569', textTransform:'uppercase', letterSpacing:'0.5px', margin:0 }}>{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section style={{ padding:'0 24px 80px', maxWidth:900, margin:'0 auto' }}>
        <h2 style={{ fontSize:28, fontWeight:800, margin:'0 0 32px', textAlign:'center' }}>What we believe</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
          {VALUES.map(v => (
            <div key={v.title} style={{ padding:24, borderRadius:14, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>
              <span style={{ fontSize:28, display:'block', marginBottom:12 }}>{v.emoji}</span>
              <h3 style={{ fontSize:16, fontWeight:700, color:'white', margin:'0 0 8px' }}>{v.title}</h3>
              <p style={{ fontSize:13, color:'#64748b', lineHeight:1.6, margin:0 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ padding:'0 24px 100px', maxWidth:900, margin:'0 auto' }}>
        <h2 style={{ fontSize:28, fontWeight:800, margin:'0 0 32px', textAlign:'center' }}>The team</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
          {TEAM.map((m,i) => {
            const grads = ['linear-gradient(135deg,#9d00ff,#ff2d78)','linear-gradient(135deg,#00f5ff,#9d00ff)','linear-gradient(135deg,#f97316,#ff2d78)','linear-gradient(135deg,#ffe600,#00f5ff)']
            return (
              <div key={m.name} style={{ padding:24, borderRadius:14, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', textAlign:'center' }}>
                <div style={{ width:56, height:56, borderRadius:14, background:grads[i], display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:800, color:'white', margin:'0 auto 14px' }}>{m.avatar}</div>
                <h3 style={{ fontSize:15, fontWeight:700, color:'white', margin:'0 0 4px' }}>{m.name}</h3>
                <p style={{ fontSize:12, color:'#9d00ff', fontWeight:600, margin:'0 0 8px' }}>{m.role}</p>
                <p style={{ fontSize:13, color:'#64748b', margin:0, lineHeight:1.6 }}>{m.bio}</p>
              </div>
            )
          })}
        </div>
      </section>
      <MktFooter/>
    </div>
  )
}
