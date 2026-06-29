import { useEffect, useState } from 'react'
import PageWrapper from '@/components/PageWrapper'
import { Link } from 'react-router-dom'
import { Bug, Zap, CheckCircle, Clock, TrendingUp, ArrowRight, AlertTriangle, Upload, BarChart3 } from 'lucide-react'

const C = { '#ff2d78':true, '#ffe600':true, '#00ff94':true, '#00f5ff':true }
const SEV: Record<string,string> = { critical:'#ef4444', high:'#f97316', medium:'#ffe600', low:'#00f5ff' }
const STATUS: Record<string,string> = { open:'#ff2d78', in_progress:'#ffe600', resolved:'#00ff94', closed:'#475569' }
const BARS = [35,60,42,78,55,88,44,70,92,65,50,85]
const MAX = Math.max(...BARS)

const mock = {
  totalIssues:248, openIssues:142, criticalIssues:8, resolvedToday:34,
  recentIssues:[
    {id:'ISS-042',title:'Login button unresponsive on Safari',severity:'critical',status:'open',assignee:'SC'},
    {id:'ISS-041',title:'Memory leak in analytics worker',severity:'high',status:'in_progress',assignee:'MR'},
    {id:'ISS-040',title:'CSV upload silently drops last row',severity:'medium',status:'open',assignee:'DK'},
    {id:'ISS-039',title:'Audit timestamps in wrong timezone',severity:'low',status:'resolved',assignee:'PS'},
    {id:'ISS-038',title:'n8n webhook 403 on second trigger',severity:'high',status:'open',assignee:'LB'},
  ]
}

export default function Dashboard() {
  const [data] = useState(mock)
  return (
    <PageWrapper title="Dashboard" subtitle="Live overview of your issues and team activity">
      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:24 }}>
        {[
          {icon:Bug,          label:'Total Issues',    value:data.totalIssues, delta:'+12',  color:'#ff2d78'},
          {icon:AlertTriangle,label:'Open',            value:data.openIssues,  delta:'+5',   color:'#ffe600'},
          {icon:Zap,          label:'Critical',        value:data.criticalIssues,delta:'-3', color:'#ef4444'},
          {icon:CheckCircle,  label:'Resolved today',  value:data.resolvedToday, delta:'+28%',color:'#00ff94'},
        ].map(({icon:Icon,label,value,delta,color}) => (
          <div key={label} style={{ padding:20, borderRadius:14, background:`${color}08`, border:`1px solid ${color}22` }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <div style={{ width:38, height:38, borderRadius:10, background:`${color}18`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon size={17} color={color}/>
              </div>
              <span style={{ fontSize:11, padding:'3px 8px', borderRadius:999, background:delta.startsWith('-')?'rgba(239,68,68,0.12)':'rgba(0,255,148,0.1)', color:delta.startsWith('-')?'#ef4444':'#00ff94', fontWeight:600 }}>{delta}</span>
            </div>
            <div style={{ fontSize:28, fontWeight:800, color:'white', fontFamily:'"Syne",monospace', lineHeight:1 }}>{value}</div>
            <div style={{ fontSize:12, color:'#475569', marginTop:4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Chart + Issues */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:16, marginBottom:24 }}>
        {/* Trend chart */}
        <div style={{ padding:20, borderRadius:14, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <div>
              <h3 style={{ fontSize:14, fontWeight:700, color:'white', margin:0 }}>Issue trend</h3>
              <p style={{ fontSize:11, color:'#475569', margin:0 }}>Last 12 days</p>
            </div>
            <span style={{ fontSize:11, padding:'3px 8px', borderRadius:999, background:'rgba(0,255,148,0.1)', color:'#00ff94', fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
              <TrendingUp size={11}/>–8%
            </span>
          </div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:4, height:80 }}>
            {BARS.map((h,i) => (
              <div key={i} style={{ flex:1, borderRadius:'3px 3px 0 0', background:i===11?'#9d00ff':'rgba(157,0,255,0.25)', height:`${(h/MAX)*100}%`, transition:'height 0.3s' }}/>
            ))}
          </div>
        </div>

        {/* Recent issues */}
        <div style={{ padding:20, borderRadius:14, background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:'white', margin:0 }}>Recent issues</h3>
            <Link to="/issues" style={{ fontSize:12, color:'#9d00ff', textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}>View all <ArrowRight size={12}/></Link>
          </div>
          {data.recentIssues.map(issue => (
            <div key={issue.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize:10, padding:'2px 7px', borderRadius:999, background:`${SEV[issue.severity]}18`, color:SEV[issue.severity], border:`1px solid ${SEV[issue.severity]}30`, fontWeight:700, flexShrink:0 }}>{issue.severity}</span>
              <span style={{ fontSize:13, color:'#cbd5e1', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{issue.title}</span>
              <span style={{ fontSize:10, padding:'2px 7px', borderRadius:999, background:`${STATUS[issue.status]}15`, color:STATUS[issue.status], flexShrink:0 }}>{issue.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        {[
          {to:'/issues/new',icon:Bug,  label:'New issue',      color:'#ff2d78'},
          {to:'/upload',    icon:Upload,label:'Upload CSV',    color:'#00f5ff'},
          {to:'/analytics', icon:BarChart3,label:'View analytics',color:'#9d00ff'},
        ].map(({to,icon:Icon,label,color}) => (
          <Link key={to} to={to} style={{ display:'flex', alignItems:'center', gap:12, padding:16, borderRadius:12, background:`${color}08`, border:`1px solid ${color}22`, textDecoration:'none', transition:'all 0.2s' }}>
            <Icon size={17} color={color}/><span style={{ fontSize:14, fontWeight:600, color:'#cbd5e1' }}>{label}</span><ArrowRight size={13} color="#334155" style={{ marginLeft:'auto' }}/>
          </Link>
        ))}
      </div>
    </PageWrapper>
  )
}
