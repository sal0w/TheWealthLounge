import { User, Product, Investment, PerformanceProjection, UserWithInvestments, InvestmentWithProduct } from './types'

export const users: User[] = [
    {
        id: "user-1",
        email: "john.doe@example.com",
        name: "John Doe",
        role: "normal_user"
    },
    {
        id: "user-2",
        email: "jane.smith@example.com",
        name: "Jane Smith",
        role: "normal_user"
    },
    {
        id: "super-1",
        email: "admin@example.com",
        name: "Admin User",
        role: "super_user"
    }
]

export const products: Product[] = [
    {
        id: "prod-1",
        category: "Loan Notes",
        investmentCompany: "Woodville"
    },
    {
        id: "prod-2",
        category: "Loan Notes",
        investmentCompany: "EIGHT Cloud"
    },
    {
        id: "prod-3",
        category: "REIT",
        investmentCompany: "Assisted Living Project"
    },
    {
        id: "prod-4",
        category: "Loan Notes and Profit Share",
        investmentCompany: "Acorn (St. Lenard's Quarter)"
    },
    {
        id: "prod-5",
        category: "Gold",
        investmentCompany: "3RT"
    },
    {
        id: "prod-6",
        category: "Gold",
        investmentCompany: "Omega Minerals"
    },
    {
        id: "prod-7",
        category: "Private Equity",
        investmentCompany: "Bricksave"
    },
    {
        id: "prod-8",
        category: "Private Equity",
        investmentCompany: "Precomb"
    }
]

export const investments: Investment[] = [
    {
        id: "inv-1",
        userId: "user-1",
        productId: "prod-1",
        amountInvested: 40000.00,
        currency: "USD",
        usdEquivalent: 40000.00,
        detailsOfInvestment: "Maturity May 2027 (2 years)",
        expectedYield: "10% per annum / paid quarterly",
        investmentType: "Lumpsum/Regular",
        investmentDate: "2025-05-01",
        maturityDate: "2027-05-01",
        status: "active",
        contractPdf: "https://example.com/contracts/woodville.pdf"
    },
    {
        id: "inv-2",
        userId: "user-1",
        productId: "prod-2",
        amountInvested: 25000.00,
        currency: "USD",
        usdEquivalent: 25000.00,
        detailsOfInvestment: "Maturity Feb 2026 (2 years)",
        expectedYield: "Pays 14% per annum semi annually",
        investmentType: "Lumpsum",
        investmentDate: "2024-02-01",
        maturityDate: "2026-02-01",
        status: "active",
        contractPdf: "https://example.com/contracts/eightcloud.pdf"
    },
    {
        id: "inv-3",
        userId: "user-1",
        productId: "prod-3",
        amountInvested: 25000.00,
        currency: "GBP",
        usdEquivalent: 33000.00,
        detailsOfInvestment: "Invested June 2025",
        expectedYield: "Dividends paid quarterly and exit via IPO/sale by 2028",
        investmentType: "Buy and Hold",
        investmentDate: "2025-06-01",
        maturityDate: null,
        status: "active",
        contractPdf: "https://example.com/contracts/assisted-living.pdf"
    },
    {
        id: "inv-4",
        userId: "user-1",
        productId: "prod-4",
        amountInvested: 14000.00,
        currency: "GBP",
        usdEquivalent: 18760.00,
        detailsOfInvestment: "Maturity October 2025 (3 years) - extended to October 2026",
        expectedYield: "17% per annum / paid at maturity",
        investmentType: "Lumpsum",
        investmentDate: "2023-10-01",
        maturityDate: "2026-10-01",
        status: "active",
        contractPdf: "https://example.com/contracts/acorn.pdf"
    },
    {
        id: "inv-5",
        userId: "user-1",
        productId: "prod-5",
        amountInvested: 33000.00,
        currency: "USD",
        usdEquivalent: 33000.00,
        detailsOfInvestment: "Buy-and-Hold to make gains from coin entering centralized platforms and NAV being linked to Canadian gold reserve",
        expectedYield: "Coin value expected to reach USD1.00 by approx. Q4 2025",
        investmentType: "Buy and Hold",
        investmentDate: "2024-01-15",
        maturityDate: null,
        status: "active",
        contractPdf: "https://example.com/contracts/3rt.pdf"
    },
    {
        id: "inv-6",
        userId: "user-1",
        productId: "prod-6",
        amountInvested: 27000.00,
        currency: "EUR",
        usdEquivalent: 30820.00,
        detailsOfInvestment: "2 year convertible loan note with bullet payment at 24 months",
        expectedYield: "22% bullet payment at 24 months. Conversion rate at £0.69",
        investmentType: "Lumpsum",
        investmentDate: "2024-06-01",
        maturityDate: "2026-06-01",
        status: "active",
        contractPdf: "https://example.com/contracts/omega.pdf"
    },
    {
        id: "inv-7",
        userId: "user-1",
        productId: "prod-7",
        amountInvested: 27000.00,
        currency: "GBP",
        usdEquivalent: 36180.00,
        detailsOfInvestment: "Buy and hold stake in private company, targeting an exit in 24 months from January 2024",
        expectedYield: "Expected exit value is 2.5 to 3x entry value.",
        investmentType: "Buy and Hold",
        investmentDate: "2024-01-01",
        maturityDate: "2026-01-01",
        status: "active",
        contractPdf: "https://example.com/contracts/bricksave.pdf"
    },
    {
        id: "inv-8",
        userId: "user-1",
        productId: "prod-8",
        amountInvested: 20000.00,
        currency: "EUR",
        usdEquivalent: 24500.00,
        detailsOfInvestment: "Anticipated exit approximately 2028",
        expectedYield: "Expected exit value is 4-5x entry value.",
        investmentType: "Buy and Hold",
        investmentDate: "2023-03-01",
        maturityDate: "2028-03-01",
        status: "active",
        contractPdf: "https://example.com/contracts/precomb.pdf"
    },
    {
        id: "inv-9",
        userId: "user-2",
        productId: "prod-1",
        amountInvested: 50000.00,
        currency: "USD",
        usdEquivalent: 50000.00,
        detailsOfInvestment: "Maturity May 2027 (2 years)",
        expectedYield: "10% per annum / paid quarterly",
        investmentType: "Lumpsum",
        investmentDate: "2025-05-01",
        maturityDate: "2027-05-01",
        status: "active",
        contractPdf: "https://example.com/contracts/woodville-2.pdf"
    },
    {
        id: "inv-10",
        userId: "user-2",
        productId: "prod-3",
        amountInvested: 30000.00,
        currency: "GBP",
        usdEquivalent: 39600.00,
        detailsOfInvestment: "Invested June 2025",
        expectedYield: "Dividends paid quarterly and exit via IPO/sale by 2028",
        investmentType: "Buy and Hold",
        investmentDate: "2025-06-01",
        maturityDate: null,
        status: "active",
        contractPdf: "https://example.com/contracts/assisted-living-2.pdf"
    }
]

export const performanceProjections: PerformanceProjection[] = [
    {
        id: "proj-1",
        investmentId: "inv-1",
        year: 2025,
        principalAmount: 0,
        yieldAmount: 2000.00,
        totalValue: 2000.00
    },
    {
        id: "proj-2",
        investmentId: "inv-1",
        year: 2026,
        principalAmount: 40000.00,
        yieldAmount: 4000.00,
        totalValue: 44000.00
    },
    {
        id: "proj-3",
        investmentId: "inv-1",
        year: 2027,
        principalAmount: 40000.00,
        yieldAmount: 6000.00,
        totalValue: 46000.00
    },
    {
        id: "proj-4",
        investmentId: "inv-2",
        year: 2025,
        principalAmount: 0,
        yieldAmount: 3500.00,
        totalValue: 3500.00
    },
    {
        id: "proj-5",
        investmentId: "inv-2",
        year: 2026,
        principalAmount: 25000.00,
        yieldAmount: 3500.00,
        totalValue: 28500.00
    },
    {
        id: "proj-6",
        investmentId: "inv-3",
        year: 2025,
        principalAmount: 0,
        yieldAmount: 1500.00,
        totalValue: 1500.00
    },
    {
        id: "proj-7",
        investmentId: "inv-3",
        year: 2026,
        principalAmount: 33000.00,
        yieldAmount: 0,
        totalValue: 33000.00
    },
    {
        id: "proj-8",
        investmentId: "inv-4",
        year: 2025,
        principalAmount: 0,
        yieldAmount: 0,
        totalValue: 0
    },
    {
        id: "proj-9",
        investmentId: "inv-4",
        year: 2026,
        principalAmount: 18760.00,
        yieldAmount: 7140.00,
        totalValue: 25900.00
    },
    {
        id: "proj-10",
        investmentId: "inv-5",
        year: 2025,
        principalAmount: 33000.00,
        yieldAmount: 0,
        totalValue: 33000.00
    },
    {
        id: "proj-11",
        investmentId: "inv-6",
        year: 2026,
        principalAmount: 30820.00,
        yieldAmount: 6780.00,
        totalValue: 37600.00
    },
    {
        id: "proj-12",
        investmentId: "inv-7",
        year: 2026,
        principalAmount: 36180.00,
        yieldAmount: 0,
        totalValue: 36180.00
    },
    {
        id: "proj-13",
        investmentId: "inv-8",
        year: 2028,
        principalAmount: 24500.00,
        yieldAmount: 0,
        totalValue: 24500.00
    },
    {
        id: "proj-14",
        investmentId: "inv-9",
        year: 2025,
        principalAmount: 0,
        yieldAmount: 2500.00,
        totalValue: 2500.00
    },
    {
        id: "proj-15",
        investmentId: "inv-9",
        year: 2026,
        principalAmount: 50000.00,
        yieldAmount: 5000.00,
        totalValue: 55000.00
    },
    {
        id: "proj-16",
        investmentId: "inv-9",
        year: 2027,
        principalAmount: 50000.00,
        yieldAmount: 7500.00,
        totalValue: 57500.00
    },
    {
        id: "proj-17",
        investmentId: "inv-10",
        year: 2025,
        principalAmount: 0,
        yieldAmount: 1800.00,
        totalValue: 1800.00
    },
    {
        id: "proj-18",
        investmentId: "inv-10",
        year: 2026,
        principalAmount: 39600.00,
        yieldAmount: 0,
        totalValue: 39600.00
    }
]
