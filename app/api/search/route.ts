export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
const sb = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth:{persistSession:false} })

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get('q')?.trim()
  if(!q) return NextResponse.json({ issues:[], actions:[], records:[], audit:[] })
  const supabase = sb()
  const [issues, actions, audit] = await Promise.all([
    supabase.from('issues').select('id,title,description,status,severity,issue_type').or(`title.ilike.%${q}%,description.ilike.%${q}%`).limit(10),
    supabase.from('issue_actions').select('id,action_type,notes,created_at').or(`action_type.ilike.%${q}%,notes.ilike.%${q}%`).limit(8),
    supabase.from('audit_log').select('id,action,table_name,created_at').ilike('action',`%${q}%`).limit(6),
  ])
  return NextResponse.json({ issues: issues.data||[], actions: actions.data||[], audit: audit.data||[] })
}
