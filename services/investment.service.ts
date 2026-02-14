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
