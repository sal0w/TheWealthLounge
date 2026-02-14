#!/bin/bash

# Update all services to use Supabase

# User Service
cat > services/user.service.ts << 'EOF'
import { User, userSchema } from "@/models/user.model"
import { supabase } from "@/lib/supabase"

export async function getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase.from('users').select('*')
    if (error) throw new Error(`Failed to fetch users: ${error.message}`)
    return data.map(u => userSchema.parse(u))
}

export async function getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single()
    if (error && error.code !== 'PGRST116') throw new Error(`Failed to fetch user: ${error.message}`)
    return data ? userSchema.parse(data) : null
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).single()
    if (error && error.code !== 'PGRST116') throw new Error(`Failed to fetch user: ${error.message}`)
    return data ? userSchema.parse(data) : null
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
        console.error('Authentication error:', error.message)
        return null
    }
    return getUserById(data.user.id)
}

export async function getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    return getUserById(user.id)
}

export async function signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(`Failed to sign out: ${error.message}`)
}
EOF

# Product Service
cat > services/product.service.ts << 'EOF'
import { Product, productSchema } from "@/models/product.model"
import { supabase } from "@/lib/supabase"

export async function getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase.from('products').select('*')
    if (error) throw new Error(`Failed to fetch products: ${error.message}`)
    return data.map(p => productSchema.parse({ id: p.id, category: p.category, investmentCompany: p.investment_company }))
}

export async function getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
    if (error && error.code !== 'PGRST116') throw new Error(`Failed to fetch product: ${error.message}`)
    return data ? productSchema.parse({ id: data.id, category: data.category, investmentCompany: data.investment_company }) : null
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase.from('products').select('*').eq('category', category)
    if (error) throw new Error(`Failed to fetch products: ${error.message}`)
    return data.map(p => productSchema.parse({ id: p.id, category: p.category, investmentCompany: p.investment_company }))
}
EOF

# Investment Service
cat > services/investment.service.ts << 'EOF'
import { Investment, investmentSchema } from "@/models/investment.model"
import { supabase } from "@/lib/supabase"

function mapFromSupabase(data: any): Investment {
    return investmentSchema.parse({
        id: data.id,
        userId: data.user_id,
        productId: data.product_id,
        amountInvested: data.amount_invested,
        currency: data.currency,
        usdEquivalent: data.usd_equivalent,
        detailsOfInvestment: data.details_of_investment,
        expectedYield: data.expected_yield,
        investmentType: data.investment_type,
        investmentDate: data.investment_date,
        maturityDate: data.maturity_date,
        status: data.status,
        contractPdf: data.contract_pdf
    })
}

export async function getAllInvestments(): Promise<Investment[]> {
    const { data, error } = await supabase.from('investments').select('*')
    if (error) throw new Error(`Failed to fetch investments: ${error.message}`)
    return data.map(mapFromSupabase)
}

export async function getInvestmentsByUserId(userId: string): Promise<Investment[]> {
    const { data, error } = await supabase.from('investments').select('*').eq('user_id', userId)
    if (error) throw new Error(`Failed to fetch investments: ${error.message}`)
    return data.map(mapFromSupabase)
}

export async function getInvestmentById(id: string): Promise<Investment | null> {
    const { data, error } = await supabase.from('investments').select('*').eq('id', id).single()
    if (error && error.code !== 'PGRST116') throw new Error(`Failed to fetch investment: ${error.message}`)
    return data ? mapFromSupabase(data) : null
}

export async function createInvestment(investment: Omit<Investment, 'id'>): Promise<Investment> {
    const { data, error } = await supabase.from('investments').insert({
        user_id: investment.userId,
        product_id: investment.productId,
        amount_invested: investment.amountInvested,
        currency: investment.currency,
        usd_equivalent: investment.usdEquivalent,
        details_of_investment: investment.detailsOfInvestment,
        expected_yield: investment.expectedYield,
        investment_type: investment.investmentType,
        investment_date: investment.investmentDate,
        maturity_date: investment.maturityDate,
        status: investment.status,
        contract_pdf: investment.contractPdf
    }).select().single()
    
    if (error) throw new Error(`Failed to create investment: ${error.message}`)
    return mapFromSupabase(data)
}

export async function updateInvestment(id: string, updates: Partial<Investment>): Promise<Investment> {
    const updateData: any = {}
    if (updates.userId) updateData.user_id = updates.userId
    if (updates.productId) updateData.product_id = updates.productId
    if (updates.amountInvested) updateData.amount_invested = updates.amountInvested
    if (updates.currency) updateData.currency = updates.currency
    if (updates.usdEquivalent) updateData.usd_equivalent = updates.usdEquivalent
    if (updates.detailsOfInvestment) updateData.details_of_investment = updates.detailsOfInvestment
    if (updates.expectedYield) updateData.expected_yield = updates.expectedYield
    if (updates.investmentType) updateData.investment_type = updates.investmentType
    if (updates.investmentDate) updateData.investment_date = updates.investmentDate
    if (updates.maturityDate !== undefined) updateData.maturity_date = updates.maturityDate
    if (updates.status) updateData.status = updates.status
    if (updates.contractPdf) updateData.contract_pdf = updates.contractPdf
    
    const { data, error } = await supabase.from('investments').update(updateData).eq('id', id).select().single()
    if (error) throw new Error(`Failed to update investment: ${error.message}`)
    return mapFromSupabase(data)
}

export async function deleteInvestment(id: string): Promise<void> {
    const { error } = await supabase.from('investments').delete().eq('id', id)
    if (error) throw new Error(`Failed to delete investment: ${error.message}`)
}
EOF

# Performance Projection Service
cat > services/performance-projection.service.ts << 'EOF'
import { PerformanceProjection, performanceProjectionSchema } from "@/models/performance-projection.model"
import { supabase } from "@/lib/supabase"

function mapFromSupabase(data: any): PerformanceProjection {
    return performanceProjectionSchema.parse({
        id: data.id,
        investmentId: data.investment_id,
        year: data.year,
        principalAmount: data.principal_amount,
        yieldAmount: data.yield_amount,
        totalValue: data.total_value
    })
}

export async function getAllProjections(): Promise<PerformanceProjection[]> {
    const { data, error } = await supabase.from('performance_projections').select('*')
    if (error) throw new Error(`Failed to fetch projections: ${error.message}`)
    return data.map(mapFromSupabase)
}

export async function getProjectionsByInvestmentId(investmentId: string): Promise<PerformanceProjection[]> {
    const { data, error } = await supabase
        .from('performance_projections')
        .select('*')
        .eq('investment_id', investmentId)
        .order('year', { ascending: true })
    
    if (error) throw new Error(`Failed to fetch projections: ${error.message}`)
    return data.map(mapFromSupabase)
}

export async function getProjectionsByYear(year: number): Promise<PerformanceProjection[]> {
    const { data, error } = await supabase
        .from('performance_projections')
        .select('*')
        .eq('year', year)
    
    if (error) throw new Error(`Failed to fetch projections: ${error.message}`)
    return data.map(mapFromSupabase)
}

export async function getLatestProjectionForInvestment(investmentId: string): Promise<PerformanceProjection | null> {
    const { data, error } = await supabase
        .from('performance_projections')
        .select('*')
        .eq('investment_id', investmentId)
        .order('year', { ascending: false })
        .limit(1)
        .single()
    
    if (error && error.code !== 'PGRST116') throw new Error(`Failed to fetch projection: ${error.message}`)
    return data ? mapFromSupabase(data) : null
}
EOF

echo "✅ All services updated to use Supabase"
