import { Link } from 'react-router-dom'
import { kpis, audit, issues, records, analyticsWeekly } from '@/lib/mock-data'
import { Sparkles, ArrowRight, TrendingUp, CheckCircle2, Upload, Zap, AlertTriangle, Database, Users, BarChart3 } from 'lucide-react'

const maxFixed = Math.max(...analyticsWeekly.map(d => d.fixed))
const SEV: Record<string,string> = { high:'#ef4444', medium:'#ffe600', low:'#00f5ff', fixed:'#00ff94' }

export default function Dashboard() {
  const topIssues = issues.slice(0, 5)
  const pending = issues.filter(i => i.status === 'pending').length

  return (
    <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', flexDirection:'column', gap:24 }}>

      {/* Hero */}
      <div style={{ position:'relative', overflow:'hidden', borderRadius:24, background:'linear-gradient(135deg,#9d00ff 0%,#ff2d78 50%,#ffe600 100%)', padding:'36px 40px', color:'white' }}>
        <div style={{ position:'absolute', right:-40, top:-60, width:220, height:220, borderRadius:'50%', background:'rgba(255,45,120,0.4)', filter:'blur(40px)' }}/>
        <div style={{ position:'absolute', right:80, bottom:-60, width:180, height:180, borderRadius:'50%', background:'rgba(255,230,0,0.35)', filter:'blur(40px)' }}/>
        <div style={{ position:'absolute', top:20, right:32 }}>
          <div style={{ padding:'12px 18px', borderRadius:16, background:'rgba(255,255,255,0.15)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.3)', transform:'rotate(2deg)' }}>
            <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'1.5px', opacity:0.8, margin:0 }}>Clean score</p>
            <p style={{ fontSize:34, fontWeight:800, fontFamily:'monospace', lineHeight:1, margin:'4px 0 0' }}>{kpis.cleanScore}<span style={{ fontSize:16 }}>%</span></p>
          </div>
        </div>
        <div style={{ position:'relative' }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:999, background:'rgba(255,255,255,0.18)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.35)', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:14 }}>
            <Sparkles size={12}/>AI scan complete · 2m ago
          </span>
          <h2 style={{ fontSize:40, fontWeight:800, margin:'0 0 10px', lineHeight:1.05 }}>Your data is<br/><span style={{ textDecoration:'underline', textDecorationStyle:'wavy', textDecorationColor:'rgba(255,255,255,0.5)' }}>spotless-ish</span> ✨</h2>
          <p style={{ fontSize:15, opacity:0.88, margin:'0 0 20px', maxWidth:480 }}>{pending} issues need your review. {kpis.fixedToday} fixed today. AI confidence: 94%.</p>
          <div style={{ display:'flex', gap:10 }}>
            <Link to="/fixes" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 20px', borderRadius:12, background:'white', color:'#1e0035', fontWeight:700, fontSize:13, textDecoration:'none' }}>
              <Zap size={15}/>Review fixes<ArrowRight size={14}/>
            </Link>
            <Link to="/upload" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 20px', borderRadius:12, background:'rgba(255,255,255,0.2)', backdropFilter:'blur(8px)', color:'white', fontWeight:600, fontSize:13, textDecoration:'none', border:'1px solid rgba(255,255,255,0.3)' }}>
              <Upload size={15}/>Upload CSV
            </Link>
          </div>
        </div>
      </div>

      {/* KPI tiles */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(170px,1fr))', gap:14 }}>
        {[
          { icon:Database,     label:'Total records',  value:kpis.totalRecords.toLocaleString(), color:'#00f5ff' },
          { icon:AlertTriangle,label:'Issues found',   value:kpis.issuesFound,                   color:'#ff2d78' },
          { icon:CheckCircle2, label:'Fixed today',    value:kpis.fixedToday,                    color:'#00ff94' },
          { icon:Users,        label:'Duplicates',     value:kpis.duplicates,                    color:'#9d00ff' },
          { icon:BarChart3,    label:'Missing fields', value:kpis.missingValues,                 color:'#ffe600' },
        ].map(({ icon:Icon, label, value, color }) => (
          <div key={label} style={{ padding:20, borderRadius:14, background:`${color}0a`, border:`1px solid ${color}22` }}>
            <div style={{ width:36, height:36, borderRadius:9, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
              <Icon size={16} color={color}/>
            </div>
            <p style={{ fontSize:26, fontWeight:800, color:'white', fontFamily:'monospace', margin:'0 0 4px', lineHeight:1 }}>{value}</p>
            <p style={{ fontSize:11, color:'#475569', margin:0, textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:600 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Chart + Recent issues */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:16 }}>
        {/* Weekly bar chart */}
        <div style={{ padding:24, borderRadius:16, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
            <div>
              <h3 style={{ fontSize:14, fontWeight:700, color:'white', margin:'0 0 3px' }}>Weekly activity</h3>
              <p style={{ fontSize:11, color:'#475569', margin:0 }}>Issues fixed per day</p>
            </div>
            <span style={{ fontSize:11, padding:'3px 9px', borderRadius:999, background:'rgba(0,255,148,0.1)', color:'#00ff94', fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
              <TrendingUp size={10}/>+18%
            </span>
          </div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:90 }}>
            {analyticsWeekly.map((d, i) => (
              <div key={d.day} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <div style={{ width:'100%', borderRadius:'4px 4px 0 0', background:i===6?'#9d00ff':'rgba(157,0,255,0.3)', height:`${(d.fixed/maxFixed)*100}%`, minHeight:6, transition:'height 0.3s' }}/>
                <span style={{ fontSize:9, color:'#475569', fontWeight:600 }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent issues */}
        <div style={{ padding:24, borderRadius:16, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:'white', margin:0 }}>Top issues</h3>
            <Link to="/issues" style={{ fontSize:12, color:'#9d00ff', textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}>All issues<ArrowRight size={12}/></Link>
          </div>
          {topIssues.map(issue => (
            <div key={issue.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize:10, padding:'2px 7px', borderRadius:999, background:`${SEV[issue.severity]}18`, color:SEV[issue.severity], border:`1px solid ${SEV[issue.severity]}30`, fontWeight:700, flexShrink:0 }}>{issue.severity}</span>
              <span style={{ fontSize:13, color:'#cbd5e1', flex:1 }}>{issue.suggestion}</span>
              <span style={{ fontSize:11, color:'#9d00ff', fontFamily:'monospace', flexShrink:0 }}>{issue.recordId}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent audit */}
      <div style={{ padding:24, borderRadius:16, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:'white', margin:0 }}>Recent activity</h3>
          <Link to="/audit" style={{ fontSize:12, color:'#9d00ff', textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}>Full log<ArrowRight size={12}/></Link>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {audit.slice(0,4).map((entry, i) => (
            <div key={entry.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom: i<3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div style={{ width:32, height:32, borderRadius:8, background:entry.user==='AI Auto'?'linear-gradient(135deg,#9d00ff,#ff2d78)':'rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'white', flexShrink:0 }}>
                {entry.user==='AI Auto'?<Sparkles size={13}/>:entry.user.slice(0,2)}
              </div>
              <div style={{ flex:1 }}>
                <span style={{ fontSize:13, color:'#cbd5e1', fontWeight:500 }}>{entry.user} </span>
                <span style={{ fontSize:13, color:'#64748b' }}>{entry.action} · </span>
                <span style={{ fontSize:13, color:'#475569' }}>{entry.target}</span>
              </div>
              <span style={{ fontSize:11, color:'#334155', fontFamily:'monospace', flexShrink:0 }}>{entry.time.split(' ')[1]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
