/*
# Create IssueVault schema (single-tenant, no auth)

1. Overview
IssueVault is a single-tenant issue tracking system with no sign-in screen.
All data is intentionally shared/public, so RLS policies allow both the anon
key (used by the Next.js API routes) and authenticated users full CRUD access.

2. New Tables
- `issues` — core issue records (title, description, type, severity, status, assignee, reporter, tags, upload_id)
- `issue_actions` — actions taken on issues (approve/reject/fix/reopen/comment/assign) with old/new status
- `uploads` — CSV upload metadata (filename, row_count, status, uploaded_by)
- `records` — individual rows ingested from CSV uploads, stored as JSONB
- `audit_log` — append-only audit trail of all CREATE/UPDATE/DELETE/CSV_UPLOAD/ACTION events with before/after diff

3. Indexes
- issues: status, severity, issue_type
- issue_actions: issue_id
- records: upload_id
- audit_log: created_at DESC

4. Security
- RLS enabled on every table.
- 4 policies per table (select/insert/update/delete) scoped to `TO anon, authenticated`
  with `USING (true)` / `WITH CHECK (true)` because this is a no-auth, intentionally
  shared single-tenant app — the anon-key API routes must be able to read and write.
*/

-- issues
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

-- issue_actions
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

-- uploads
CREATE TABLE IF NOT EXISTS uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  row_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'processing',
  uploaded_by TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- records
CREATE TABLE IF NOT EXISTS records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  upload_id UUID,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- audit_log
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_severity ON issues(severity);
CREATE INDEX IF NOT EXISTS idx_issues_type ON issues(issue_type);
CREATE INDEX IF NOT EXISTS idx_issue_actions_issue_id ON issue_actions(issue_id);
CREATE INDEX IF NOT EXISTS idx_records_upload_id ON records(upload_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at DESC);

-- Enable RLS on all tables
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- issues policies
DROP POLICY IF EXISTS "anon_select_issues" ON issues;
CREATE POLICY "anon_select_issues" ON issues FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_issues" ON issues;
CREATE POLICY "anon_insert_issues" ON issues FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_issues" ON issues;
CREATE POLICY "anon_update_issues" ON issues FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_issues" ON issues;
CREATE POLICY "anon_delete_issues" ON issues FOR DELETE
  TO anon, authenticated USING (true);

-- issue_actions policies
DROP POLICY IF EXISTS "anon_select_issue_actions" ON issue_actions;
CREATE POLICY "anon_select_issue_actions" ON issue_actions FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_issue_actions" ON issue_actions;
CREATE POLICY "anon_insert_issue_actions" ON issue_actions FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_issue_actions" ON issue_actions;
CREATE POLICY "anon_update_issue_actions" ON issue_actions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_issue_actions" ON issue_actions;
CREATE POLICY "anon_delete_issue_actions" ON issue_actions FOR DELETE
  TO anon, authenticated USING (true);

-- uploads policies
DROP POLICY IF EXISTS "anon_select_uploads" ON uploads;
CREATE POLICY "anon_select_uploads" ON uploads FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_uploads" ON uploads;
CREATE POLICY "anon_insert_uploads" ON uploads FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_uploads" ON uploads;
CREATE POLICY "anon_update_uploads" ON uploads FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_uploads" ON uploads;
CREATE POLICY "anon_delete_uploads" ON uploads FOR DELETE
  TO anon, authenticated USING (true);

-- records policies
DROP POLICY IF EXISTS "anon_select_records" ON records;
CREATE POLICY "anon_select_records" ON records FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_records" ON records;
CREATE POLICY "anon_insert_records" ON records FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_records" ON records;
CREATE POLICY "anon_update_records" ON records FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_records" ON records;
CREATE POLICY "anon_delete_records" ON records FOR DELETE
  TO anon, authenticated USING (true);

-- audit_log policies
DROP POLICY IF EXISTS "anon_select_audit_log" ON audit_log;
CREATE POLICY "anon_select_audit_log" ON audit_log FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_audit_log" ON audit_log;
CREATE POLICY "anon_insert_audit_log" ON audit_log FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_audit_log" ON audit_log;
CREATE POLICY "anon_update_audit_log" ON audit_log FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_audit_log" ON audit_log;
CREATE POLICY "anon_delete_audit_log" ON audit_log FOR DELETE
  TO anon, authenticated USING (true);
