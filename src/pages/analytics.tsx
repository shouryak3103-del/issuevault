import PageWrapper from '@/components/PageWrapper'
import { TrendingUp, TrendingDown } from 'lucide-react'

const WEEKLY = [{day:'Mon',found:45,fixed:28},{day:'Tue',found:38,fixed:34},{day:'Wed',found:61,fixed:52},{day:'Thu',found:33,fixed:41},{day:'Fri',found:42,fixed:38},{day:'Sat',found:18,fixed:22},{day:'Sun',found:12,fixed:15}]
const MAX = Math.max(...WEEKLY.flatMap(d=>[d.found,d.fixed]))

export default function AnalyticsPage() {
  return (
    <PageWrapper title="Analytics" subtitle="7-day data quality overview">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:14, marginBottom:24 }}>
        {[
          {label:'Total records',value:'12,480',delta:'+10.4%',up:true, color:'#00f5ff'},
          {label:'Issues found', value:'342',    delta:'-8.1%', up:false,color:'#ff2d78'},
          {label:'Fixed (7 days)',value:'230',    delta:'+18%',  up:true, color:'#00ff94'},
          {label:'Clean score',  value:'94.2%',  delta:'+1.2pt',up:true, color:'#9d00ff'},
        ].map(({label,value,delta,up,color})=>(
          <div key={label} style={{ padding:20, borderRadius:12, background:`${color}08`, border:`1px solid ${color}20` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <p style={{ fontSize:11, color:'#475569', margin:0, textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:600 }}>{label}</p>
              <span style={{ fontSize:11, padding:'2px 7px', borderRadius:999, display:'flex', alignItems:'center', gap:3, background:up?'rgba(0,255,148,0.1)':'rgba(239,68,68,0.1)', color:up?'#00ff94':'#ef4444', fontWeight:600 }}>
                {up?<TrendingUp size={10}/>:<TrendingDown size={10}/>}{delta}
              </span>
            </div>
            <p style={{ fontSize:26, fontWeight:800, color:'white', fontFamily:'"Syne",monospace', margin:0 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{ padding:24, borderRadius:14, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>
        <h3 style={{ fontSize:15, fontWeight:700, color:'white', marginBottom:4 }}>Weekly activity</h3>
        <p style={{ fontSize:12, color:'#475569', marginBottom:20 }}>Issues found vs fixed per day</p>
        <div style={{ display:'flex', alignItems:'flex-end', gap:10, height:120 }}>
          {WEEKLY.map(d=>(
            <div key={d.day} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
              <div style={{ width:'100%', display:'flex', gap:2, alignItems:'flex-end', height:100 }}>
                <div style={{ flex:1, borderRadius:'3px 3px 0 0', background:'rgba(255,45,120,0.45)', height:`${(d.found/MAX)*100}%`, minHeight:4 }}/>
                <div style={{ flex:1, borderRadius:'3px 3px 0 0', background:'#00ff94', height:`${(d.fixed/MAX)*100}%`, minHeight:4 }}/>
              </div>
              <span style={{ fontSize:10, color:'#475569', fontWeight:600 }}>{d.day}</span>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:16, marginTop:12 }}>
          <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#64748b' }}><span style={{ width:10, height:10, borderRadius:2, background:'rgba(255,45,120,0.45)', display:'inline-block' }}/>Found</span>
          <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#64748b' }}><span style={{ width:10, height:10, borderRadius:2, background:'#00ff94', display:'inline-block' }}/>Fixed</span>
        </div>
      </div>
    </PageWrapper>
  )
}
