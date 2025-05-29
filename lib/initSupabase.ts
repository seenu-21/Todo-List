import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://woparetenzhbbgvgxlvk.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvcGFyZXRlbnpoYmJndmd4bHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NDA3NzgsImV4cCI6MjA2NDAxNjc3OH0.KHr-EZthlNtaXYrE-3QJE5OQpgXVNbN8gU_Lm4Xwo9Q'
)
