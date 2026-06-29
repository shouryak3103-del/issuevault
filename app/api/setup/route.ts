export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
const sb = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth:{persistSession:false} })

export async function GET() {
  const supabase = sb()
  const tables = ['issues','issue_actions','uploads','records','audit_log','team_members','notifications']
  const results = await Promise.all(tables.map(async t => {
    const { error } = await supabase.from(t).select('id').limit(1)
    return { table:t, status: error ? 'missing' : 'exists' }
  }))
  return NextResponse.json({ results })
}
