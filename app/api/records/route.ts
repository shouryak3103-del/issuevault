import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
const sb = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth:{persistSession:false} })

export async function GET(req: NextRequest) {
  const supabase = sb()
  const s = new URL(req.url).searchParams
  const upload_id = s.get('upload_id'), page = parseInt(s.get('page')||'1'), limit=50, offset=(page-1)*limit
  let q = supabase.from('records').select('*,upload:upload_id(filename)',{count:'exact'}).order('created_at',{ascending:false}).range(offset,offset+limit-1)
  if(upload_id&&upload_id!=='all') q=q.eq('upload_id',upload_id)
  const {data,error,count}=await q
  if(error) return NextResponse.json({error:error.message},{status:400})
  return NextResponse.json({data,count,page,totalPages:Math.ceil((count||0)/limit)})
}
