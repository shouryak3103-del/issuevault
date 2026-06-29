'use client'
import { useEffect, useState } from 'react'
import PageWrapper from '@/components/PageWrapper'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts'
import { TrendingUp, TrendingDown, Minus, Clock, Target, Zap } from 'lucide-react'

const TT = (p: any) => <Tooltip {...p} contentStyle={{background:'#0d0d20',border:'1px solid rgba(157,0,255,0.3)',borderRadius:'8px',color:'#e2e8f0'}}/>
const COLORS = ['#ff2d78','#9d00ff','#00f5ff','#00ff94','#ffe600','#f97316']
const SEV_COLORS: any = { critical:'#ef4444', high:'#f97316', medium:'#ffe600', low:'#00f5ff' }
const STATUS_COLORS: any = { open:'#ff2d78', in_progress:'#ffe600', resolved:'#00ff94', closed:'#94a3b8', rejected:'#ef4444' }
const TYPE_COLORS: any = { bug:'#ff2d78', feature:'#9d00ff', task:'#00f5ff', enhancement:'#00ff94', security:'#ef4444' }

export default function Analytics() {
  const [data, setData] = useState<any>(null)
  const [range, setRange] = useState(30)

  useEffect(() => {
    fetch(`/api/analytics?days=${range}`).then(r=>r.json()).then(setData)
  }, [range])

  if (!data) return <PageWrapper title="Analytics" subtitle="Loading..."><div className="text-center py-20 text-slate-500">Crunching numbers...</div></PageWrapper>

  const statusData = Object.entries(data.statusCounts||{}).map(([k,v]) => ({ name:k, value:v as number, fill: STATUS_COLORS[k]||'#9d00ff' }))
  const sevData = Object.entries(data.severityCounts||{}).map(([k,v]) => ({ name:k, value:v as number, fill: SEV_COLORS[k]||'#9d00ff' }))
  const typeData = Object.entries(data.typeCounts||{}).map(([k,v]) => ({ name:k, value:v as number, fill: TYPE_COLORS[k]||'#9d00ff' }))
  const resolutionRate = data.total ? Math.round(((data.statusCounts?.resolved||0) + (data.statusCounts?.closed||0)) / data.total * 100) : 0
  const criticalPct = data.total ? Math.round((data.severityCounts?.critical||0) / data.total * 100) : 0

  return (
    <PageWrapper title="Analytics" subtitle="Deep insights into your issue data">
      {/* Range selector */}
      <div className="flex gap-2 mb-6">
        {[7,14,30,90].map(d => (
          <button key={d} onClick={() => setRange(d)} className={range === d ? 'btn-primary' : 'btn-secondary'} style={{padding:'6px 14px',fontSize:'13px'}}>
            {d}d
          </button>
        ))}
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label:'Total Issues', value: data.total||0, icon: Target, color:'pink', delta: data.trend?.length > 1 ? (data.trend?.slice(-1)[0]?.count > data.trend?.slice(-2,-1)[0]?.count ? 'up' : 'down') : 'flat' },
          { label:'Resolution Rate', value: resolutionRate+'%', icon: TrendingUp, color:'green', delta:'up' },
          { label:'Critical Issues', value: data.severityCounts?.critical||0, icon: Zap, color:'pink', delta: criticalPct > 20 ? 'down' : 'up' },
          { label:'Avg Actions/Issue', value: data.avgActions||'0', icon: Clock, color:'cyan', delta:'flat' },
        ].map(({ label, value, icon: Icon, color, delta }) => (
          <div key={label} className={`stat-card ${color}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
              <Icon size={14} color="#475569"/>
            </div>
            <div className="text-3xl font-bold text-white font-mono">{value}</div>
            <div className="flex items-center gap-1 mt-2">
              {delta === 'up' && <TrendingUp size={11} color="#00ff94"/>}
              {delta === 'down' && <TrendingDown size={11} color="#ef4444"/>}
              {delta === 'flat' && <Minus size={11} color="#475569"/>}
              <span className="text-xs" style={{color: delta==='up'?'#00ff94':delta==='down'?'#ef4444':'#475569'}}>
                {delta === 'flat' ? 'No change' : `Trending ${delta}`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Trend chart */}
      <div className="card mb-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2"><TrendingUp size={14} color="#9d00ff"/> Issue Volume — Last {range} Days</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data.trend||[]}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9d00ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#9d00ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{fill:'#475569',fontSize:10}}/>
            <YAxis tick={{fill:'#475569',fontSize:10}} allowDecimals={false}/>
            <TT/>
            <Area type="monotone" dataKey="count" stroke="#9d00ff" strokeWidth={2} fill="url(#grad)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 3-col charts */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="card">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">By Status</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={statusData} dataKey="value" cx="50%" cy="50%" outerRadius={60} innerRadius={30}>
                {statusData.map((e,i)=><Cell key={i} fill={e.fill}/>)}
              </Pie>
              <TT/>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-3">
            {statusData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{background:d.fill}}></span>
                  <span className="text-slate-400">{d.name.replace('_',' ')}</span>
                </div>
                <span className="text-slate-300 font-mono">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">By Severity</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={sevData} layout="vertical">
              <XAxis type="number" tick={{fill:'#475569',fontSize:10}} allowDecimals={false}/>
              <YAxis type="category" dataKey="name" tick={{fill:'#475569',fontSize:10}} width={55}/>
              <TT/>
              <Bar dataKey="value" radius={[0,4,4,0]}>{sevData.map((e,i)=><Cell key={i} fill={e.fill}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold text-slate-300 mb-4">By Type</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={typeData}>
              <XAxis dataKey="name" tick={{fill:'#475569',fontSize:9}}/>
              <YAxis tick={{fill:'#475569',fontSize:10}} allowDecimals={false}/>
              <TT/>
              <Bar dataKey="value" radius={[4,4,0,0]}>{typeData.map((e,i)=><Cell key={i} fill={e.fill}/>)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top reporters */}
      <div className="card">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Top Reporters</h3>
        <div className="space-y-3">
          {(data.topReporters||[]).map((r: any, i: number) => (
            <div key={r.reporter} className="flex items-center gap-3">
              <span className="text-xs text-slate-500 w-4">{i+1}</span>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{background:'linear-gradient(135deg,#9d00ff,#ff2d78)',color:'white'}}>
                {r.reporter?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-slate-300 flex-1">{r.reporter}</span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 rounded-full" style={{width:`${Math.min(r.count / (data.topReporters?.[0]?.count||1) * 100, 100)}px`, background:'linear-gradient(90deg,#9d00ff,#ff2d78)'}}></div>
                <span className="text-xs text-slate-400 font-mono">{r.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}
