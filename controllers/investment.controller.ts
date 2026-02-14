"use client"

import { useState, useEffect, useCallback } from "react"
import {
    Investment,
    InvestmentWithProduct,
    enrichInvestmentWithProduct,
    calculateTotalInvestedUsd,
    calculateCategoryTotals,
} from "@/models/investment.model"
import { User } from "@/models/user.model"
import {
    getAllInvestments,
    getInvestmentsByUserId,
    createInvestment,
    updateInvestment,
    deleteInvestment,
} from "@/services/investment.service"
import { getAllProducts, getProductById } from "@/services/product.service"
import {
    getProjectionsByInvestmentId,
    getProjectionsUpToYear,
} from "@/services/performance-projection.service"

/**
 * Investment Controller - Business logic layer for investments
 * 
 * This controller manages investment operations, enrichment with related data,
 * and derived calculations for the UI.
 */

export interface InvestmentStats {
    totalInvestedUsd: number
    totalExpectedYield: number
    investmentCount: number
    categoryBreakdown: Array<{ category: string; totalUsd: number; count: number }>
}

export interface InvestmentController {
    investments: InvestmentWithProduct[]
    stats: InvestmentStats | null
    loading: boolean
    error: string | null

    // CRUD operations
    addInvestment: (investment: Omit<Investment, "id">) => Promise<void>
    updateInvestmentById: (id: string, updates: Partial<Investment>) => Promise<void>
    deleteInvestmentById: (id: string) => Promise<void>

    // Utility
    getProjections: (investmentId: string) => Promise<any[]>
    refreshInvestments: () => Promise<void>
}

/**
 * Investment controller hook
 * 
 * @param user - Current authenticated user (determines which investments to load)
 * @returns InvestmentController object with data, stats, and methods
 */
export function useInvestmentController(user: User | null): InvestmentController {
    const [investments, setInvestments] = useState<InvestmentWithProduct[]>([])
    const [stats, setStats] = useState<InvestmentStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    /**
     * Fetch and enrich investments with product and projection data
     */
    const fetchInvestments = useCallback(async () => {
        if (!user) {
            setInvestments([])
            setStats(null)
            setLoading(false)
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Fetch data from services
            let rawInvestments: Investment[]

            if (user.role === "super_user") {
                rawInvestments = await getAllInvestments()
            } else {
                rawInvestments = await getInvestmentsByUserId(user.id)
            }

            // Fetch all products for enrichment
            const products = await getAllProducts()
            const productMap = new Map(products.map(p => [p.id, p]))

            // Current year for projections (using 2026 as demo year based on mock data)
            const currentYear = 2026

            // Enrich investments with product and projection data
            const enrichedInvestments = await Promise.all(
                rawInvestments.map(async (investment) => {
                    const product = productMap.get(investment.productId)

                    if (!product) {
                        console.warn(`Product not found for investment ${investment.id}`)
                        throw new Error(`Product not found for investment ${investment.id}`)
                    }

                    // Fetch performance history up to current year
                    const performanceHistory = await getProjectionsUpToYear(
                        investment.id,
                        currentYear
                    )

                    return enrichInvestmentWithProduct(investment, product, performanceHistory)
                })
            )

            // Calculate statistics
            const totalInvestedUsd = calculateTotalInvestedUsd(enrichedInvestments)

            // Calculate total expected yield from projections
            // This is a simplified calculation - in reality, you'd want more sophisticated logic
            const totalExpectedYield = enrichedInvestments.reduce((sum, inv) => {
                if (!inv.performanceHistory || inv.performanceHistory.length === 0) return sum

                // Get the most recent projection's yield
                const latestProjection = inv.performanceHistory[inv.performanceHistory.length - 1]
                return sum + latestProjection.yieldAmount
            }, 0)

            const categoryBreakdown = calculateCategoryTotals(enrichedInvestments)

            setInvestments(enrichedInvestments)
            setStats({
                totalInvestedUsd,
                totalExpectedYield,
                investmentCount: enrichedInvestments.length,
                categoryBreakdown,
            })
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to fetch investments"
            setError(errorMessage)
            console.error("Error fetching investments:", err)
        } finally {
            setLoading(false)
        }
    }, [user])

    // Fetch investments when user changes
    useEffect(() => {
        fetchInvestments()
    }, [fetchInvestments])

    /**
     * Add a new investment
     */
    const addInvestment = useCallback(async (investment: Omit<Investment, "id">) => {
        setError(null)

        try {
            await createInvestment(investment)
            await fetchInvestments() // Refresh list
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to create investment"
            setError(errorMessage)
            throw err
        }
    }, [fetchInvestments])

    /**
     * Update an existing investment
     */
    const updateInvestmentById = useCallback(async (id: string, updates: Partial<Investment>) => {
        setError(null)

        try {
            await updateInvestment(id, updates)
            await fetchInvestments() // Refresh list
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to update investment"
            setError(errorMessage)
            throw err
        }
    }, [fetchInvestments])

    /**
     * Delete an investment
     */
    const deleteInvestmentById = useCallback(async (id: string) => {
        setError(null)

        try {
            await deleteInvestment(id)
            await fetchInvestments() // Refresh list
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to delete investment"
            setError(errorMessage)
            throw err
        }
    }, [fetchInvestments])

    /**
     * Get projections for a specific investment
     */
    const getProjections = useCallback(async (investmentId: string) => {
        return await getProjectionsByInvestmentId(investmentId)
    }, [])

    /**
     * Manually refresh investments
     */
    const refreshInvestments = useCallback(async () => {
        await fetchInvestments()
    }, [fetchInvestments])

    return {
        investments,
        stats,
        loading,
        error,
        addInvestment,
        updateInvestmentById,
        deleteInvestmentById,
        getProjections,
        refreshInvestments,
    }
}
