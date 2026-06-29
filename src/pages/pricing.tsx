import { MktNav } from '@/components/MktNav'
import { MktFooter } from '@/components/MktFooter'
import { Check, X, Zap, ArrowRight } from 'lucide-react'
import { useState } from 'react'

const PLANS = [
  { name:"Free", price:0, color:"#00f5ff", popular:false, desc:"Perfect for solo devs.", yearly:0,
    features:["3 projects","100 issues / month","GitHub sync","CSV upload","7-day audit log","Email support"],
    missing:["Jira / Linear sync","n8n automation","Analytics","Team management","REST API","SSO / SAML"] },
  { name:"Pro", price:29, color:"#9d00ff", popular:true, desc:"For growing teams.", yearly:19,
    features:["Unlimited projects","Unlimited issues","GitHub sync","CSV upload","90-day audit log","Priority support","Jira / Linear sync","n8n automation","Full analytics","Team management","REST API"],
    missing:["SSO / SAML"] },
  { name:"Enterprise", price:-1, color:"#ff2d78", popular:false, desc:"Large teams & compliance.", yearly:-1,
    features:["Everything in Pro","Unlimited audit log","Dedicated support","Custom analytics","SSO / SAML","Self-hosting option","SLA guarantee","Custom contracts"],
    missing:[] },
]

export default function PricingPage() {
  const [yearly, setYearly] = useState(false)
  return (
    <div style={{ background:'#060612', color:'#e2e8f0', minHeight:'100vh', fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif' }}>
      <MktNav/>
      <section style={{ padding:'140px 24px 80px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:52 }}>
          <h1 style={{ fontSize:44, fontWeight:900, margin:'0 0 12px', letterSpacing:'-1.5px' }}>Simple pricing</h1>
          <p style={{ fontSize:17, color:'#64748b', margin:'0 0 28px' }}>No hidden fees. Cancel any time.</p>
          <div style={{ display:'inline-flex', background:'rgba(255,255,255,0.05)', borderRadius:10, padding:4, gap:2 }}>
            {['Monthly','Yearly'].map(opt => (
              <button key={opt} onClick={()=>setYearly(opt==='Yearly')}
                style={{ padding:'8px 20px', borderRadius:7, border:'none', cursor:'pointer', fontSize:13, fontWeight:600, background:yearly===(opt==='Yearly')?'rgba(157,0,255,0.3)':'transparent', color:yearly===(opt==='Yearly')?'#c084fc':'#64748b', transition:'all 0.2s' }}>
                {opt}{opt==='Yearly' && <span style={{ marginLeft:6, fontSize:10, padding:'2px 7px', borderRadius:999, background:'rgba(0,255,148,0.15)', color:'#00ff94', fontWeight:700 }}>-35%</span>}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
          {PLANS.map(plan => (
            <div key={plan.name} style={{ padding:32, borderRadius:20, border:`1.5px solid ${plan.popular?plan.color:'rgba(255,255,255,0.08)'}`, background:plan.popular?`${plan.color}06`:'rgba(255,255,255,0.02)', position:'relative' }}>
              {plan.popular && <div style={{ position:'absolute', top:-13, left:'50%', transform:'translateX(-50%)', padding:'3px 16px', borderRadius:999, background:'linear-gradient(135deg,#9d00ff,#ff2d78)', fontSize:11, fontWeight:700, color:'white', textTransform:'uppercase', letterSpacing:'1px', whiteSpace:'nowrap' }}>Most Popular</div>}
              <h3 style={{ fontSize:20, fontWeight:800, color:plan.color, margin:'0 0 6px', fontFamily:'monospace' }}>{plan.name}</h3>
              <p style={{ fontSize:13, color:'#64748b', margin:'0 0 20px' }}>{plan.desc}</p>
              <div style={{ marginBottom:24 }}>
                {plan.price === -1
                  ? <p style={{ fontSize:32, fontWeight:900, color:'white', fontFamily:'monospace', margin:0 }}>Custom</p>
                  : <p style={{ fontSize:40, fontWeight:900, color:'white', fontFamily:'monospace', margin:0 }}>
                      ${yearly && plan.yearly >= 0 ? plan.yearly : plan.price}
                      <span style={{ fontSize:14, color:'#64748b', fontWeight:400 }}>/mo</span>
                    </p>
                }
              </div>
              <a href="/signup" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'12px 0', borderRadius:11, background:plan.popular?'linear-gradient(135deg,#9d00ff,#ff2d78)':'rgba(255,255,255,0.06)', border:plan.popular?'none':`1px solid ${plan.color}40`, color:'white', fontWeight:700, fontSize:14, textDecoration:'none', marginBottom:28 }}>
                {plan.price===-1?'Contact sales':<><Zap size={14}/>{plan.price===0?'Start free':'Get started'}<ArrowRight size={13}/></>}
              </a>
              <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'#94a3b8' }}>
                    <Check size={14} color="#00ff94"/>{f}
                  </div>
                ))}
                {plan.missing.map(f => (
                  <div key={f} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'#334155' }}>
                    <X size={14} color="#334155"/>{f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <MktFooter/>
    </div>
  )
}
