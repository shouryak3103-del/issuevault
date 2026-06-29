export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

export async function GET() {
  const supabase = sb()
  const { data, error } = await supabase
    .from('integrations')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const supabase = sb()
  const body = await req.json()
  // Never store raw secrets — mask them
  const payload = {
    ...body,
    config: body.config || {},
    status: 'active',
    connected_at: new Date().toISOString(),
  }
  const { data, error } = await supabase.from('integrations').insert(payload).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

export async function PUT(req: NextRequest) {
  const supabase = sb()
  const { id, ...updates } = await req.json()
  const { data, error } = await supabase.from('integrations').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

export async function DELETE(req: NextRequest) {
  const supabase = sb()
  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  const { error } = await supabase.from('integrations').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
