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

export async function getProjectionsUpToYear(investmentId: string, year: number): Promise<PerformanceProjection[]> {
    const { data, error } = await supabase
        .from('performance_projections')
        .select('*')
        .eq('investment_id', investmentId)
        .lte('year', year)
        .order('year', { ascending: true })
    
    if (error) throw new Error(`Failed to fetch projections: ${error.message}`)
    return data.map(mapFromSupabase)
}
