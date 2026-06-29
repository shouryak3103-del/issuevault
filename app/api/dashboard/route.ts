export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth:{persistSession:false} })

export async function GET() {
  const supabase = sb()
  const [issues, actions, uploads, audit] = await Promise.all([
    supabase.from('issues').select('id,status,severity,issue_type,created_at'),
    supabase.from('issue_actions').select('id,action_type,created_at'),
    supabase.from('uploads').select('id,filename,row_count,status,created_at'),
    supabase.from('audit_log').select('id,action,table_name,created_at').order('created_at',{ascending:false}).limit(10),
  ])
  const data = issues.data || []
  const sc = data.reduce((a:any,i:any)=>{a[i.status]=(a[i.status]||0)+1;return a},{})
  const sevc = data.reduce((a:any,i:any)=>{a[i.severity]=(a[i.severity]||0)+1;return a},{})
  const tc = data.reduce((a:any,i:any)=>{a[i.issue_type]=(a[i.issue_type]||0)+1;return a},{})
  const now = new Date()
  const trend = Array.from({length:7},(_,i)=>{
    const d = new Date(now); d.setDate(d.getDate()-(6-i))
    const ds = d.toISOString().split('T')[0]
    return { date: ds.slice(5), count: data.filter((x:any)=>x.created_at?.startsWith(ds)).length }
  })
  return NextResponse.json({
    totals:{ issues:data.length, open:sc.open||0, in_progress:sc.in_progress||0, resolved:sc.resolved||0, critical:sevc.critical||0, actions:actions.data?.length||0, uploads:uploads.data?.length||0 },
    statusCounts:sc, severityCounts:sevc, typeCounts:tc, trend,
    recentAudit: audit.data||[]
  })
}
