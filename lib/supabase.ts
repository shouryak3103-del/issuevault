import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://keyeemsymgfwrzbqfwxk.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtleWVlbXN5bWdmd3J6YnFmd3hrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ2NjUzMywiZXhwIjoyMDkxMDQyNTMzfQ.1XgwQekSn6sztmrz4x3Xoxd-GeBLGY_U7Cbhyg5lXn4'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtleWVlbXN5bWdmd3J6YnFmd3hrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ2NjUzMywiZXhwIjoyMDkxMDQyNTMzfQ.1XgwQekSn6sztmrz4x3Xoxd-GeBLGY_U7Cbhyg5lXn4'

// Client-side supabase (use in React components and client components)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Server-side admin client (use in API routes and server actions only)
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})
