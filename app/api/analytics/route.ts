export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
const sb = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth:{persistSession:false} })

export async function GET(req: NextRequest) {
  const supabase = sb()
  const days = parseInt(new URL(req.url).searchParams.get('days')||'30')
  const since = new Date(Date.now() - days * 86400000).toISOString()

  const [issues, actions] = await Promise.all([
    supabase.from('issues').select('id,status,severity,issue_type,reporter,created_at').gte('created_at', since),
    supabase.from('issue_actions').select('id,issue_id,action_type,created_at').gte('created_at', since),
  ])

  const data = issues.data || []
  const sc = data.reduce((a:any,i:any) => { a[i.status]=(a[i.status]||0)+1; return a }, {})
  const sevc = data.reduce((a:any,i:any) => { a[i.severity]=(a[i.severity]||0)+1; return a }, {})
  const tc = data.reduce((a:any,i:any) => { a[i.issue_type]=(a[i.issue_type]||0)+1; return a }, {})

  // Reporter counts
  const rc: any = {}
  data.forEach((i:any) => { if(i.reporter) rc[i.reporter]=(rc[i.reporter]||0)+1 })
  const topReporters = Object.entries(rc).map(([reporter,count])=>({reporter,count})).sort((a:any,b:any)=>b.count-a.count).slice(0,5)

  // Daily trend
  const trend = Array.from({length: Math.min(days,30)}, (_,i) => {
    const d = new Date(Date.now() - (Math.min(days,30)-1-i)*86400000)
    const ds = d.toISOString().split('T')[0]
    return { date: ds.slice(5), count: data.filter((x:any)=>x.created_at?.startsWith(ds)).length }
  })

  // Avg actions per issue
  const actionData = actions.data || []
  const issueIds = [...new Set(actionData.map((a:any)=>a.issue_id))]
  const avgActions = issueIds.length ? (actionData.length / issueIds.length).toFixed(1) : '0'

  return NextResponse.json({ total:data.length, statusCounts:sc, severityCounts:sevc, typeCounts:tc, topReporters, trend, avgActions })
}
