"use client"

/**
 * @deprecated This hook is deprecated. Use useInvestmentController from @/controllers instead.
 * 
 * This hook remains for backward compatibility but will be removed in future versions.
 * Please update your imports to:
 * import { useInvestmentController } from "@/controllers/investment.controller"
 * import { useAuth } from "@/lib/auth-context"
 * 
 * Usage:
 * const { user } = useAuth()
 * const controller = useInvestmentController(user)
 * 
 * The controller provides: investments, stats, loading, error, and CRUD methods.
 */

import { useAuth } from "@/lib/auth-context"
import { useInvestmentController } from "@/controllers/investment.controller"

export function useInvestments() {
    const { user } = useAuth()
    const controller = useInvestmentController(user)

    return {
        investments: controller.investments,
        loading: controller.loading,
        deleteInvestment: controller.deleteInvestmentById,
        addInvestment: controller.addInvestment,
        updateInvestment: controller.updateInvestmentById,
        getProjections: controller.getProjections,
    }
}
