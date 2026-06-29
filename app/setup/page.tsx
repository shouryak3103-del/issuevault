'use client'
import { useEffect, useState } from 'react'
import PageWrapper from '@/components/PageWrapper'
import { Database, CheckCircle, XCircle, RefreshCw, Copy, Check, AlertTriangle } from 'lucide-react'

const TABLES = ['issues','actions','records','uploads','audit_log','team','integrations','notifications']

const SQL = `-- Run this entire block in Supabase SQL Editor
-- (Dashboard → SQL Editor → New query → Paste → Run)

CREATE TABLE IF NOT EXISTS issues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  issue_type TEXT DEFAULT 'bug',
  severity TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  reporter TEXT,
  assignee TEXT,
  tags TEXT[],
  external_id TEXT,
  external_url TEXT,
  source TEXT DEFAULT 'manual',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  notes TEXT,
  performed_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  row_count INTEGER DEFAULT 0,
  headers TEXT[],
  status TEXT DEFAULT 'success',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  upload_id UUID REFERENCES uploads(id) ON DELETE CASCADE,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT,
  record_id TEXT,
  action TEXT,
  old_data JSONB,
  new_data JSONB,
  performed_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'developer',
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active',
  last_synced TIMESTAMPTZ,
  last_sync_count INTEGER DEFAULT 0,
  last_error TEXT,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_type TEXT DEFAULT 'info',
  title TEXT,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  related_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_issues_external_id ON issues(external_id) WHERE external_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_issues_status   ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_severity ON issues(severity);
CREATE INDEX IF NOT EXISTS idx_actions_issue   ON actions(issue_id);
CREATE INDEX IF NOT EXISTS idx_records_upload  ON records(upload_id);
CREATE INDEX IF NOT EXISTS idx_audit_table     ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_notifs_read     ON notifications(is_read);`

export default function SetupPage() {
  const [status,  setStatus]  = useState<Record<string,boolean|null>>({})
  const [loading, setLoading] = useState(true)
  const [copied,  setCopied]  = useState(false)

  const check = async () => {
    setLoading(true)
    const r = await fetch('/api/setup')
    const d = await r.json()
    setStatus(d.tables || {})
    setLoading(false)
  }
  useEffect(() => { check() }, [])

  const copy = async () => {
    await navigator.clipboard.writeText(SQL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const allOk  = TABLES.every(t => status[t] === true)
  const missing = TABLES.filter(t => status[t] !== true)

  return (
    <PageWrapper title="Database Setup" subtitle="Check and initialize your Supabase schema">

      {/* Status overview */}
      <div className="card mb-6" style={{ borderColor: allOk ? 'rgba(0,255,148,0.25)' : 'rgba(255,230,0,0.25)', background: allOk ? 'rgba(0,255,148,0.04)' : 'rgba(255,230,0,0.04)', marginBottom:'20px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          {allOk
            ? <CheckCircle size={24} color="#00ff94"/>
            : <AlertTriangle size={24} color="#ffe600"/>
          }
          <div>
            <p style={{ fontWeight:700, color:'white', fontSize:'15px', margin:0 }}>{allOk ? 'All tables ready' : `${missing.length} table${missing.length!==1?'s':''} missing`}</p>
            <p style={{ fontSize:'12px', color:'#475569', margin:0 }}>{allOk ? 'Your Supabase database is fully configured.' : 'Run the SQL below in Supabase SQL Editor to create missing tables.'}</p>
          </div>
          <button onClick={check} className="btn-secondary" style={{ marginLeft:'auto', fontSize:'12px', padding:'7px 14px' }}>
            <RefreshCw size={12}/> Recheck
          </button>
        </div>
      </div>

      {/* Table status grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'10px', marginBottom:'24px' }}>
        {TABLES.map(table => {
          const ok = status[table] === true
          return (
            <div key={table} className="card" style={{ padding:'14px 16px', display:'flex', alignItems:'center', gap:'10px',
              borderColor: loading ? 'rgba(255,255,255,0.06)' : ok ? 'rgba(0,255,148,0.2)' : 'rgba(255,230,0,0.25)',
              background: loading ? 'rgba(255,255,255,0.02)' : ok ? 'rgba(0,255,148,0.04)' : 'rgba(255,230,0,0.04)' }}>
              {loading
                ? <div style={{ width:'16px', height:'16px', borderRadius:'50%', background:'rgba(255,255,255,0.08)', animation:'pulse 1.5s infinite' }}/>
                : ok ? <CheckCircle size={16} color="#00ff94"/> : <XCircle size={16} color="#ffe600"/>
              }
              <span style={{ fontSize:'13px', fontFamily:'monospace', color: loading ? '#334155' : ok ? '#e2e8f0' : '#ffe600' }}>{table}</span>
            </div>
          )
        })}
      </div>

      {/* SQL block */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(157,0,255,0.05)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <Database size={14} color="#9d00ff"/>
            <span style={{ fontSize:'13px', fontWeight:600, color:'#cbd5e1' }}>Full Schema SQL</span>
          </div>
          <button onClick={copy} className="btn-secondary" style={{ fontSize:'12px', padding:'7px 14px' }}>
            {copied ? <><Check size={12}/> Copied!</> : <><Copy size={12}/> Copy SQL</>}
          </button>
        </div>
        <pre style={{ margin:0, padding:'20px', fontSize:'12px', fontFamily:'monospace', color:'#64748b', overflowX:'auto', lineHeight:'1.6', maxHeight:'400px', overflowY:'auto' }}>
          {SQL}
        </pre>
      </div>
    </PageWrapper>
  )
}
