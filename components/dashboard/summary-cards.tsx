"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InvestmentWithProduct } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { DollarSign, TrendingUp, Wallet, PieChart } from "lucide-react"

interface SummaryCardsProps {
    investments: InvestmentWithProduct[]
}

export function SummaryCards({ investments }: SummaryCardsProps) {

    // Calculate totals
    const totalInvested = investments.reduce((sum, inv) => sum + inv.usdEquivalent, 0)

    // Estimate yield - simpler logic for mock: sum up amounts contained in "totalValue" projections if needed,
    // or just use a mock calculation based on a static rate for demonstration if yield data is string.
    // The interface says `expectedYield` is string. `PerformanceProjection` has yieldAmount.
    // Let's use a rough Sum for now based on the mock projections if possible, 
    // or just sum `amountInvested` * 0.1 for demo purposes if projections aren't passed here.
    // Since we only have `investments` prop here, let's stick to what we have.
    // We'll calculate "Active Investments" count.

    const activeCount = investments.filter(i => i.status === 'active').length

    // Mock total yield for display (e.g. 12% of total invested)
    const totalExpectedYield = totalInvested * 0.12

    const stats = [
        {
            title: "Total Invested Value (USD)",
            value: formatCurrency(totalInvested),
            icon: DollarSign,
            desc: "Across all active assets",
            color: "text-emerald-500"
        },
        {
            title: "Proj. Annual Yield",
            value: formatCurrency(totalExpectedYield),
            icon: TrendingUp,
            desc: "~12% Avg. Return",
            color: "text-amber-500"
        },
        {
            title: "Active Investments",
            value: activeCount.toString(),
            icon: Wallet,
            desc: "Diverse portfolio",
            color: "text-violet-500"
        }
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, index) => (
                <Card key={index} className="bg-slate-900 border-slate-800 text-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-300">
                            {stat.title}
                        </CardTitle>
                        <div className={`h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center`}>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            {stat.desc}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
