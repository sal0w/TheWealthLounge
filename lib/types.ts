/**
 * @deprecated This file is deprecated. Import types directly from @/models instead.
 * 
 * This file remains for backward compatibility but will be removed in future versions.
 * Please update your imports to use:
 * - import { User, UserRole } from "@/models/user.model"
 * - import { Product } from "@/models/product.model"  
 * - import { Investment, InvestmentWithProduct } from "@/models/investment.model"
 * - import { PerformanceProjection } from "@/models/performance-projection.model"
 */

// Re-export types from models for backward compatibility
export type {
    User,
    UserRole,
} from "@/models/user.model"

export type {
    Product,
} from "@/models/product.model"

export type {
    Investment,
    InvestmentType,
    InvestmentStatus,
    InvestmentWithProduct,
} from "@/models/investment.model"

export type {
    PerformanceProjection,
} from "@/models/performance-projection.model"

// Import for local use
import type { InvestmentWithProduct } from "@/models/investment.model"

// Legacy aggregated type
export interface UserWithInvestments {
    id: string
    email: string
    name: string
    role: "normal_user" | "super_user"
    investments: InvestmentWithProduct[]
    totalInvestedUsd: number
    totalYieldUsd: number
}
