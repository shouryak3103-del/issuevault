'use client'
import { useEffect, useState } from 'react'
import PageWrapper from '@/components/PageWrapper'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Bug, Zap, Upload, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react'

const SCOLS = ['#ff2d78','#ffe600','#00ff94','#94a3b8','#ef4444']
const TCOLS: any = { bug:'#ff2d78', feature:'#9d00ff', task:'#00f5ff', enhancement:'#00ff94', security:'#ef4444' }
const SEVCOLS: any = { critical:'#ef4444', high:'#f97316', medium:'#ffe600', low:'#00f5ff' }

const TT = ({ contentStyle, ...p }: any) => <Tooltip {...p} contentStyle={{ background:'#0d0d20', border:'1px solid rgba(157,0,255,0.3)', borderRadius:'8px', color:'#e2e8f0', ...contentStyle }} />

export default function Dashboard() {
  const [s, setS] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard').then(r=>r.json()).then(d=>{setS(d);setLoading(false)}).catch(()=>setLoading(false))
  }, [])

  if (loading) return (
    <PageWrapper title="Dashboard" subtitle="Loading live data...">
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'300px'}}>
        <span style={{color:'#9d00ff',fontFamily:'monospace',animation:'pulse 1s infinite'}}>Fetching from Supabase...</span>
      </div>
    </PageWrapper>
  )

  const t = s?.totals || {}
  const statusData = Object.entries(s?.statusCounts||{}).map(([k,v])=>({name:k,value:v as number}))
  const sevData = Object.entries(s?.severityCounts||{}).map(([k,v])=>({name:k,value:v as number,fill:SEVCOLS[k]||'#9d00ff'}))
  const typeData = Object.entries(s?.typeCounts||{}).map(([k,v])=>({name:k,value:v as number,fill:TCOLS[k]||'#9d00ff'}))

  const statCards = [
    { label:'Total Issues', value:t.issues||0, icon:Bug, color:'pink', sub:'all time' },
    { label:'Open', value:t.open||0, icon:AlertTriangle, color:'yellow', sub:'needs attention' },
    { label:'In Progress', value:t.in_progress||0, icon:Clock, color:'cyan', sub:'being worked on' },
    { label:'Resolved', value:t.resolved||0, icon:CheckCircle, color:'green', sub:'completed' },
    { label:'Critical', value:t.critical||0, icon:AlertTriangle, color:'pink', sub:'urgent priority' },
    { label:'Actions', value:t.actions||0, icon:Zap, color:'purple', sub:'total logged' },
    { label:'Uploads', value:t.uploads||0, icon:Upload, color:'cyan', sub:'CSV datasets' },
    { label:'Trend', value:s?.trend?.reduce((a:number,b:any)=>a+b.count,0)||0, icon:TrendingUp, color:'green', sub:'last 7 days' },
  ]

  return (
    <PageWrapper title="Dashboard" subtitle="Live metrics — all data from Supabase">
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'16px',marginBottom:'32px'}}>
        {statCards.map(({label,value,icon:Icon,color,sub})=>(
          <div key={label} className={`stat-card ${color}`}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
              <span style={{color:'#64748b',fontSize:'11px',textTransform:'uppercase',letterSpacing:'0.8px'}}>{label}</span>
              <Icon size={15} color="#475569"/>
            </div>
            <div style={{fontSize:'32px',fontWeight:'bold',color:'white',fontFamily:'monospace'}}>{value}</div>
            <div style={{fontSize:'11px',color:'#475569',marginTop:'4px'}}>{sub}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:'24px',marginBottom:'24px'}}>
        <div className="card">
          <h3 style={{fontSize:'13px',fontWeight:'600',color:'#cbd5e1',marginBottom:'16px',display:'flex',alignItems:'center',gap:'8px'}}>
            <TrendingUp size={14} color="#9d00ff"/> Issues Created — Last 7 Days
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={s?.trend||[]}>
              <XAxis dataKey="date" tick={{fill:'#475569',fontSize:11}}/>
              <YAxis tick={{fill:'#475569',fontSize:11}} allowDecimals={false}/>
              <TT/>
              <Line type="monotone" dataKey="count" stroke="#9d00ff" strokeWidth={2} dot={{fill:'#9d00ff',r:4}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 style={{fontSize:'13px',fontWeight:'600',color:'#cbd5e1',marginBottom:'16px'}}>Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65}>
                {statusData.map((_,i)=><Cell key={i} fill={SCOLS[i%5]}/>)}
              </Pie>
              <TT/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px',marginBottom:'24px'}}>
        <div className="card">
          <h3 style={{fontSize:'13px',fontWeight:'600',color:'#cbd5e1',marginBottom:'16px'}}>By Severity</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={sevData}>
              <XAxis dataKey="name" tick={{fill:'#475569',fontSize:11}}/><YAxis tick={{fill:'#475569',fontSize:11}} allowDecimals={false}/>
              <TT/><Bar dataKey="value" radius={[4,4,0,0]}>{sevData.map((e,i)=><Cell key={i} fill={e.fill}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 style={{fontSize:'13px',fontWeight:'600',color:'#cbd5e1',marginBottom:'16px'}}>By Type</h3>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={typeData}>
              <XAxis dataKey="name" tick={{fill:'#475569',fontSize:11}}/><YAxis tick={{fill:'#475569',fontSize:11}} allowDecimals={false}/>
              <TT/><Bar dataKey="value" radius={[4,4,0,0]}>{typeData.map((e,i)=><Cell key={i} fill={e.fill}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 style={{fontSize:'13px',fontWeight:'600',color:'#cbd5e1',marginBottom:'16px'}}>Recent Activity</h3>
        {!s?.recentAudit?.length ? (
          <p style={{color:'#475569',fontSize:'13px',textAlign:'center',padding:'24px 0'}}>No activity yet — create issues and take actions to see logs here.</p>
        ) : (s?.recentAudit||[]).map((log:any)=>(
          <div key={log.id} style={{display:'flex',alignItems:'center',gap:'12px',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
            <span className="badge badge-feature">{log.table_name}</span>
            <span style={{fontSize:'13px',color:'#cbd5e1'}}>{log.action}</span>
            <span style={{fontSize:'11px',color:'#475569',marginLeft:'auto'}}>{new Date(log.created_at).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}
