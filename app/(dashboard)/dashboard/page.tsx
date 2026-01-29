"use client"

import { Header } from "@/components/layout/header"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { CategoryDistributionChart } from "@/components/dashboard/category-chart"
import { AnnualProjectionChart } from "@/components/dashboard/projection-chart"
import { CurrencyDistributionChart } from "@/components/dashboard/currency-chart"
import { useInvestments } from "@/hooks/use-investments"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
    const { investments, loading } = useInvestments()

    if (loading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-12 w-64 bg-slate-800" />
                <div className="grid gap-4 md:grid-cols-3">
                    <Skeleton className="h-32 bg-slate-800" />
                    <Skeleton className="h-32 bg-slate-800" />
                    <Skeleton className="h-32 bg-slate-800" />
                </div>
                <Skeleton className="h-[400px] bg-slate-800" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <Header />

            <SummaryCards investments={investments} />

            {/* Top Row: Category Pie + Currency Pie */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-1 md:col-span-2 lg:col-span-4">
                    <CategoryDistributionChart investments={investments} />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <CurrencyDistributionChart />
                </div>
            </div>

            {/* Bottom Row: Annual Projection Line Chart */}
            <div className="grid gap-4">
                <AnnualProjectionChart />
            </div>
        </div>
    )
}
