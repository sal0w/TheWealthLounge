"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { InvestmentWithProduct } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, LinkIcon, FileText } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { InvestmentActions } from "./investment-actions"
import { InvestmentDetailDialog } from "./investment-detail-dialog"

export const columns: ColumnDef<InvestmentWithProduct>[] = [
    {
        id: "serial",
        header: "#",
        cell: ({ row }) => <div className="text-muted-foreground text-xs">{row.index + 1}</div>,
        enableSorting: false,
        size: 40,
    },
    {
        accessorKey: "product.category",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const category = row.original.product.category
            return (
                <Badge variant="outline" className="bg-slate-900/50 text-slate-100">
                    {category}
                </Badge>
            )
        },
        sortingFn: (rowA, rowB, columnId) => {
            const categoryOrder: Record<string, number> = {
                "Private Equity": 1,
                "REIT": 2,
                "Gold": 3,
                "Loan Notes": 4,
                "Loan Notes and Profit Share": 4,
            }
            
            const categoryA = rowA.original.product.category
            const categoryB = rowB.original.product.category
            
            const orderA = categoryOrder[categoryA] || 999
            const orderB = categoryOrder[categoryB] || 999
            
            return orderA - orderB
        },
    },
    {
        accessorKey: "product.investmentCompany",
        header: "Company",
        cell: ({ row }) => <div className="font-medium text-slate-200">{row.original.product.investmentCompany}</div>,
    },
    {
        accessorKey: "investmentDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Investment Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const dateString = row.getValue("investmentDate") as string
            const date = new Date(dateString)
            return (
                <div className="text-slate-300">
                    {date.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                    })}
                </div>
            )
        },
    },
    {
        accessorKey: "currency",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Currency
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const currency = row.getValue("currency") as string
            const currencyLabels: Record<string, string> = {
                "USD": "US Dollar",
                "EUR": "Euro",
                "GBP": "Pound"
            }
            const label = currencyLabels[currency] || currency
            
            return (
                <Badge variant="secondary" className="bg-slate-800 text-slate-200 border-slate-700 whitespace-nowrap">
                    {currency}
                </Badge>
            )
        },
        filterFn: (row, id, value) => {
            if (!value || value === "all") return true
            return row.getValue(id) === value
        },
    },
    {
        accessorKey: "amountInvested",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Invested
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amountInvested"))
            const currency = row.original.currency
            return <div className="font-medium text-emerald-400">{formatCurrency(amount, currency)}</div>
        },
    },
    {
        accessorKey: "usdEquivalent",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    USD Equiv.
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("usdEquivalent"))
            return <div className="text-slate-400">{formatCurrency(amount, "USD")}</div>
        },
    },
    {
        accessorKey: "expectedYield",
        header: "Expected Yield",
        cell: ({ row }) => <div className="max-w-[200px] truncate text-xs text-slate-400" title={row.getValue("expectedYield")}>{row.getValue("expectedYield")}</div>,
    },
    {
        id: "latestProjection",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Performance Projection
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        accessorFn: (row) => {
            // Get the latest year projection for sorting
            const projections = row.performanceHistory || []
            if (projections.length === 0) return 0
            const latest = projections.reduce((max, p) => p.year > max.year ? p : max, projections[0])
            return latest.totalValue
        },
        cell: ({ row, table }) => {
            const projections = row.original.performanceHistory || []
            
            if (projections.length === 0) {
                return <div className="text-slate-500 text-xs">No data</div>
            }

            // Get the year filter value from the projectionYears column
            const yearFilter = table.getColumn("projectionYears")?.getFilterValue() as string
            
            let selectedProjection
            if (yearFilter && yearFilter !== "all") {
                // Show projection for the filtered year
                selectedProjection = projections.find(p => p.year.toString() === yearFilter)
                if (!selectedProjection) {
                    return <div className="text-slate-500 text-xs">No data for {yearFilter}</div>
                }
            } else {
                // Show the latest year projection when no filter is applied
                selectedProjection = projections.reduce((max, p) => 
                    p.year > max.year ? p : max, 
                    projections[0]
                )
            }

            return (
                <div className="flex flex-col gap-1">
                    <div className="text-xs text-slate-400">Year {selectedProjection.year}</div>
                    <div className="font-semibold text-amber-400">
                        {formatCurrency(selectedProjection.totalValue, "USD")}
                    </div>
                    <div className="text-xs text-emerald-400">
                        +{formatCurrency(selectedProjection.yieldAmount, "USD")} yield
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "contractPdf",
        header: "Contract",
        cell: ({ row }) => {
            return (
                <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 text-amber-500 hover:text-amber-400">
                    <Link href={row.original.contractPdf} target="_blank">
                        <LinkIcon className="h-4 w-4" />
                    </Link>
                </Button>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status
            return (
                <Badge variant={status === 'active' ? 'default' : 'secondary'} className={status === 'active' ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" : ""}>
                    {status}
                </Badge>
            )
        },
    },
    {
        id: "projectionYears",
        header: "Projection Years",
        accessorFn: (row) => {
            const projections = row.performanceHistory || []
            return projections.map(p => p.year).join(',')
        },
        cell: ({ row }) => {
            const projections = row.original.performanceHistory || []
            
            if (projections.length === 0) {
                return <div className="text-slate-500 text-xs">No data</div>
            }

            const years = projections.map(p => p.year).sort((a, b) => a - b)
            
            return (
                <div className="flex flex-wrap gap-1">
                    {years.map(year => (
                        <Badge key={year} variant="outline" className="bg-violet-500/10 text-violet-400 border-violet-500/30 text-xs">
                            {year}
                        </Badge>
                    ))}
                </div>
            )
        },
        filterFn: (row, id, filterValue) => {
            if (!filterValue || filterValue === "all") return true
            const projections = row.original.performanceHistory || []
            return projections.some(p => p.year.toString() === filterValue)
        },
    },
    {
        accessorKey: "detailsOfInvestment",
        header: "Details",
        cell: ({ row }) => (
            <div className="max-w-[200px] truncate text-xs text-slate-400" title={row.getValue("detailsOfInvestment")}>
                {row.getValue("detailsOfInvestment")}
            </div>
        ),
    },
    {
        accessorKey: "investmentType",
        header: "Type",
        cell: ({ row }) => (
            <Badge variant="secondary" className="bg-slate-800 text-slate-300 border-slate-700 whitespace-nowrap">
                {row.getValue("investmentType")}
            </Badge>
        ),
    },
    {
        id: "view_details",
        cell: ({ row }) => <ViewDetailsAction investment={row.original} />,
        size: 100,
    },
]

function ViewDetailsAction({ investment }: { investment: InvestmentWithProduct }) {
    const [showDetails, setShowDetails] = useState(false)

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                className="bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 h-8 text-xs"
                onClick={() => setShowDetails(true)}
            >
                <FileText className="mr-2 h-3 w-3" />
                View Details
            </Button>

            <InvestmentDetailDialog
                open={showDetails}
                onOpenChange={setShowDetails}
                investment={investment}
            />
        </>
    )
}
