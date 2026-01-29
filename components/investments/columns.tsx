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
    },
    {
        accessorKey: "product.investmentCompany",
        header: "Company",
        cell: ({ row }) => <div className="font-medium text-slate-200">{row.original.product.investmentCompany}</div>,
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
