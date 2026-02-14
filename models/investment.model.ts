import { z } from "zod"
import { Product, productSchema } from "./product.model"
import { PerformanceProjection, performanceProjectionSchema } from "./performance-projection.model"

// Zod Schema
export const investmentTypeSchema = z.enum(["Lumpsum", "Buy and Hold", "Lumpsum/Regular"])

export const investmentStatusSchema = z.enum(["active", "matured", "terminated"])

export const investmentSchema = z.object({
    id: z.string(),
    userId: z.string(),
    productId: z.string(),
    amountInvested: z.number().positive(),
    currency: z.string().length(3), // ISO 4217 currency codes (USD, EUR, GBP, etc.)
    usdEquivalent: z.number().positive(),
    detailsOfInvestment: z.string(),
    expectedYield: z.string(),
    investmentType: z.union([investmentTypeSchema, z.string()]), // Allow custom types too
    investmentDate: z.string(), // ISO date string
    maturityDate: z.string().nullable(),
    status: investmentStatusSchema,
    contractPdf: z.string().url(),
})

// Types
export type InvestmentType = z.infer<typeof investmentTypeSchema>
export type InvestmentStatus = z.infer<typeof investmentStatusSchema>
export type Investment = z.infer<typeof investmentSchema>

// Aggregated types for UI display
export interface InvestmentWithProduct extends Investment {
    product: Product
    performanceHistory?: PerformanceProjection[]
}

// Extended validation schemas
export const investmentWithProductSchema = investmentSchema.extend({
    product: productSchema,
    performanceHistory: z.array(performanceProjectionSchema).optional(),
})

// Helper functions
export function calculateTotalInvestedUsd(investments: Investment[]): number {
    return investments.reduce((sum, inv) => sum + inv.usdEquivalent, 0)
}

export function getInvestmentsByUserId(investments: Investment[], userId: string): Investment[] {
    return investments.filter(inv => inv.userId === userId)
}

export function getActiveInvestments(investments: Investment[]): Investment[] {
    return investments.filter(inv => inv.status === "active")
}

export function getInvestmentsByCurrency(investments: Investment[], currency: string): Investment[] {
    return investments.filter(inv => inv.currency === currency)
}

export function getInvestmentsByCategory(
    investments: InvestmentWithProduct[],
    category: string
): InvestmentWithProduct[] {
    return investments.filter(inv => inv.product.category === category)
}

export function groupInvestmentsByCategory(
    investments: InvestmentWithProduct[]
): Record<string, InvestmentWithProduct[]> {
    return investments.reduce((acc, inv) => {
        const category = inv.product.category
        if (!acc[category]) {
            acc[category] = []
        }
        acc[category].push(inv)
        return acc
    }, {} as Record<string, InvestmentWithProduct[]>)
}

export function calculateCategoryTotals(
    investments: InvestmentWithProduct[]
): Array<{ category: string; totalUsd: number; count: number }> {
    const grouped = groupInvestmentsByCategory(investments)

    return Object.entries(grouped).map(([category, invs]) => ({
        category,
        totalUsd: calculateTotalInvestedUsd(invs),
        count: invs.length,
    }))
}

export function enrichInvestmentWithProduct(
    investment: Investment,
    product: Product,
    performanceHistory?: PerformanceProjection[]
): InvestmentWithProduct {
    return {
        ...investment,
        product,
        performanceHistory,
    }
}
