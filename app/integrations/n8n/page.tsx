'use client'
import { useEffect, useState } from 'react'
import PageWrapper from '@/components/PageWrapper'
import Toast from '@/components/Toast'
import {
  Zap, Plus, Trash2, Play, ChevronDown, ChevronUp,
  X, Copy, Check, ExternalLink, RefreshCw, Globe, ArrowRight,
  ArrowLeft, ToggleLeft, ToggleRight, Info
} from 'lucide-react'
import Link from 'next/link'

// ── Preset workflow templates ────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: 'new_critical',
    name: 'Alert on Critical Issue',
    desc: 'Fires when a critical issue is created — send to Slack, PagerDuty, email, etc.',
    trigger: 'issue.created.critical',
    icon: '🚨',
    color: '#ef4444',
  },
  {
    id: 'daily_report',
    name: 'Daily Issue Digest',
    desc: 'Send a daily summary of open/resolved issues to your team channel.',
    trigger: 'schedule.daily',
    icon: '📊',
    color: '#9d00ff',
  },
  {
    id: 'auto_assign',
    name: 'Auto-Assign by Type',
    desc: 'Route bugs to dev team, security issues to InfoSec, features to PM.',
    trigger: 'issue.created',
    icon: '🤖',
    color: '#00f5ff',
  },
  {
    id: 'jira_sync',
    name: 'Sync to Jira',
    desc: 'Mirror every new IssueVault issue into Jira automatically.',
    trigger: 'issue.created',
    icon: '🔵',
    color: '#2684ff',
  },
  {
    id: 'github_comment',
    name: 'Post to GitHub Issue',
    desc: 'When you resolve an issue, comment on the linked GitHub issue.',
    trigger: 'issue.resolved',
    icon: '🐙',
    color: '#e2e8f0',
  },
  {
    id: 'escalate',
    name: 'Escalation Timer',
    desc: 'If a critical issue stays open for 24h, escalate to management via email.',
    trigger: 'schedule.hourly',
    icon: '⏱️',
    color: '#ffe600',
  },
]

const EVENT_TYPES = [
  'issue.created', 'issue.updated', 'issue.resolved', 'issue.closed',
  'issue.created.critical', 'issue.created.high',
  'action.logged', 'upload.completed', 'manual',
]

export default function N8nPage() {
  const [workflows, setWorkflows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<any>(null)
  const [modal, setModal] = useState<'add' | 'test' | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [testing, setTesting] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<any>(null)

  // Form state
  const [form, setForm] = useState({
    name: '', webhook_url: '', events: [] as string[], description: '', inbound_secret: ''
  })
  // Test form
  const [testForm, setTestForm] = useState({ workflow_url: '', event: 'manual', issue_id: '' })

  const load = async () => {
    const r = await fetch('/api/integrations')
    const d = await r.json()
    setWorkflows((d.data || []).filter((x: any) => x.type === 'n8n'))
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const inboundUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/integrations/n8n`
    : 'https://your-domain.com/api/integrations/n8n'

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const save = async () => {
    if (!form.name.trim()) return setToast({ message: 'Workflow name required', type: 'error' })
    if (!form.webhook_url.trim()) return setToast({ message: 'n8n Webhook URL required', type: 'error' })
    if (!form.webhook_url.startsWith('http')) return setToast({ message: 'Webhook URL must start with http(s)://', type: 'error' })

    const r = await fetch('/api/integrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'n8n',
        name: form.name,
        config: {
          webhook_url: form.webhook_url,
          events: form.events,
          description: form.description,
          inbound_secret: form.inbound_secret,
        },
      }),
    })
    const d = await r.json()
    if (d.error) return setToast({ message: d.error, type: 'error' })
    setToast({ message: 'n8n workflow connected!', type: 'success' })
    setModal(null)
    setForm({ name: '', webhook_url: '', events: [], description: '', inbound_secret: '' })
    load()
  }

  const del = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}"?`)) return
    await fetch('/api/integrations?id=' + id, { method: 'DELETE' })
    setToast({ message: 'Workflow removed', type: 'info' })
    load()
  }

  const trigger = async (wf: any) => {
    setTesting(wf.id)
    setTestResult(null)
    const r = await fetch('/api/integrations/n8n', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'test_ping',
        workflow_url: wf.config.webhook_url,
        payload: { test: true, workflow_name: wf.name },
      }),
    })
    const d = await r.json()
    setTesting(null)
    if (d.error) return setToast({ message: `Trigger failed: ${d.error}`, type: 'error' })
    setToast({ message: `"${wf.name}" triggered successfully!`, type: 'success' })
    load()
  }

  const runTest = async () => {
    if (!testForm.workflow_url) return setToast({ message: 'Webhook URL required', type: 'error' })
    setTesting('test')
    const r = await fetch('/api/integrations/n8n', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: testForm.event,
        workflow_url: testForm.workflow_url,
        issue_id: testForm.issue_id || undefined,
        payload: { test: true },
      }),
    })
    const d = await r.json()
    setTesting(null)
    setTestResult(d)
  }

  const toggleEvent = (ev: string) => {
    setForm(p => ({
      ...p,
      events: p.events.includes(ev) ? p.events.filter(e => e !== ev) : [...p.events, ev]
    }))
  }

  const useTemplate = (t: any) => {
    setForm(p => ({ ...p, name: t.name, description: t.desc, events: [t.trigger] }))
    setModal('add')
  }

  return (
    <PageWrapper title="n8n Integration" subtitle="Automate workflows between IssueVault and any tool">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Hero */}
      <div className="card mb-6" style={{ background: 'linear-gradient(135deg, rgba(234,67,27,0.08) 0%, rgba(157,0,255,0.08) 100%)', borderColor: 'rgba(234,67,27,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(234,67,27,0.15)', border: '1px solid rgba(234,67,27,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0 }}>
            🔶
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontWeight: 700, color: 'white', fontSize: '17px', margin: '0 0 5px' }}>n8n Automation</h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
              Connect IssueVault to 400+ apps — Slack, Jira, GitHub, PagerDuty, HubSpot, Salesforce and more.
              Trigger n8n workflows on issue events, or let n8n push issues back into IssueVault.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
            <a href="https://n8n.io" target="_blank" className="btn-secondary" style={{ fontSize: '12px', padding: '8px 14px' }}>
              <ExternalLink size={12} /> n8n.io
            </a>
            <button onClick={() => setModal('add')} className="btn-primary" style={{ fontSize: '13px' }}>
              <Plus size={14} /> Add Workflow
            </button>
          </div>
        </div>
      </div>

      {/* Two-column: IssueVault ↔ n8n diagram */}
      <div className="card mb-6" style={{ padding: '20px 24px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>How it connects</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(157,0,255,0.08)', border: '1px solid rgba(157,0,255,0.2)', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#9d00ff', marginBottom: '6px' }}>IssueVault Event</div>
            <div style={{ fontSize: '11px', color: '#475569', lineHeight: '1.7' }}>
              issue.created<br />issue.resolved<br />action.logged<br />upload.completed
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowRight size={16} color="#00f5ff" />
              <span style={{ fontSize: '10px', color: '#334155' }}>POST webhook</span>
            </div>
            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.08)' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={16} color="#ff2d78" />
              <span style={{ fontSize: '10px', color: '#334155' }}>PUT /api/integrations/n8n</span>
            </div>
          </div>
          <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(234,67,27,0.08)', border: '1px solid rgba(234,67,27,0.25)', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#ea431b', marginBottom: '6px' }}>n8n Workflow</div>
            <div style={{ fontSize: '11px', color: '#475569', lineHeight: '1.7' }}>
              Slack notify<br />Jira ticket<br />GitHub comment<br />Email / SMS / PagerDuty
            </div>
          </div>
        </div>
      </div>

      {/* Inbound URL box */}
      <div className="card mb-6" style={{ borderColor: 'rgba(0,245,255,0.2)', background: 'rgba(0,245,255,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <Globe size={14} color="#00f5ff" />
          <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#00f5ff', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Inbound Webhook (n8n → IssueVault)</h3>
        </div>
        <p style={{ fontSize: '12px', color: '#475569', marginBottom: '10px' }}>
          In n8n, add an <strong style={{ color: '#cbd5e1' }}>HTTP Request</strong> node and POST to this URL to create/update issues from any workflow:
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <code style={{ flex: 1, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '7px', padding: '10px 14px', fontSize: '12px', fontFamily: 'monospace', color: '#00f5ff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {inboundUrl}
          </code>
          <button onClick={() => copyText(inboundUrl, 'url')} className="btn-secondary" style={{ fontSize: '12px', padding: '9px 14px', flexShrink: 0 }}>
            {copied === 'url' ? <><Check size={12} />Copied</> : <><Copy size={12} />Copy</>}
          </button>
        </div>
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
          <button onClick={() => copyText(JSON.stringify({ event_type: 'create_issue', data: { title: 'Issue from n8n', description: 'Auto-created', severity: 'medium', issue_type: 'task' } }, null, 2), 'sample')} className="btn-secondary" style={{ fontSize: '11px', padding: '6px 12px' }}>
            {copied === 'sample' ? <><Check size={11} />Copied!</> : <><Copy size={11} />Copy sample payload</>}
          </button>
          <span style={{ fontSize: '11px', color: '#334155', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Info size={11} /> Method: PUT &nbsp;|&nbsp; Content-Type: application/json
          </span>
        </div>
      </div>

      {/* Active workflows */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#475569' }}>Loading...</div>
      ) : workflows.length > 0 ? (
        <div className="mb-6">
          <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
            Connected Workflows ({workflows.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {workflows.map((wf: any) => (
              <div key={wf.id} className="card" style={{ padding: '0' }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', cursor: 'pointer' }}
                  onClick={() => setExpanded(expanded === wf.id ? null : wf.id)}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: 'rgba(234,67,27,0.15)', border: '1px solid rgba(234,67,27,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                    🔶
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: 'white', fontSize: '14px' }}>{wf.name}</div>
                    {wf.config?.description && <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{wf.config.description}</div>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    {wf.config?.events?.length > 0 && (
                      <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '999px', background: 'rgba(0,245,255,0.1)', color: '#00f5ff', border: '1px solid rgba(0,245,255,0.2)' }}>
                        {wf.config.events.length} event{wf.config.events.length > 1 ? 's' : ''}
                      </span>
                    )}
                    {wf.last_synced && (
                      <span style={{ fontSize: '11px', color: '#334155' }}>
                        Last: {new Date(wf.last_synced).toLocaleDateString()}
                      </span>
                    )}
                    <button
                      onClick={e => { e.stopPropagation(); trigger(wf) }}
                      className="btn-primary"
                      style={{ fontSize: '11px', padding: '5px 12px' }}
                      disabled={testing === wf.id}
                    >
                      {testing === wf.id ? <><RefreshCw size={11} className="animate-spin" />Triggering...</> : <><Play size={11} />Trigger</>}
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); del(wf.id, wf.name) }}
                      className="btn-danger"
                      style={{ fontSize: '11px', padding: '5px 10px' }}
                    >
                      <Trash2 size={11} />
                    </button>
                    {expanded === wf.id ? <ChevronUp size={14} color="#475569" /> : <ChevronDown size={14} color="#475569" />}
                  </div>
                </div>

                {expanded === wf.id && (
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '16px 20px', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Webhook URL</div>
                        <code style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b', wordBreak: 'break-all' }}>
                          {wf.config?.webhook_url?.replace(/token=.*/, 'token=•••')}
                        </code>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Trigger Events</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                          {wf.config?.events?.length > 0
                            ? wf.config.events.map((ev: string) => (
                              <span key={ev} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '999px', background: 'rgba(157,0,255,0.12)', color: '#9d00ff', border: '1px solid rgba(157,0,255,0.25)' }}>{ev}</span>
                            ))
                            : <span style={{ fontSize: '12px', color: '#334155' }}>Manual only</span>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card mb-6" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔶</div>
          <p style={{ color: '#94a3b8', fontWeight: 600, marginBottom: '5px' }}>No n8n workflows connected yet</p>
          <p style={{ fontSize: '13px', color: '#334155', marginBottom: '20px' }}>Use the templates below or add your own webhook URL</p>
          <button onClick={() => setModal('add')} className="btn-primary" style={{ fontSize: '13px' }}>
            <Plus size={14} /> Add First Workflow
          </button>
        </div>
      )}

      {/* Templates */}
      <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
        Workflow Templates
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px', marginBottom: '28px' }}>
        {TEMPLATES.map(t => (
          <div key={t.id} className="card card-hover" style={{ borderColor: `${t.color}22`, background: `${t.color}08` }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '24px', lineHeight: 1, flexShrink: 0 }}>{t.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: 'white', fontSize: '13px', marginBottom: '5px' }}>{t.name}</div>
                <p style={{ fontSize: '11px', color: '#475569', lineHeight: '1.5', marginBottom: '10px' }}>{t.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '999px', background: `${t.color}18`, color: t.color, border: `1px solid ${t.color}30` }}>{t.trigger}</span>
                  <button onClick={() => useTemplate(t)} className="btn-secondary" style={{ fontSize: '11px', padding: '4px 10px', marginLeft: 'auto' }}>
                    Use <ArrowRight size={10} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Test Tool */}
      <div className="card" style={{ borderColor: 'rgba(255,230,0,0.2)', background: 'rgba(255,230,0,0.03)' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#ffe600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={13} /> Test Trigger
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto', gap: '10px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>n8n Webhook URL</label>
            <input className="input-dark" placeholder="https://your-n8n.com/webhook/..." value={testForm.workflow_url} onChange={e => setTestForm(p => ({ ...p, workflow_url: e.target.value }))} />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Event</label>
            <select className="input-dark" value={testForm.event} onChange={e => setTestForm(p => ({ ...p, event: e.target.value }))}>
              {EVENT_TYPES.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#475569', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Issue ID (optional)</label>
            <input className="input-dark" placeholder="UUID to include issue data" value={testForm.issue_id} onChange={e => setTestForm(p => ({ ...p, issue_id: e.target.value }))} />
          </div>
          <button onClick={runTest} disabled={testing === 'test'} className="btn-primary" style={{ height: '38px', padding: '0 18px' }}>
            {testing === 'test' ? <><RefreshCw size={13} className="animate-spin" />Firing...</> : <><Play size={13} />Fire</>}
          </button>
        </div>
        {testResult && (
          <div style={{ marginTop: '14px', padding: '12px 14px', borderRadius: '8px', background: testResult.success ? 'rgba(0,255,148,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${testResult.success ? 'rgba(0,255,148,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
            <div style={{ fontSize: '12px', color: testResult.success ? '#00ff94' : '#ef4444', fontWeight: 600, marginBottom: '6px' }}>
              {testResult.success ? '✓ Workflow triggered successfully' : `✗ ${testResult.error}`}
            </div>
            {testResult.response && (
              <pre style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b', margin: 0, overflow: 'auto', maxHeight: '120px' }}>
                {JSON.stringify(testResult.response, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {modal === 'add' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" style={{ maxWidth: '540px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '26px' }}>🔶</span>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'white', margin: 0 }}>Add n8n Workflow</h2>
                  <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>Connect a webhook to trigger on IssueVault events</p>
                </div>
              </div>
              <button onClick={() => setModal(null)}><X size={18} color="#475569" /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Workflow Name <span style={{ color: '#ff2d78' }}>*</span></label>
                <input className="input-dark" placeholder="e.g. Alert on Critical Issue" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>n8n Webhook URL <span style={{ color: '#ff2d78' }}>*</span></label>
                <input className="input-dark" placeholder="https://your-n8n.com/webhook/abc123" value={form.webhook_url} onChange={e => setForm(p => ({ ...p, webhook_url: e.target.value }))} />
                <p style={{ fontSize: '11px', color: '#334155', marginTop: '5px' }}>💡 In n8n: add a Webhook node → copy the Test/Production URL here</p>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Trigger Events</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {EVENT_TYPES.map(ev => (
                    <button key={ev} type="button" onClick={() => toggleEvent(ev)}
                      style={{
                        fontSize: '11px', padding: '4px 10px', borderRadius: '999px', cursor: 'pointer',
                        background: form.events.includes(ev) ? 'rgba(157,0,255,0.25)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${form.events.includes(ev) ? 'rgba(157,0,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
                        color: form.events.includes(ev) ? '#9d00ff' : '#64748b',
                        transition: 'all 0.15s',
                      }}>
                      {ev}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Description</label>
                <input className="input-dark" placeholder="What does this workflow do?" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Inbound Secret (optional)</label>
                <input className="input-dark" type="password" placeholder="For verifying requests from n8n" value={form.inbound_secret} onChange={e => setForm(p => ({ ...p, inbound_secret: e.target.value }))} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={save} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '11px' }}>
                <Zap size={14} /> Connect Workflow
              </button>
              <button onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
