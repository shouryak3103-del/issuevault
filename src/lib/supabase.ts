import { createClient } from '@supabase/supabase-js'

// Works in Vite (VITE_*), Next.js (NEXT_PUBLIC_*), or falls back to hardcoded
const SUPABASE_URL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  'https://keyeemsymgfwrzbqfwxk.supabase.co'

const SUPABASE_KEY =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && (process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env?.SUPABASE_SERVICE_ROLE_KEY)) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtleWVlbXN5bWdmd3J6YnFmd3hrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ2NjUzMywiZXhwIjoyMDkxMDQyNTMzfQ.1XgwQekSn6sztmrz4x3Xoxd-GeBLGY_U7Cbhyg5lXn4'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
export const supabaseAdmin = createClient(SUPABASE_URL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtleWVlbXN5bWdmd3J6YnFmd3hrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQ2NjUzMywiZXhwIjoyMDkxMDQyNTMzfQ.1XgwQekSn6sztmrz4x3Xoxd-GeBLGY_U7Cbhyg5lXn4')
export const SUPABASE_PROJECT_URL = 'https://keyeemsymgfwrzbqfwxk.supabase.co'
