export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const sb = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

async function syncGitHub(config: any) {
  const { owner, repo, token } = config
  if (!owner || !repo || !token) throw new Error('GitHub requires: owner, repo, token')
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=50`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }
  })
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText}`)
  const ghIssues = await res.json()
  return ghIssues.filter((i: any) => !i.pull_request).map((i: any) => ({
    title: i.title,
    description: (i.body || '').slice(0, 1000),
    issue_type: i.labels?.some((l: any) => l.name === 'bug') ? 'bug'
      : i.labels?.some((l: any) => ['enhancement','feature'].includes(l.name)) ? 'feature' : 'task',
    severity: i.labels?.some((l: any) => l.name === 'critical') ? 'critical'
      : i.labels?.some((l: any) => ['high','urgent'].includes(l.name)) ? 'high' : 'medium',
    status: 'open',
    reporter: i.user?.login || 'github',
    assignee: i.assignee?.login || '',
    tags: (i.labels || []).map((l: any) => l.name),
    external_id: `github-${i.number}`,
    external_url: i.html_url,
    source: 'github',
  }))
}

async function syncJira(config: any) {
  const { domain, email, api_token, project_key } = config
  if (!domain || !email || !api_token) throw new Error('Jira requires: domain, email, api_token')
  const jql = project_key
    ? `project = ${project_key} AND statusCategory != Done ORDER BY created DESC`
    : 'statusCategory != Done ORDER BY created DESC'
  const auth = Buffer.from(`${email}:${api_token}`).toString('base64')
  const res = await fetch(
    `https://${domain}/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=50&fields=summary,description,issuetype,priority,status,assignee,reporter`,
    { headers: { Authorization: `Basic ${auth}`, Accept: 'application/json' } }
  )
  if (!res.ok) throw new Error(`Jira API ${res.status}: ${res.statusText}`)
  const { issues } = await res.json()
  return (issues || []).map((i: any) => ({
    title: i.fields.summary,
    description: (i.fields.description?.content?.[0]?.content?.[0]?.text || '').slice(0, 1000),
    issue_type: i.fields.issuetype?.name?.toLowerCase() === 'bug' ? 'bug'
      : i.fields.issuetype?.name?.toLowerCase() === 'story' ? 'feature' : 'task',
    severity: i.fields.priority?.name?.toLowerCase() === 'highest' ? 'critical'
      : i.fields.priority?.name?.toLowerCase() === 'high' ? 'high'
      : i.fields.priority?.name?.toLowerCase() === 'low' ? 'low' : 'medium',
    status: 'open',
    reporter: i.fields.reporter?.displayName || 'jira',
    assignee: i.fields.assignee?.displayName || '',
    external_id: `jira-${i.key}`,
    external_url: `https://${domain}/browse/${i.key}`,
    source: 'jira',
  }))
}

async function syncLinear(config: any) {
  const { api_key, team_id } = config
  if (!api_key) throw new Error('Linear requires: api_key')
  const teamFilter = team_id ? `, team: { id: { eq: "${team_id}" } }` : ''
  const query = `query {
    issues(filter: { state: { type: { nin: ["completed","cancelled"] } }${teamFilter} }, first: 50) {
      nodes { id title description priority state { name } assignee { name } labels { nodes { name } } url identifier }
    }
  }`
  const res = await fetch('https://api.linear.app/graphql', {
    method: 'POST',
    headers: { Authorization: api_key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  })
  if (!res.ok) throw new Error(`Linear API ${res.status}`)
  const { data, errors } = await res.json()
  if (errors) throw new Error(errors[0]?.message || 'Linear GraphQL error')
  return (data?.issues?.nodes || []).map((i: any) => ({
    title: i.title,
    description: (i.description || '').slice(0, 1000),
    issue_type: i.labels?.nodes?.some((l: any) => l.name === 'Bug') ? 'bug' : 'task',
    severity: i.priority === 1 ? 'critical' : i.priority === 2 ? 'high' : i.priority === 3 ? 'medium' : 'low',
    status: 'open',
    reporter: 'linear',
    assignee: i.assignee?.name || '',
    external_id: `linear-${i.identifier}`,
    external_url: i.url,
    source: 'linear',
  }))
}

async function syncSlack(config: any) {
  const { bot_token, channel_id } = config
  if (!bot_token || !channel_id) throw new Error('Slack requires: bot_token, channel_id')
  const res = await fetch(`https://slack.com/api/conversations.history?channel=${channel_id}&limit=20`, {
    headers: { Authorization: `Bearer ${bot_token}` }
  })
  const d = await res.json()
  if (!d.ok) throw new Error(`Slack API: ${d.error}`)
  return (d.messages || [])
    .filter((m: any) => m.text && m.type === 'message' && !m.bot_id)
    .map((m: any) => ({
      title: m.text.slice(0, 100),
      description: m.text.slice(0, 500),
      issue_type: 'task',
      severity: 'low',
      status: 'open',
      reporter: m.user || 'slack',
      external_id: `slack-${m.ts}`,
      source: 'slack',
    }))
}

export async function POST(req: NextRequest) {
  const supabase = sb()
  const { integration_id } = await req.json()

  const { data: integration, error: ie } = await supabase.from('integrations').select('*').eq('id', integration_id).single()
  if (ie || !integration) return NextResponse.json({ error: 'Integration not found' }, { status: 404 })

  try {
    let imported: any[] = []
    if (integration.type === 'github') imported = await syncGitHub(integration.config)
    else if (integration.type === 'jira') imported = await syncJira(integration.config)
    else if (integration.type === 'linear') imported = await syncLinear(integration.config)
    else if (integration.type === 'slack') imported = await syncSlack(integration.config)
    else return NextResponse.json({ error: `Sync not supported for type: ${integration.type}` }, { status: 400 })

    let created = 0, skipped = 0
    for (const issue of imported) {
      const { data: existing } = await supabase.from('issues').select('id').eq('external_id', issue.external_id).maybeSingle()
      if (!existing) {
        await supabase.from('issues').insert(issue)
        created++
      } else {
        skipped++
      }
    }

    await supabase.from('integrations').update({
      last_synced: new Date().toISOString(),
      last_sync_count: created,
      status: 'active',
    }).eq('id', integration_id)

    // Log to audit
    await supabase.from('audit_log').insert({
      table_name: 'integrations',
      record_id: integration_id,
      action: `Synced ${integration.type}: pulled ${imported.length}, created ${created}, skipped ${skipped}`,
      performed_by: 'system',
    })

    return NextResponse.json({ success: true, pulled: imported.length, created, skipped })
  } catch (err: any) {
    await supabase.from('integrations').update({ status: 'error', last_error: err.message }).eq('id', integration_id)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
