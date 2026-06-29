# IssueVault 🛡️

> Track. Fix. Ship.

The modern issue tracker for engineering teams. Built with Next.js + Supabase.

## Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Integrations**: GitHub, Jira, Linear, Slack, n8n
- **Marketing site**: Vite + TanStack Router (in `/website`)

## Structure

```
issuevault/
├── app/                   # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── issues/            # Issues tracker
│   ├── actions/           # Automated workflows
│   ├── analytics/         # Charts & insights
│   ├── team/              # Team management
│   ├── integrations/      # GitHub, Jira, Slack, n8n
│   ├── audit/             # Audit log
│   ├── upload/            # CSV uploader
│   ├── records/           # Data records
│   ├── notifications/     # Alerts
│   ├── settings/          # App settings
│   └── api/               # API routes (all backed by Supabase)
├── components/            # Shared React components
├── lib/
│   └── supabase.ts        # Supabase client (anon + admin)
├── src/                   # Vite SPA version (Replit compat)
│   ├── App.tsx
│   ├── pages/             # All app pages
│   └── components/        # Sidebar + header
├── website/               # Marketing site (Lovable/Vite/TanStack)
│   └── src/routes/        # landing, pricing, login, signup, about, blog, docs
├── supabase/migrations/   # DB schema migrations
└── .env                   # Supabase keys (pre-configured)
```

## Quick Start (Replit)

```bash
npm install
npm run dev
```

## Environment Variables

Already set in `.env`. To override:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/service key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
