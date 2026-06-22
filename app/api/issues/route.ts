import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth:{persistSession:false} })

async function audit(supabase: any, table: string, id: string, action: string, old: any, neu: any) {
  await supabase.from('audit_log').insert({ table_name:table, record_id:id, action, performed_by:'admin', old_data:old, new_data:neu })
}

export async function GET(req: NextRequest) {
  const s = new URL(req.url).searchParams
  const supabase = sb()
  let q = supabase.from('issues').select('*').order('created_at',{ascending:false})
  const status=s.get('status'), severity=s.get('severity'), type=s.get('issue_type'), search=s.get('search')
  if(status&&status!=='all') q=q.eq('status',status)
  if(severity&&severity!=='all') q=q.eq('severity',severity)
  if(type&&type!=='all') q=q.eq('issue_type',type)
  if(search) q=q.ilike('title',`%${search}%`)
  const {data,error}=await q
  if(error) return NextResponse.json({error:error.message},{status:400})
  return NextResponse.json({data,count:data?.length||0})
}

export async function POST(req: NextRequest) {
  const supabase = sb()
  const body = await req.json()
  const {data,error}=await supabase.from('issues').insert(body).select().single()
  if(error) return NextResponse.json({error:error.message},{status:400})
  await audit(supabase,'issues',data.id,'CREATE',null,data)
  return NextResponse.json({data})
}

export async function PUT(req: NextRequest) {
  const supabase = sb()
  const {id,...updates}=await req.json()
  const {data:old}=await supabase.from('issues').select('*').eq('id',id).single()
  const {data,error}=await supabase.from('issues').update(updates).eq('id',id).select().single()
  if(error) return NextResponse.json({error:error.message},{status:400})
  await audit(supabase,'issues',id,'UPDATE',old,data)
  return NextResponse.json({data})
}

export async function DELETE(req: NextRequest) {
  const supabase = sb()
  const id=new URL(req.url).searchParams.get('id')
  if(!id) return NextResponse.json({error:'ID required'},{status:400})
  const {data:old}=await supabase.from('issues').select('*').eq('id',id).single()
  const {error}=await supabase.from('issues').delete().eq('id',id)
  if(error) return NextResponse.json({error:error.message},{status:400})
  await audit(supabase,'issues',id,'DELETE',old,null)
  return NextResponse.json({success:true})
}
