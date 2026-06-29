export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
const sb = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth:{persistSession:false} })

export async function GET() {
  const supabase = sb()
  const {data,error} = await supabase.from('uploads').select('*').order('created_at',{ascending:false})
  if(error) return NextResponse.json({error:error.message},{status:400})
  return NextResponse.json({data})
}

export async function POST(req: NextRequest) {
  const supabase = sb()
  const {filename,rows,uploaded_by='admin'} = await req.json()
  const {data:upload,error} = await supabase.from('uploads').insert({filename,row_count:rows.length,status:'processing',uploaded_by}).select().single()
  if(error) return NextResponse.json({error:error.message},{status:400})
  const BATCH = 100
  for(let i=0;i<rows.length;i+=BATCH) {
    await supabase.from('records').insert(rows.slice(i,i+BATCH).map((r:any)=>({upload_id:upload.id,data:r})))
  }
  await supabase.from('uploads').update({status:'complete'}).eq('id',upload.id)
  await supabase.from('audit_log').insert({ table_name:'uploads',record_id:upload.id,action:'CSV_UPLOAD',performed_by:uploaded_by,new_data:{filename,row_count:rows.length} })
  return NextResponse.json({data:{...upload,status:'complete',row_count:rows.length}})
}
