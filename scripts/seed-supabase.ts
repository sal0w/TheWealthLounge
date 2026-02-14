/**
 * Seed Supabase Database with Mock Data
 * 
 * This script populates your Supabase database with the mock data
 * from lib/mock-data.ts
 * 
 * Usage:
 * 1. Make sure you have .env.local with your Supabase credentials
 * 2. Run: npx tsx scripts/seed-supabase.ts
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { users, products, investments, performanceProjections } from '../lib/mock-data'

// Load .env.local file
config({ path: '.env.local' })

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY! // Use service key for seeding

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env.local')
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedDatabase() {
    console.log('🌱 Starting database seed...\n')

    try {
        // 1. Seed Users
        console.log('📝 Inserting users...')
        const { error: usersError } = await supabase
            .from('users')
            .upsert(users.map(user => ({
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            })), { onConflict: 'email' })

        if (usersError) {
            console.error('❌ Error inserting users:', usersError)
        } else {
            console.log(`✅ Inserted ${users.length} users`)
        }

        // 2. Seed Products
        console.log('📝 Inserting products...')
        const { error: productsError } = await supabase
            .from('products')
            .upsert(products.map(product => ({
                id: product.id,
                category: product.category,
                investment_company: product.investmentCompany
            })))

        if (productsError) {
            console.error('❌ Error inserting products:', productsError)
        } else {
            console.log(`✅ Inserted ${products.length} products`)
        }

        // 3. Seed Investments
        console.log('📝 Inserting investments...')
        const { error: investmentsError } = await supabase
            .from('investments')
            .upsert(investments.map(inv => ({
                id: inv.id,
                user_id: inv.userId,
                product_id: inv.productId,
                amount_invested: inv.amountInvested,
                currency: inv.currency,
                usd_equivalent: inv.usdEquivalent,
                details_of_investment: inv.detailsOfInvestment,
                expected_yield: inv.expectedYield,
                investment_type: inv.investmentType,
                investment_date: inv.investmentDate,
                maturity_date: inv.maturityDate,
                status: inv.status,
                contract_pdf: inv.contractPdf
            })))

        if (investmentsError) {
            console.error('❌ Error inserting investments:', investmentsError)
        } else {
            console.log(`✅ Inserted ${investments.length} investments`)
        }

        // 4. Seed Performance Projections
        console.log('📝 Inserting performance projections...')
        const { error: projectionsError } = await supabase
            .from('performance_projections')
            .upsert(performanceProjections.map(proj => ({
                id: proj.id,
                investment_id: proj.investmentId,
                year: proj.year,
                principal_amount: proj.principalAmount,
                yield_amount: proj.yieldAmount,
                total_value: proj.totalValue
            })), { onConflict: 'investment_id,year' })

        if (projectionsError) {
            console.error('❌ Error inserting projections:', projectionsError)
        } else {
            console.log(`✅ Inserted ${performanceProjections.length} projections`)
        }

        console.log('\n✨ Database seeding completed successfully!')
        console.log('\n📊 Summary:')
        console.log(`   - ${users.length} users`)
        console.log(`   - ${products.length} products`)
        console.log(`   - ${investments.length} investments`)
        console.log(`   - ${performanceProjections.length} performance projections`)

    } catch (error) {
        console.error('❌ Unexpected error during seeding:', error)
        process.exit(1)
    }
}

// Run the seeding
seedDatabase()
