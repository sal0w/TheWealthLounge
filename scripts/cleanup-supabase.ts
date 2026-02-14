/**
 * Clean up and Re-seed Database
 * 
 * This script removes old data and creates fresh data with proper auth user IDs
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
})

async function cleanup() {
    console.log('🧹 Cleaning up existing data...\n')

    // Delete in order: projections -> investments -> products -> users
    console.log('Deleting performance projections...')
    await supabase.from('performance_projections').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    console.log('Deleting investments...')
    await supabase.from('investments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    console.log('Deleting products...')
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    console.log('Deleting users (database table)...')
    await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    console.log('✅ Cleanup complete!\n')
}

cleanup()
