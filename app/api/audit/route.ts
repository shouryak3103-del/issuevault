import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
const sb = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth:{persistSession:false} })

export async function GET(req: NextRequest) {
  const supabase = sb()
  const s = new URL(req.url).searchParams
  const table=s.get('table'), page=parseInt(s.get('page')||'1'), limit=50, offset=(page-1)*limit
  let q = supabase.from('audit_log').select('*',{count:'exact'}).order('created_at',{ascending:false}).range(offset,offset+limit-1)
  if(table&&table!=='all') q=q.eq('table_name',table)
  const {data,error,count}=await q
  if(error) return NextResponse.json({error:error.message},{status:400})
  return NextResponse.json({data,count,page,totalPages:Math.ceil((count||0)/limit)})
}
