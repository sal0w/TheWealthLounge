/**
 * Create Supabase Auth Users with Mock Data
 * 
 * This script creates actual authentication users in Supabase Auth
 * and then populates the database with related data.
 * 
 * Usage:
 * 1. Add SUPABASE_SERVICE_KEY to .env.local
 * 2. Run: npx tsx scripts/seed-supabase-with-auth.ts
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load .env.local file
config({ path: '.env.local' })

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY! // Service role key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env.local')
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY')
    process.exit(1)
}

// Create admin client with service key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

// Define users to create
const authUsers = [
    {
        email: 'salowstudios@gmail.com',
        password: 'password',
        name: 'John Doe',
        role: 'normal_user'
    },
    {
        email: 'jane.smith@example.com',
        password: 'password',
        name: 'Jane Smith',
        role: 'normal_user'
    },
    {
        email: 'admin@example.com',
        password: 'admin',
        name: 'Admin User',
        role: 'super_user'
    }
]

// Product UUIDs
const productIds: Record<string, string> = {
    'Woodville': '650e8400-e29b-41d4-a716-446655440001',
    'EIGHT Cloud': '650e8400-e29b-41d4-a716-446655440002',
    'Assisted Living Project': '650e8400-e29b-41d4-a716-446655440003',
    'Acorn (St. Lenard\'s Quarter)': '650e8400-e29b-41d4-a716-446655440004',
    '3RT': '650e8400-e29b-41d4-a716-446655440005',
    'Omega Minerals': '650e8400-e29b-41d4-a716-446655440006',
    'Bricksave': '650e8400-e29b-41d4-a716-446655440007',
    'Precomb': '650e8400-e29b-41d4-a716-446655440008'
}

async function seedDatabase() {
    console.log('🌱 Starting database seed with authentication...\n')

    const createdUserIds: Record<string, string> = {}

    try {
        // 1. Get or Create Auth Users
        console.log('👤 Getting/Creating authentication users...')
        
        // Get all existing users first
        const { data: allUsers } = await supabase.auth.admin.listUsers()
        
        for (const user of authUsers) {
            const userExists = allUsers?.users.find(u => u.email === user.email)

            if (userExists) {
                console.log(`   ✓ ${user.email} exists (ID: ${userExists.id.substring(0, 8)}...)`)
                createdUserIds[user.email] = userExists.id
                
                // Ensure users table entry exists
                const { error: upsertError } = await supabase
                    .from('users')
                    .upsert({
                        id: userExists.id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    }, { onConflict: 'id' })

                if (upsertError) {
                    console.error(`   ❌ Error upserting user:`, upsertError.message)
                }
            } else {
                // Create new user
                const { data, error } = await supabase.auth.admin.createUser({
                    email: user.email,
                    password: user.password,
                    email_confirm: true,
                    user_metadata: {
                        name: user.name
                    }
                })

                if (error) {
                    console.error(`   ❌ Error creating ${user.email}:`, error.message)
                    continue
                }

                console.log(`   ✅ Created ${user.email} (password: ${user.password})`)
                createdUserIds[user.email] = data.user.id
                
                // Insert into public.users table
                const { error: insertError } = await supabase
                    .from('users')
                    .insert({
                        id: data.user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    })

                if (insertError) {
                    console.error(`   ❌ Error inserting user data:`, insertError.message)
                }
            }
        }

        const johnId = createdUserIds['salowstudios@gmail.com']
        const janeId = createdUserIds['jane.smith@example.com']

        // 2. Seed Products
        console.log('\n📦 Inserting products...')
        const products = [
            { id: productIds['Woodville'], category: 'Loan Notes', company: 'Woodville' },
            { id: productIds['EIGHT Cloud'], category: 'Loan Notes', company: 'EIGHT Cloud' },
            { id: productIds['Assisted Living Project'], category: 'REIT', company: 'Assisted Living Project' },
            { id: productIds['Acorn (St. Lenard\'s Quarter)'], category: 'Loan Notes and Profit Share', company: 'Acorn (St. Lenard\'s Quarter)' },
            { id: productIds['3RT'], category: 'Gold', company: '3RT' },
            { id: productIds['Omega Minerals'], category: 'Gold', company: 'Omega Minerals' },
            { id: productIds['Bricksave'], category: 'Private Equity', company: 'Bricksave' },
            { id: productIds['Precomb'], category: 'Private Equity', company: 'Precomb' }
        ]

        const { error: productsError } = await supabase
            .from('products')
            .upsert(products.map(p => ({
                id: p.id,
                category: p.category,
                investment_company: p.company
            })))

        if (productsError) {
            console.error('❌ Error inserting products:', productsError.message)
        } else {
            console.log(`✅ Inserted ${products.length} products`)
        }

        // 3. Seed Investments
        console.log('\n💰 Inserting investments...')
        const investments = [
            // John's investments
            { userId: johnId, productId: productIds['Woodville'], amount: 40000, currency: 'USD', usd: 40000, details: 'Maturity May 2027 (2 years)', yield: '10% per annum / paid quarterly', type: 'Lumpsum/Regular', date: '2025-05-01', maturity: '2027-05-01' },
            { userId: johnId, productId: productIds['EIGHT Cloud'], amount: 25000, currency: 'USD', usd: 25000, details: 'Maturity Feb 2026 (2 years)', yield: 'Pays 14% per annum semi annually', type: 'Lumpsum', date: '2024-02-01', maturity: '2026-02-01' },
            { userId: johnId, productId: productIds['Assisted Living Project'], amount: 25000, currency: 'GBP', usd: 33000, details: 'Invested June 2025', yield: 'Dividends paid quarterly and exit via IPO/sale by 2028', type: 'Buy and Hold', date: '2025-06-01', maturity: null },
            { userId: johnId, productId: productIds['Acorn (St. Lenard\'s Quarter)'], amount: 14000, currency: 'GBP', usd: 18760, details: 'Maturity October 2025 (3 years) - extended to October 2026', yield: '17% per annum / paid at maturity', type: 'Lumpsum', date: '2023-10-01', maturity: '2026-10-01' },
            { userId: johnId, productId: productIds['3RT'], amount: 33000, currency: 'USD', usd: 33000, details: 'Buy-and-Hold to make gains from coin entering centralized platforms', yield: 'Coin value expected to reach USD1.00 by approx. Q4 2025', type: 'Buy and Hold', date: '2024-01-15', maturity: null },
            { userId: johnId, productId: productIds['Omega Minerals'], amount: 27000, currency: 'EUR', usd: 30820, details: '2 year convertible loan note with bullet payment at 24 months', yield: '22% bullet payment at 24 months', type: 'Lumpsum', date: '2024-06-01', maturity: '2026-06-01' },
            { userId: johnId, productId: productIds['Bricksave'], amount: 27000, currency: 'GBP', usd: 36180, details: 'Buy and hold stake in private company, targeting an exit in 24 months', yield: 'Expected exit value is 2.5 to 3x entry value', type: 'Buy and Hold', date: '2024-01-01', maturity: '2026-01-01' },
            { userId: johnId, productId: productIds['Precomb'], amount: 20000, currency: 'EUR', usd: 24500, details: 'Anticipated exit approximately 2028', yield: 'Expected exit value is 4-5x entry value', type: 'Buy and Hold', date: '2023-03-01', maturity: '2028-03-01' },
            // Jane's investments
            { userId: janeId, productId: productIds['Woodville'], amount: 50000, currency: 'USD', usd: 50000, details: 'Maturity May 2027 (2 years)', yield: '10% per annum / paid quarterly', type: 'Lumpsum', date: '2025-05-01', maturity: '2027-05-01' },
            { userId: janeId, productId: productIds['Assisted Living Project'], amount: 30000, currency: 'GBP', usd: 39600, details: 'Invested June 2025', yield: 'Dividends paid quarterly and exit via IPO/sale by 2028', type: 'Buy and Hold', date: '2025-06-01', maturity: null }
        ]

        const { data: insertedInvestments, error: investmentsError } = await supabase
            .from('investments')
            .insert(investments.map(inv => ({
                user_id: inv.userId,
                product_id: inv.productId,
                amount_invested: inv.amount,
                currency: inv.currency,
                usd_equivalent: inv.usd,
                details_of_investment: inv.details,
                expected_yield: inv.yield,
                investment_type: inv.type,
                investment_date: inv.date,
                maturity_date: inv.maturity,
                status: 'active',
                contract_pdf: `https://example.com/contracts/${inv.productId}.pdf`
            })))
            .select()

        if (investmentsError) {
            console.error('❌ Error inserting investments:', investmentsError.message)
        } else {
            console.log(`✅ Inserted ${investments.length} investments`)

            // 4. Seed Performance Projections
            if (insertedInvestments && insertedInvestments.length > 0) {
                console.log('\n📈 Inserting performance projections...')
                const projections = [
                    // Investment 1 projections
                    { investmentId: insertedInvestments[0].id, year: 2025, principal: 0, yield: 2000, total: 2000 },
                    { investmentId: insertedInvestments[0].id, year: 2026, principal: 40000, yield: 4000, total: 44000 },
                    { investmentId: insertedInvestments[0].id, year: 2027, principal: 40000, yield: 6000, total: 46000 },
                    // Investment 2 projections
                    { investmentId: insertedInvestments[1].id, year: 2025, principal: 0, yield: 3500, total: 3500 },
                    { investmentId: insertedInvestments[1].id, year: 2026, principal: 25000, yield: 3500, total: 28500 },
                    // Investment 3 projections
                    { investmentId: insertedInvestments[2].id, year: 2025, principal: 0, yield: 1500, total: 1500 },
                    { investmentId: insertedInvestments[2].id, year: 2026, principal: 33000, yield: 0, total: 33000 },
                    // Investment 4 projections
                    { investmentId: insertedInvestments[3].id, year: 2025, principal: 0, yield: 0, total: 0 },
                    { investmentId: insertedInvestments[3].id, year: 2026, principal: 18760, yield: 7140, total: 25900 },
                    // Investment 5 projections
                    { investmentId: insertedInvestments[4].id, year: 2025, principal: 33000, yield: 0, total: 33000 },
                    // Investment 6 projections
                    { investmentId: insertedInvestments[5].id, year: 2026, principal: 30820, yield: 6780, total: 37600 },
                    // Investment 7 projections
                    { investmentId: insertedInvestments[6].id, year: 2026, principal: 36180, yield: 0, total: 36180 },
                    // Investment 8 projections
                    { investmentId: insertedInvestments[7].id, year: 2028, principal: 24500, yield: 0, total: 24500 },
                    // Investment 9 projections
                    { investmentId: insertedInvestments[8].id, year: 2025, principal: 0, yield: 2500, total: 2500 },
                    { investmentId: insertedInvestments[8].id, year: 2026, principal: 50000, yield: 5000, total: 55000 },
                    { investmentId: insertedInvestments[8].id, year: 2027, principal: 50000, yield: 7500, total: 57500 },
                    // Investment 10 projections
                    { investmentId: insertedInvestments[9].id, year: 2025, principal: 0, yield: 1800, total: 1800 },
                    { investmentId: insertedInvestments[9].id, year: 2026, principal: 39600, yield: 0, total: 39600 }
                ]

                const { error: projectionsError } = await supabase
                    .from('performance_projections')
                    .insert(projections.map(proj => ({
                        investment_id: proj.investmentId,
                        year: proj.year,
                        principal_amount: proj.principal,
                        yield_amount: proj.yield,
                        total_value: proj.total
                    })))

                if (projectionsError) {
                    console.error('❌ Error inserting projections:', projectionsError.message)
                } else {
                    console.log(`✅ Inserted ${projections.length} projections`)
                }
            }
        }

        console.log('\n✨ Database seeding completed successfully!')
        console.log('\n📊 Summary:')
        console.log(`   - ${authUsers.length} auth users`)
        console.log(`   - ${products.length} products`)
        console.log(`   - ${investments.length} investments`)
        console.log('\n🔑 Login Credentials:')
        authUsers.forEach(user => {
            console.log(`   - ${user.email} / ${user.password}`)
        })

    } catch (error) {
        console.error('❌ Unexpected error during seeding:', error)
        process.exit(1)
    }
}

// Run the seeding
seedDatabase()
