'use client'
import { useState } from 'react'
import { CheckCircle, Copy, Database, ExternalLink } from 'lucide-react'

const SQL = `-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/keyeemsymgfwrzbqfwxk/sql

CREATE TABLE IF NOT EXISTS issues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  issue_type TEXT DEFAULT 'bug',
  severity TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  assignee TEXT,
  reporter TEXT NOT NULL DEFAULT 'system',
  tags TEXT[],
  upload_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS issue_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_id UUID,
  action_type TEXT NOT NULL,
  performed_by TEXT NOT NULL DEFAULT 'admin',
  notes TEXT,
  old_status TEXT,
  new_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  row_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'processing',
  uploaded_by TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  upload_id UUID,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id TEXT,
  action TEXT NOT NULL,
  performed_by TEXT NOT NULL DEFAULT 'admin',
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_severity ON issues(severity);
CREATE INDEX IF NOT EXISTS idx_issues_type ON issues(issue_type);
CREATE INDEX IF NOT EXISTS idx_issue_actions_issue_id ON issue_actions(issue_id);
CREATE INDEX IF NOT EXISTS idx_records_upload_id ON records(upload_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at DESC);

-- Sample data
INSERT INTO issues (title, description, issue_type, severity, status, reporter) VALUES
  ('Login page returns 500 on wrong password', 'Users get server error instead of invalid credentials', 'bug', 'high', 'open', 'shourya'),
  ('Add dark mode toggle', 'Users want ability to switch themes', 'feature', 'low', 'open', 'shourya'),
  ('SQL injection in search endpoint', 'Search does not sanitize input', 'security', 'critical', 'in_progress', 'system'),
  ('Dashboard query too slow', 'Loads slow for accounts with 10k+ records', 'enhancement', 'medium', 'open', 'shourya'),
  ('Update user profile flow', 'Allow avatar and bio update in one step', 'task', 'low', 'resolved', 'shourya');`

export default function SetupPage() {
  const [copied, setCopied] = useState(false)
  const [checking, setChecking] = useState(false)
  const [status, setStatus] = useState<any>(null)

  const copy = () => {
    navigator.clipboard.writeText(SQL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const checkTables = async () => {
    setChecking(true)
    const r = await fetch('/api/setup')
    const d = await r.json()
    setStatus(d)
    setChecking(false)
  }

  const seed = async () => {
    const r = await fetch('/api/setup', { method: 'POST' })
    const d = await r.json()
    setStatus((p: any) => ({ ...p, seeded: d.seeded }))
  }

  const allOk = status?.results?.every((r: any) => r.status === 'exists')

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
               style={{background:'linear-gradient(135deg,#9d00ff,#ff2d78)'}}>
            <Database size={28} className="text-white"/>
          </div>
          <h1 className="text-3xl font-bold gradient-header mb-2">Database Setup</h1>
          <p className="text-slate-400">Run this SQL in your Supabase dashboard to create all required tables.</p>
        </div>

        <div className="card mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-300 uppercase tracking-wider">Setup SQL</span>
            <div className="flex gap-2">
              <a href="https://supabase.com/dashboard/project/keyeemsymgfwrzbqfwxk/sql" target="_blank"
                 className="btn-secondary text-xs flex items-center gap-1">
                <ExternalLink size={12}/>Open SQL Editor
              </a>
              <button onClick={copy} className="btn-primary text-xs flex items-center gap-1">
                {copied ? <><CheckCircle size={12}/>Copied!</> : <><Copy size={12}/>Copy SQL</>}
              </button>
            </div>
          </div>
          <pre className="text-xs text-neon-green bg-black/40 p-4 rounded-lg overflow-auto max-h-64 border border-white/5">{SQL}</pre>
        </div>

        <div className="flex gap-3 mb-4">
          <button onClick={checkTables} disabled={checking} className="btn-primary flex-1">
            {checking ? 'Checking...' : '🔍 Check Tables'}
          </button>
          {allOk && (
            <button onClick={seed} className="btn-success flex-1">🌱 Seed Sample Data</button>
          )}
          {allOk && (
            <a href="/" className="btn-primary flex-1 text-center">🚀 Go to Dashboard</a>
          )}
        </div>

        {status && (
          <div className="card">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Table Status</h3>
            <div className="space-y-2">
              {status.results?.map((r: any) => (
                <div key={r.table} className="flex items-center gap-3 p-2 rounded-lg bg-white/3">
                  <CheckCircle size={14} className={r.status === 'exists' ? 'text-neon-green' : 'text-red-400'}/>
                  <span className="font-mono text-sm text-slate-300">{r.table}</span>
                  <span className={`badge ml-auto ${r.status === 'exists' ? 'badge-resolved' : 'badge-rejected'}`}>{r.status}</span>
                </div>
              ))}
            </div>
            {status.seeded && <p className="text-neon-green text-sm mt-3">✓ Sample data seeded!</p>}
          </div>
        )}
      </div>
    </div>
  )
}
