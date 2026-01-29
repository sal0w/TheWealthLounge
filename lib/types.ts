export type UserRole = "normal_user" | "super_user"

export interface User {
    id: string
    email: string
    name: string
    role: UserRole
}

export interface Product {
    id: string
    category: string
    investmentCompany: string
}

export interface Investment {
    id: string
    userId: string
    productId: string
    amountInvested: number
    currency: string
    usdEquivalent: number
    detailsOfInvestment: string
    expectedYield: string
    investmentType: "Lumpsum" | "Buy and Hold" | "Lumpsum/Regular" | string
    investmentDate: string
    maturityDate: string | null
    status: "active" | "matured" | "terminated"
    contractPdf: string
}

export interface PerformanceProjection {
    id: string
    investmentId: string
    year: number
    principalAmount: number
    yieldAmount: number
    totalValue: number
}

// Aggregated types for UI display
export interface InvestmentWithProduct extends Investment {
    product: Product
    performanceHistory?: PerformanceProjection[]
}

export interface UserWithInvestments extends User {
    investments: InvestmentWithProduct[]
    totalInvestedUsd: number
    totalYieldUsd: number
}
