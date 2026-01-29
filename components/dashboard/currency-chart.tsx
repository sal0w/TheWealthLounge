"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useInvestments } from "@/hooks/use-investments"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const COLORS = ['#10b981', '#3b82f6', '#ec4899', '#f59e0b', '#8b5cf6']

export function CurrencyDistributionChart() {
    const { investments } = useInvestments()

    const dataMap = new Map<string, number>()

    investments.forEach(inv => {
        const currency = inv.currency
        const current = dataMap.get(currency) || 0
        dataMap.set(currency, current + inv.usdEquivalent)
    })

    const data = Array.from(dataMap.entries()).map(([name, value]) => ({ name, value }))

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 bg-slate-900 border-slate-800 text-white">
            <CardHeader>
                <CardTitle>Currency Exposure</CardTitle>
                <CardDescription className="text-slate-400">Portfolio Value by Currency (USD Eq)</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.5)" />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value: any) => `$${value.toLocaleString()}`}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
