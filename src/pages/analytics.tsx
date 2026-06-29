import { analyticsWeekly, kpis, issues, records } from '@/lib/mock-data'
import { TrendingUp, TrendingDown } from 'lucide-react'

const maxFound = Math.max(...analyticsWeekly.map(d=>d.found))
const maxFixed = Math.max(...analyticsWeekly.map(d=>d.fixed))
const maxVal   = Math.max(maxFound, maxFixed)

export default function AnalyticsPage() {
  const highCount = issues.filter(i=>i.severity==='high').length
  const medCount  = issues.filter(i=>i.severity==='medium').length
  const cleanPct  = Math.round((records.filter(r=>r.issues.length===0).length / records.length) * 100)

  return (
    <div style={{ maxWidth:1100, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:24, fontWeight:800, color:'white', fontFamily:'monospace', margin:'0 0 4px' }}>Analytics</h2>
        <p style={{ fontSize:13, color:'#475569', margin:0 }}>Data quality overview</p>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:14, marginBottom:24 }}>
        {[
          { label:'Total records',  value:kpis.totalRecords.toLocaleString(), delta:'+10.4%', up:true,  color:'#00f5ff' },
          { label:'Issues found',   value:kpis.issuesFound,                   delta:'-8.1%',  up:false, color:'#ff2d78' },
          { label:'Fixed (7 days)', value:kpis.fixedToday * 7,                delta:'+18%',   up:true,  color:'#00ff94' },
          { label:'Clean score',    value:`${kpis.cleanScore}%`,              delta:'+1.2pt', up:true,  color:'#9d00ff' },
          { label:'High severity',  value:highCount,                          delta:'-2',     up:false, color:'#ef4444' },
        ].map(({ label, value, delta, up, color }) => (
          <div key={label} style={{ padding:20, borderRadius:12, background:`${color}08`, border:`1px solid ${color}20` }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
              <p style={{ fontSize:10, color:'#475569', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:600, margin:0 }}>{label}</p>
              <span style={{ fontSize:11, padding:'2px 7px', borderRadius:999, display:'flex', alignItems:'center', gap:3, background:up?'rgba(0,255,148,0.1)':'rgba(239,68,68,0.1)', color:up?'#00ff94':'#ef4444', fontWeight:600 }}>
                {up?<TrendingUp size={9}/>:<TrendingDown size={9}/>}{delta}
              </span>
            </div>
            <p style={{ fontSize:26, fontWeight:800, color:'white', fontFamily:'monospace', margin:0 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{ padding:26, borderRadius:16, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)', marginBottom:16 }}>
        <h3 style={{ fontSize:15, fontWeight:700, color:'white', margin:'0 0 4px' }}>Weekly activity</h3>
        <p style={{ fontSize:12, color:'#475569', margin:'0 0 22px' }}>Issues found vs fixed · last 7 days</p>
        <div style={{ display:'flex', alignItems:'flex-end', gap:12, height:130 }}>
          {analyticsWeekly.map(d => (
            <div key={d.day} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
              <div style={{ width:'100%', display:'flex', gap:3, alignItems:'flex-end', height:110 }}>
                <div title={`Found: ${d.found}`} style={{ flex:1, borderRadius:'4px 4px 0 0', background:'rgba(255,45,120,0.4)', height:`${(d.found/maxVal)*100}%`, minHeight:5, transition:'height 0.4s' }}/>
                <div title={`Fixed: ${d.fixed}`} style={{ flex:1, borderRadius:'4px 4px 0 0', background:'#00ff94', height:`${(d.fixed/maxVal)*100}%`, minHeight:5, transition:'height 0.4s' }}/>
              </div>
              <span style={{ fontSize:11, color:'#475569', fontWeight:600 }}>{d.day}</span>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:20, marginTop:14 }}>
          <span style={{ display:'flex', alignItems:'center', gap:7, fontSize:12, color:'#64748b' }}><span style={{ width:12, height:12, borderRadius:3, background:'rgba(255,45,120,0.4)', display:'inline-block' }}/>Found</span>
          <span style={{ display:'flex', alignItems:'center', gap:7, fontSize:12, color:'#64748b' }}><span style={{ width:12, height:12, borderRadius:3, background:'#00ff94', display:'inline-block' }}/>Fixed</span>
        </div>
      </div>

      {/* Issue type breakdown */}
      <div style={{ padding:26, borderRadius:16, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>
        <h3 style={{ fontSize:15, fontWeight:700, color:'white', margin:'0 0 18px' }}>Issue breakdown</h3>
        {[
          { label:'Duplicates',     count:issues.filter(i=>i.type==='duplicate').length,       color:'#ff2d78' },
          { label:'Missing fields', count:issues.filter(i=>i.type==='missing').length,          color:'#ef4444' },
          { label:'Invalid format', count:issues.filter(i=>i.type==='invalid_format').length,   color:'#ffe600' },
          { label:'Inconsistent',   count:issues.filter(i=>i.type==='inconsistent').length,     color:'#00f5ff' },
        ].map(({ label, count, color }) => (
          <div key={label} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
            <span style={{ fontSize:13, color:'#94a3b8', width:130, flexShrink:0 }}>{label}</span>
            <div style={{ flex:1, height:8, borderRadius:999, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
              <div style={{ height:'100%', borderRadius:999, background:color, width:`${(count/issues.length)*100}%`, transition:'width 0.4s' }}/>
            </div>
            <span style={{ fontSize:13, color:color, fontFamily:'monospace', fontWeight:700, width:24, textAlign:'right', flexShrink:0 }}>{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
