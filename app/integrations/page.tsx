'use client'
import { useEffect, useState } from 'react'
import PageWrapper from '@/components/PageWrapper'
import Toast from '@/components/Toast'
import {
  Plus, Trash2, RefreshCw, CheckCircle, XCircle, AlertCircle,
  X, ExternalLink, Github, Zap, Slack, Link2, Settings2, Clock, DownloadCloud
} from 'lucide-react'

// ── Integration catalogue ────────────────────────────────────────────────────
const CATALOGUE = [
  {
    type: 'n8n', name: 'n8n', logo: '🔶', color: '#ea431b',
    border: 'rgba(234,67,27,0.3)', bg: 'rgba(234,67,27,0.06)',
    description: 'Automate 400+ app integrations. Trigger workflows on issue events or push issues from any tool.',
    docs: 'https://n8n.io',
    fields: [],
    customPage: '/integrations/n8n',
  },

  {
    type: 'github', name: 'GitHub', logo: '🐙', color: '#e2e8f0',
    border: 'rgba(226,232,240,0.2)', bg: 'rgba(226,232,240,0.05)',
    description: 'Import issues from any GitHub repository automatically.',
    docs: 'https://docs.github.com/en/rest/issues',
    fields: [
      { key: 'owner', label: 'Owner / Org', placeholder: 'e.g. facebook', required: true },
      { key: 'repo',  label: 'Repository',  placeholder: 'e.g. react',    required: true },
      { key: 'token', label: 'Personal Access Token', placeholder: 'ghp_...', required: true, secret: true, help: 'Create at GitHub → Settings → Developer Settings → PATs' },
    ],
  },
  {
    type: 'jira', name: 'Jira', logo: '🔵', color: '#2684ff',
    border: 'rgba(38,132,255,0.3)', bg: 'rgba(38,132,255,0.06)',
    description: 'Pull open tickets from your Jira Cloud project.',
    docs: 'https://developer.atlassian.com/cloud/jira/platform/rest/v3/',
    fields: [
      { key: 'domain',      label: 'Jira Domain',   placeholder: 'yourcompany.atlassian.net', required: true },
      { key: 'email',       label: 'Account Email', placeholder: 'you@company.com',           required: true },
      { key: 'api_token',   label: 'API Token',     placeholder: 'ATATT3...',                 required: true, secret: true, help: 'Create at id.atlassian.com → Security → API tokens' },
      { key: 'project_key', label: 'Project Key',   placeholder: 'e.g. ENG (optional)' },
    ],
  },
  {
    type: 'linear', name: 'Linear', logo: '🟣', color: '#5e6ad2',
    border: 'rgba(94,106,210,0.3)', bg: 'rgba(94,106,210,0.06)',
    description: 'Sync open Linear issues into IssueVault.',
    docs: 'https://developers.linear.app/docs/graphql/working-with-the-graphql-api',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'lin_api_...', required: true, secret: true, help: 'Settings → API → Personal API keys' },
      { key: 'team_id', label: 'Team ID', placeholder: 'Optional — leave blank for all teams' },
    ],
  },
  {
    type: 'slack', name: 'Slack', logo: '💬', color: '#e01e5a',
    border: 'rgba(224,30,90,0.3)', bg: 'rgba(224,30,90,0.06)',
    description: 'Convert Slack channel messages into trackable issues.',
    docs: 'https://api.slack.com/methods/conversations.history',
    fields: [
      { key: 'bot_token',  label: 'Bot Token',  placeholder: 'xoxb-...', required: true, secret: true, help: 'Create a Slack App → OAuth & Permissions → Bot User OAuth Token' },
      { key: 'channel_id', label: 'Channel ID', placeholder: 'C01234ABCDE', required: true, help: 'Right-click channel → View channel details → bottom of About tab' },
    ],
  },
  {
    type: 'notion', name: 'Notion', logo: '📋', color: '#ffffff',
    border: 'rgba(255,255,255,0.15)', bg: 'rgba(255,255,255,0.04)',
    description: 'Import issues from a Notion database.',
    docs: 'https://developers.notion.com/',
    fields: [
      { key: 'api_key',     label: 'Integration Token', placeholder: 'secret_...', required: true, secret: true, help: 'notion.so/my-integrations → New integration → Internal Integration Token' },
      { key: 'database_id', label: 'Database ID',       placeholder: '32-char UUID from page URL', required: true },
    ],
  },
  {
    type: 'webhook', name: 'Webhook', logo: '🔗', color: '#00f5ff',
    border: 'rgba(0,245,255,0.2)', bg: 'rgba(0,245,255,0.05)',
    description: 'Receive issues via inbound HTTP webhook from any system.',
    docs: '#',
    fields: [
      { key: 'secret', label: 'Webhook Secret', placeholder: 'Optional signing secret for HMAC verification' },
    ],
    readonly: true, // no outbound sync — it receives
  },
]

const STATUS_ICON: Record<string, any> = {
  active: CheckCircle, error: XCircle, pending: AlertCircle
}
const STATUS_COLOR: Record<string, string> = {
  active: '#00ff94', error: '#ef4444', pending: '#ffe600'
}

export default function Integrations() {
  const [connections, setConnections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<any>(null)
  const [modal, setModal] = useState<any>(null)   // { type: catalogue entry }
  const [form, setForm] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState<string | null>(null)
  const [syncResult, setSyncResult] = useState<any>(null)
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})

  const load = async () => {
    const r = await fetch('/api/integrations')
    const d = await r.json()
    setConnections(d.data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openAdd = (cat: any) => {
    setForm({})
    setModal(cat)
    setSyncResult(null)
  }

  const save = async () => {
    if (!modal) return
    setSaving(true)
    // Validate required fields
    const missing = modal.fields.filter((f: any) => f.required && !form[f.key]?.trim())
    if (missing.length) {
      setToast({ message: `Required: ${missing.map((f: any) => f.label).join(', ')}`, type: 'error' })
      setSaving(false); return
    }
    const r = await fetch('/api/integrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: modal.type, name: modal.name, config: form }),
    })
    const d = await r.json()
    setSaving(false)
    if (d.error) return setToast({ message: d.error, type: 'error' })
    setToast({ message: `${modal.name} connected!`, type: 'success' })
    setModal(null)
    load()
  }

  const del = async (id: string, name: string) => {
    if (!confirm(`Disconnect ${name}? Imported issues won't be deleted.`)) return
    await fetch('/api/integrations?id=' + id, { method: 'DELETE' })
    setToast({ message: 'Integration removed', type: 'info' })
    load()
  }

  const sync = async (id: string) => {
    setSyncing(id)
    setSyncResult(null)
    const r = await fetch('/api/integrations/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ integration_id: id }),
    })
    const d = await r.json()
    setSyncing(null)
    if (d.error) { setToast({ message: d.error, type: 'error' }); return }
    setSyncResult({ id, ...d })
    setToast({ message: `Synced! ${d.created} new issues imported.`, type: 'success' })
    load()
  }

  const connectedTypes = new Set(connections.map((c: any) => c.type))

  return (
    <PageWrapper title="Integrations" subtitle="Connect IssueVault to your company's tools">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Active Connections */}
      {connections.length > 0 && (
        <div className="mb-8">
          <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>
            Active Connections
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '14px' }}>
            {connections.map((conn: any) => {
              const cat = CATALOGUE.find(c => c.type === conn.type)
              const SI = STATUS_ICON[conn.status] || AlertCircle
              const sc = STATUS_COLOR[conn.status] || '#475569'
              const isSyncing = syncing === conn.id
              const sr = syncResult?.id === conn.id
              return (
                <div key={conn.id} className="card" style={{ border: `1px solid ${cat?.border || 'rgba(255,255,255,0.08)'}`, background: cat?.bg || 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '26px', lineHeight: 1 }}>{cat?.logo}</span>
                      <div>
                        <div style={{ fontWeight: 700, color: 'white', fontSize: '15px' }}>{conn.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                          <SI size={11} color={sc} />
                          <span style={{ fontSize: '11px', color: sc, textTransform: 'capitalize' }}>{conn.status}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => del(conn.id, conn.name)} className="btn-danger" style={{ padding: '4px 10px', fontSize: '11px' }}>
                      <Trash2 size={11} />
                    </button>
                  </div>

                  {/* Config preview (masked) */}
                  <div style={{ marginBottom: '12px', padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)' }}>
                    {Object.entries(conn.config || {}).map(([k, v]: any) => {
                      const field = cat?.fields.find((f: any) => f.key === k)
                      const masked = (field as any)?.secret ? '•'.repeat(12) : String(v).slice(0, 40)
                      return (
                        <div key={k} style={{ display: 'flex', gap: '8px', fontSize: '11px', marginBottom: '3px' }}>
                          <span style={{ color: '#475569', minWidth: '90px', flexShrink: 0 }}>{field?.label || k}</span>
                          <span style={{ color: '#64748b', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{masked}</span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Last sync info */}
                  {conn.last_synced && (
                    <div style={{ fontSize: '11px', color: '#334155', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={10} />
                      Last synced {new Date(conn.last_synced).toLocaleString()} — {conn.last_sync_count ?? 0} new issues
                    </div>
                  )}

                  {/* Sync result banner */}
                  {sr && (
                    <div style={{ marginBottom: '12px', padding: '8px 12px', borderRadius: '7px', background: 'rgba(0,255,148,0.08)', border: '1px solid rgba(0,255,148,0.2)', fontSize: '12px', color: '#00ff94' }}>
                      ✓ Pulled {syncResult.pulled} · Created {syncResult.created} · Skipped {syncResult.skipped}
                    </div>
                  )}

                  {!cat?.readonly && (
                    <button onClick={() => sync(conn.id)} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '13px', padding: '9px' }} disabled={isSyncing}>
                      {isSyncing ? <><RefreshCw size={13} className="animate-spin" />Syncing...</> : <><DownloadCloud size={13} />Sync Now</>}
                    </button>
                  )}
                  {cat?.readonly && (
                    <div style={{ textAlign: 'center', fontSize: '12px', color: '#334155', padding: '6px' }}>Receives data automatically via webhook</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Integration Catalogue */}
      <h2 style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>
        {connections.length > 0 ? 'Add Another Integration' : 'Connect Your Tools'}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
        {CATALOGUE.map(cat => {
          const alreadyConnected = connectedTypes.has(cat.type)
          return (
            <div key={cat.type} className={`card ${alreadyConnected ? '' : 'card-hover'}`}
              style={{ border: `1px solid ${cat.border}`, background: cat.bg, opacity: alreadyConnected ? 0.7 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ fontSize: '32px', lineHeight: 1, flexShrink: 0 }}>{cat.logo}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <h3 style={{ fontWeight: 700, color: 'white', fontSize: '15px', margin: 0 }}>{cat.name}</h3>
                    {alreadyConnected && (
                      <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '999px', background: 'rgba(0,255,148,0.12)', color: '#00ff94', border: '1px solid rgba(0,255,148,0.25)' }}>Connected</span>
                    )}
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px', lineHeight: '1.5' }}>{cat.description}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => cat.customPage ? (window.location.href = cat.customPage) : openAdd(cat)}
                      className="btn-primary"
                      style={{ fontSize: '12px', padding: '7px 14px' }}
                    >
                      <Plus size={12} />{alreadyConnected ? 'Add Another' : 'Connect'}
                    </button>
                    {cat.docs !== '#' && (
                      <a href={cat.docs} target="_blank" className="btn-secondary" style={{ fontSize: '12px', padding: '7px 14px' }}>
                        <ExternalLink size={11} />Docs
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* How it works */}
      <div className="card" style={{ marginTop: '28px', borderColor: 'rgba(157,0,255,0.2)', background: 'rgba(157,0,255,0.04)' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#9d00ff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={14} /> How Sync Works
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            { step: '1', title: 'Connect', desc: 'Enter your API credentials. They are stored encrypted in Supabase.' },
            { step: '2', title: 'Sync', desc: 'Click "Sync Now" — IssueVault calls the external API and pulls open issues.' },
            { step: '3', title: 'Dedupe', desc: 'Issues already imported (by external ID) are skipped automatically.' },
            { step: '4', title: 'Track', desc: 'Imported issues appear on your Dashboard, Issues, and Analytics pages.' },
          ].map(({ step, title, desc }) => (
            <div key={step}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(157,0,255,0.2)', border: '1px solid rgba(157,0,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#9d00ff', fontSize: '13px', marginBottom: '8px' }}>{step}</div>
              <div style={{ fontWeight: 600, color: 'white', fontSize: '13px', marginBottom: '4px' }}>{title}</div>
              <div style={{ fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Connect Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>{modal.logo}</span>
                <div>
                  <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'white', margin: 0 }}>Connect {modal.name}</h2>
                  <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>{modal.description}</p>
                </div>
              </div>
              <button onClick={() => setModal(null)}><X size={18} color="#475569" /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {modal.fields.map((field: any) => (
                <div key={field.key}>
                  <label style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                    {field.label}{field.required && <span style={{ color: '#ff2d78', marginLeft: '3px' }}>*</span>}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      className="input-dark"
                      type={field.secret && !showSecrets[field.key] ? 'password' : 'text'}
                      placeholder={field.placeholder}
                      value={form[field.key] || ''}
                      onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                      style={field.secret ? { paddingRight: '42px', fontFamily: form[field.key] && !showSecrets[field.key] ? 'monospace' : 'inherit' } : {}}
                    />
                    {field.secret && (
                      <button
                        type="button"
                        onClick={() => setShowSecrets(p => ({ ...p, [field.key]: !p[field.key] }))}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '11px' }}>
                        {showSecrets[field.key] ? 'hide' : 'show'}
                      </button>
                    )}
                  </div>
                  {field.help && (
                    <p style={{ fontSize: '11px', color: '#334155', marginTop: '5px', lineHeight: '1.4' }}>💡 {field.help}</p>
                  )}
                </div>
              ))}
            </div>

            {modal.docs !== '#' && (
              <div style={{ margin: '16px 0', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ExternalLink size={12} color="#475569" />
                <span style={{ fontSize: '12px', color: '#475569' }}>Need help? Read the</span>
                <a href={modal.docs} target="_blank" style={{ fontSize: '12px', color: '#9d00ff', textDecoration: 'none' }}>official API docs →</a>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button onClick={save} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '11px' }}>
                {saving ? 'Connecting...' : `Connect ${modal.name}`}
              </button>
              <button onClick={() => setModal(null)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
