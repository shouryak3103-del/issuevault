'use client'
import { useEffect, useState } from 'react'
import PageWrapper from '@/components/PageWrapper'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { Bug, Zap, Upload, AlertTriangle, CheckCircle, Clock, TrendingUp, ArrowRight, Activity } from 'lucide-react'
import Link from 'next/link'

const SCOLS: Record<string,string> = { open:'#ff2d78', in_progress:'#ffe600', resolved:'#00ff94', closed:'#94a3b8', rejected:'#ef4444' }
const TCOLS: Record<string,string> = { bug:'#ff2d78', feature:'#9d00ff', task:'#00f5ff', enhancement:'#00ff94', security:'#ef4444' }
const SEVCOLS: Record<string,string> = { critical:'#ef4444', high:'#f97316', medium:'#ffe600', low:'#00f5ff' }

const TT = (p: any) => <Tooltip {...p} contentStyle={{ background:'#0d0d20', border:'1px solid rgba(157,0,255,0.3)', borderRadius:'8px', color:'#e2e8f0', fontSize:'12px' }}/>

export default function Dashboard() {
  const [s, setS] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard').then(r=>r.json()).then(d=>{setS(d);setLoading(false)}).catch(()=>setLoading(false))
  }, [])

  if (loading) return (
    <PageWrapper title="Dashboard" subtitle="Loading live data...">
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'24px'}}>
        {Array.from({length:8}).map((_,i) => (
          <div key={i} className="stat-card" style={{height:'96px',background:'rgba(255,255,255,0.03)',animation:'pulse 1.5s infinite'}}/>
        ))}
      </div>
    </PageWrapper>
  )

  const t = s?.totals || {}
  const statusData = Object.entries(s?.statusCounts||{}).map(([k,v])=>({name:k, value:v as number, fill: SCOLS[k]||'#9d00ff'}))
  const sevData = Object.entries(s?.severityCounts||{}).map(([k,v])=>({name:k, value:v as number, fill: SEVCOLS[k]||'#9d00ff'}))
  const typeData = Object.entries(s?.typeCounts||{}).map(([k,v])=>({name:k, value:v as number, fill: TCOLS[k]||'#9d00ff'}))

  const statCards = [
    { label:'Total Issues', value:t.issues||0, icon:Bug, color:'pink', href:'/issues', sub:`${t.open||0} open` },
    { label:'In Progress', value:t.in_progress||0, icon:Clock, color:'yellow', href:'/issues', sub:'actively worked on' },
    { label:'Resolved', value:t.resolved||0, icon:CheckCircle, color:'green', href:'/issues', sub:'closed & done' },
    { label:'Critical', value:t.critical||0, icon:AlertTriangle, color:'pink', href:'/issues', sub:'urgent priority' },
    { label:'Actions Logged', value:t.actions||0, icon:Zap, color:'purple', href:'/actions', sub:'total taken' },
    { label:'CSV Uploads', value:t.uploads||0, icon:Upload, color:'cyan', href:'/upload', sub:'datasets imported' },
    { label:'7-Day New', value:s?.trend?.reduce((a:number,b:any)=>a+b.count,0)||0, icon:TrendingUp, color:'green', href:'/analytics', sub:'recent activity' },
    { label:'Audit Entries', value:t.audit||0, icon:Activity, color:'cyan', href:'/audit', sub:'changes tracked' },
  ]

  return (
    <PageWrapper title="Dashboard" subtitle="Live metrics from Supabase">

      {/* KPI Grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'28px'}}>
        {statCards.map(({label,value,icon:Icon,color,href,sub})=>(
          <Link key={label} href={href} className={`stat-card ${color} card-hover`} style={{textDecoration:'none',display:'block'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
              <span style={{color:'#64748b',fontSize:'11px',textTransform:'uppercase',letterSpacing:'0.8px',fontWeight:600}}>{label}</span>
              <Icon size={14} color="#334155"/>
            </div>
            <div style={{fontSize:'34px',fontWeight:'800',color:'white',fontFamily:'Space Mono, monospace',lineHeight:1}}>{value}</div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'8px'}}>
              <span style={{fontSize:'11px',color:'#475569'}}>{sub}</span>
              <ArrowRight size={11} color="#334155"/>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts row 1 */}
      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'20px',marginBottom:'20px'}}>
        <div className="card">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px'}}>
            <h3 style={{fontSize:'13px',fontWeight:'600',color:'#cbd5e1',display:'flex',alignItems:'center',gap:'8px',margin:0}}>
              <TrendingUp size={14} color="#9d00ff"/> 7-Day Issue Trend
            </h3>
            <Link href="/analytics" style={{fontSize:'11px',color:'#9d00ff',textDecoration:'none'}}>Full analytics →</Link>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={s?.trend||[]}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9d00ff" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#9d00ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{fill:'#475569',fontSize:11}}/>
              <YAxis tick={{fill:'#475569',fontSize:11}} allowDecimals={false}/>
              <TT/>
              <Area type="monotone" dataKey="count" stroke="#9d00ff" strokeWidth={2} fill="url(#areaGrad)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{fontSize:'13px',fontWeight:'600',color:'#cbd5e1',marginBottom:'16px'}}>Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={statusData} dataKey="value" cx="50%" cy="50%" outerRadius={58} innerRadius={28}>
                {statusData.map((e,i)=><Cell key={i} fill={e.fill}/>)}
              </Pie>
              <TT/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:'flex',flexDirection:'column',gap:'5px',marginTop:'8px'}}>
            {statusData.map(d=>(
              <div key={d.name} style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                  <span style={{width:'7px',height:'7px',borderRadius:'50%',background:d.fill,display:'inline-block'}}></span>
                  <span style={{fontSize:'11px',color:'#64748b',textTransform:'capitalize'}}>{d.name.replace('_',' ')}</span>
                </div>
                <span style={{fontSize:'11px',color:'#94a3b8',fontFamily:'monospace'}}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px',marginBottom:'20px'}}>
        <div className="card">
          <h3 style={{fontSize:'13px',fontWeight:'600',color:'#cbd5e1',marginBottom:'16px'}}>Issues by Severity</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={sevData} layout="vertical">
              <XAxis type="number" tick={{fill:'#475569',fontSize:11}} allowDecimals={false}/>
              <YAxis type="category" dataKey="name" tick={{fill:'#475569',fontSize:11}} width={55}/>
              <TT/>
              <Bar dataKey="value" radius={[0,4,4,0]} barSize={14}>
                {sevData.map((e,i)=><Cell key={i} fill={e.fill}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{fontSize:'13px',fontWeight:'600',color:'#cbd5e1',marginBottom:'16px'}}>Issues by Type</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={typeData}>
              <XAxis dataKey="name" tick={{fill:'#475569',fontSize:10}}/>
              <YAxis tick={{fill:'#475569',fontSize:11}} allowDecimals={false}/>
              <TT/>
              <Bar dataKey="value" radius={[4,4,0,0]} barSize={22}>
                {typeData.map((e,i)=><Cell key={i} fill={e.fill}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px'}}>
          <h3 style={{fontSize:'13px',fontWeight:'600',color:'#cbd5e1',margin:0,display:'flex',alignItems:'center',gap:'8px'}}>
            <Activity size={14} color="#9d00ff"/> Recent Activity
          </h3>
          <Link href="/audit" style={{fontSize:'11px',color:'#9d00ff',textDecoration:'none'}}>View all →</Link>
        </div>
        {!s?.recentAudit?.length ? (
          <div style={{textAlign:'center',padding:'32px 0'}}>
            <p style={{color:'#334155',fontSize:'13px'}}>No activity yet — create issues and take actions to see logs here.</p>
          </div>
        ) : (
          <div>
            {(s?.recentAudit||[]).slice(0,8).map((log:any)=>(
              <div key={log.id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                <span className={`badge badge-${log.table_name==='issues'?'bug':'feature'}`} style={{flexShrink:0,fontSize:'10px'}}>{log.table_name}</span>
                <span style={{fontSize:'13px',color:'#94a3b8',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{log.action}</span>
                <span style={{fontSize:'11px',color:'#334155',flexShrink:0}}>{new Date(log.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
