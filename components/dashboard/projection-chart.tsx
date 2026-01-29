"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useInvestments } from "@/hooks/use-investments"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { formatCurrency } from "@/lib/utils"

export function AnnualProjectionChart() {
    const { investments, getProjections } = useInvestments()

    // Aggregate projections by year
    const yearlyData = new Map<number, { year: number; totalValue: number; principal: number; yield: number }>()

    investments.forEach(inv => {
        const projections = getProjections(inv.id)
        projections.forEach(proj => {
            const current = yearlyData.get(proj.year) || { year: proj.year, totalValue: 0, principal: 0, yield: 0 }
            yearlyData.set(proj.year, {
                year: proj.year,
                totalValue: current.totalValue + proj.totalValue,
                principal: current.principal + proj.principalAmount,
                yield: current.yield + proj.yieldAmount
            })
        })
    })

    // Convert map to sorted array
    const data = Array.from(yearlyData.values()).sort((a, b) => a.year - b.year)

    // Filter for 2025-2029 as per requirements
    const filteredData = data.filter(d => d.year >= 2025 && d.year <= 2029)

    // If no data, show empty state or filler
    if (filteredData.length === 0) {
        return (
            <Card className="col-span-4 bg-slate-900 border-slate-800 text-white">
                <CardHeader>
                    <CardTitle>Annual Performance</CardTitle>
                    <CardDescription className="text-slate-400">Projected Total Value (2025-2029)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full flex items-center justify-center text-slate-500">
                        No projection data available
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-4 bg-slate-900 border-slate-800 text-white">
            <CardHeader>
                <CardTitle>Annual Performance</CardTitle>
                <CardDescription className="text-slate-400">Projected Growth (2025-2029)</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={filteredData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="year" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value / 1000}k`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value: any) => formatCurrency(value)}
                            />
                            <Legend verticalAlign="top" height={36} />
                            <Line
                                type="monotone"
                                dataKey="totalValue"
                                name="Total Value"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                dot={{ fill: '#f59e0b', r: 4 }}
                                activeDot={{ r: 8 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="principal"
                                name="Principal"
                                stroke="#6366f1"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
