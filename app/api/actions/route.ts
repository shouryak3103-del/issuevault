import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
const sb = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth:{persistSession:false} })
const STATUS_MAP: Record<string,string> = { approve:'in_progress', reject:'rejected', fix:'resolved', reopen:'open', close:'closed' }

export async function GET(req: NextRequest) {
  const supabase = sb()
  const issue_id = new URL(req.url).searchParams.get('issue_id')
  let q = supabase.from('issue_actions').select('*, issue:issue_id(id,title,status,severity,issue_type)').order('created_at',{ascending:false})
  if(issue_id) q = q.eq('issue_id',issue_id)
  const {data,error} = await q
  if(error) return NextResponse.json({error:error.message},{status:400})
  return NextResponse.json({data})
}

export async function POST(req: NextRequest) {
  const supabase = sb()
  const {issue_id,action_type,notes,performed_by='admin'} = await req.json()
  const {data:issue} = await supabase.from('issues').select('*').eq('id',issue_id).single()
  if(!issue) return NextResponse.json({error:'Issue not found'},{status:404})
  const new_status = STATUS_MAP[action_type] || issue.status
  const old_status = issue.status
  const {data:action,error} = await supabase.from('issue_actions').insert({ issue_id,action_type,performed_by,notes,old_status,new_status }).select().single()
  if(error) return NextResponse.json({error:error.message},{status:400})
  if(new_status !== old_status) await supabase.from('issues').update({status:new_status}).eq('id',issue_id)
  await supabase.from('audit_log').insert({ table_name:'issues',record_id:issue_id,action:`ACTION:${action_type.toUpperCase()}`,performed_by,old_data:{status:old_status},new_data:{status:new_status,notes} })
  return NextResponse.json({data:action})
}
