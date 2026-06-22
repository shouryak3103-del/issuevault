import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } })

export async function GET() {
  const supabase = sb()
  const tables = ['issues','issue_actions','uploads','records','audit_log']
  const results = await Promise.all(tables.map(async t => {
    const { error } = await supabase.from(t).select('id').limit(1)
    return { table: t, status: error ? 'missing' : 'exists' }
  }))
  return NextResponse.json({ results })
}

export async function POST() {
  const supabase = sb()
  const { data } = await supabase.from('issues').select('id').limit(1)
  if (data && data.length === 0) {
    await supabase.from('issues').insert([
      { title:'Login page 500 error on wrong password', description:'Users get server error instead of invalid credentials', issue_type:'bug', severity:'high', status:'open', reporter:'shourya' },
      { title:'Add dark mode toggle', description:'Users want ability to switch themes', issue_type:'feature', severity:'low', status:'open', reporter:'shourya' },
      { title:'SQL injection in search endpoint', description:'Search does not sanitize user input', issue_type:'security', severity:'critical', status:'in_progress', reporter:'system' },
      { title:'Dashboard query too slow', description:'Loads slow for accounts with 10k+ records', issue_type:'enhancement', severity:'medium', status:'open', reporter:'shourya' },
      { title:'Update user profile flow', description:'Allow avatar and bio update in one step', issue_type:'task', severity:'low', status:'resolved', reporter:'shourya' },
    ])
    return NextResponse.json({ seeded: true })
  }
  return NextResponse.json({ seeded: false })
}
