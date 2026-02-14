import { z } from "zod"

// Zod Schema
export const performanceProjectionSchema = z.object({
    id: z.string(),
    investmentId: z.string(),
    year: z.number().int().min(2020).max(2100),
    principalAmount: z.number().nonnegative(),
    yieldAmount: z.number().nonnegative(),
    totalValue: z.number().nonnegative(),
})

// Types
export type PerformanceProjection = z.infer<typeof performanceProjectionSchema>

// Helper functions
export function calculateTotalValue(projection: PerformanceProjection): number {
    return projection.principalAmount + projection.yieldAmount
}

export function getProjectionsByYear(
    projections: PerformanceProjection[],
    year: number
): PerformanceProjection[] {
    return projections.filter(p => p.year === year)
}

export function getProjectionsByInvestmentId(
    projections: PerformanceProjection[],
    investmentId: string
): PerformanceProjection[] {
    return projections
        .filter(p => p.investmentId === investmentId)
        .sort((a, b) => a.year - b.year)
}

export function getYearsRange(projections: PerformanceProjection[]): { min: number; max: number } | null {
    if (projections.length === 0) return null

    const years = projections.map(p => p.year)
    return {
        min: Math.min(...years),
        max: Math.max(...years),
    }
}
