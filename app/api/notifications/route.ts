export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
const sb = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth:{persistSession:false} })

export async function GET() {
  const supabase = sb()
  const { data, error } = await supabase.from('notifications').select('*').order('created_at',{ascending:false}).limit(50)
  if(error) return NextResponse.json({error:error.message},{status:400})
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const supabase = sb()
  const body = await req.json()
  const { data, error } = await supabase.from('notifications').insert(body).select().single()
  if(error) return NextResponse.json({error:error.message},{status:400})
  return NextResponse.json({ data })
}

export async function PUT(req: NextRequest) {
  const supabase = sb()
  const body = await req.json()
  if(body.all) {
    await supabase.from('notifications').update({read:true}).eq('read',false)
  } else {
    await supabase.from('notifications').update({read:body.read}).eq('id',body.id)
  }
  return NextResponse.json({ success:true })
}

export async function DELETE(req: NextRequest) {
  const supabase = sb()
  const id = new URL(req.url).searchParams.get('id')
  if(!id) return NextResponse.json({error:'ID required'},{status:400})
  await supabase.from('notifications').delete().eq('id',id)
  return NextResponse.json({ success:true })
}
