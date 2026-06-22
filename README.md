# IssueVault 🐛⚡

> Professional Issue Tracking System — Built with Next.js 14 + Supabase + Tailwind CSS

## Features
- 🔥 **Dashboard** — Live charts, stats, and activity feed from Supabase
- 🐛 **Issues** — Create, edit, delete issues with type/severity/status filters
- ⚡ **Actions** — Approve, reject, fix, reopen, comment on issues
- 📤 **CSV Upload** — Drag-drop CSV import with preview, progress, and history
- 📋 **Records** — Paginated view of all uploaded data records
- 🔍 **Audit Log** — Complete activity log with before/after diff view

## Setup

### 1. Run SQL in Supabase
Go to: https://supabase.com/dashboard/project/keyeemsymgfwrzbqfwxk/sql

Run the SQL from `/app/setup` in the running app.

### 2. Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://keyeemsymgfwrzbqfwxk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

### 3. Run locally
```bash
npm install
npm run dev
```

### 4. Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/shouryak3103-del/issuevault)

## Tech Stack
- **Frontend**: Next.js 14 App Router, React 18, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Icons**: Lucide React
