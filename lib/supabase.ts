import { createClient } from '@supabase/supabase-js'

// Hardcoded for deployment testing - TODO: Replace with environment variables
const supabaseUrl = 'https://unlexdnlstwwrvtneqkb.supabase.co'
const supabaseAnonKey = 'sb_publishable__KfzZbysy3eF49Zj0faI5g_x3Ao1aTv'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
