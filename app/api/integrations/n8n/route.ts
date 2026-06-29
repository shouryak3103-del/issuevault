export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

// ── Trigger an n8n webhook workflow ────────────────────────────────────────
export async function POST(req: NextRequest) {
  const supabase = sb()
  const body = await req.json()
  const { action, issue_id, workflow_url, payload } = body

  if (!workflow_url) return NextResponse.json({ error: 'workflow_url is required' }, { status: 400 })

  // Build the event payload IssueVault sends to n8n
  let issueData: any = null
  if (issue_id) {
    const { data } = await supabase.from('issues').select('*').eq('id', issue_id).single()
    issueData = data
  }

  const eventPayload = {
    event: action || 'manual_trigger',
    source: 'issuevault',
    timestamp: new Date().toISOString(),
    issue: issueData,
    ...payload,
  }

  // Fire the n8n webhook
  const res = await fetch(workflow_url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventPayload),
  })

  const responseText = await res.text()
  let responseData: any = null
  try { responseData = JSON.parse(responseText) } catch { responseData = { raw: responseText } }

  // Log to audit
  await supabase.from('audit_log').insert({
    table_name: 'integrations',
    record_id: issue_id || 'n8n',
    action: `n8n workflow triggered: ${action || 'manual'} → ${workflow_url.split('/').pop()}`,
    performed_by: 'system',
    new_data: { status: res.status, response: responseData },
  })

  if (!res.ok) return NextResponse.json({ error: `n8n responded with ${res.status}`, detail: responseData }, { status: 502 })
  return NextResponse.json({ success: true, status: res.status, response: responseData })
}

// ── Receive inbound events FROM n8n (n8n calls IssueVault) ─────────────────
export async function PUT(req: NextRequest) {
  const supabase = sb()
  const body = await req.json()
  const { event_type, data: eventData, secret } = body

  // Optional secret verification
  const stored = (await supabase.from('integrations').select('config').eq('type', 'n8n').single()).data
  if (stored?.config?.inbound_secret && stored.config.inbound_secret !== secret) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  // Handle different event types from n8n
  if (event_type === 'create_issue' && eventData) {
    const { data, error } = await supabase.from('issues').insert({
      title: eventData.title || 'Issue from n8n',
      description: eventData.description || '',
      issue_type: eventData.issue_type || 'task',
      severity: eventData.severity || 'medium',
      status: eventData.status || 'open',
      reporter: eventData.reporter || 'n8n',
      assignee: eventData.assignee || '',
      source: 'n8n',
      external_id: eventData.external_id ? `n8n-${eventData.external_id}` : null,
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true, created: data })
  }

  if (event_type === 'update_issue' && eventData?.id) {
    const { id, ...updates } = eventData
    const { data, error } = await supabase.from('issues').update(updates).eq('id', id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true, updated: data })
  }

  if (event_type === 'close_issue' && eventData?.id) {
    await supabase.from('issues').update({ status: 'closed' }).eq('id', eventData.id)
    return NextResponse.json({ success: true })
  }

  if (event_type === 'ping') {
    return NextResponse.json({ success: true, message: 'IssueVault n8n endpoint is alive', timestamp: new Date().toISOString() })
  }

  return NextResponse.json({ success: true, received: event_type, note: 'Event logged' })
}
