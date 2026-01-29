"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { InvestmentWithProduct } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface InvestmentDetailDialogProps {
    investment: InvestmentWithProduct | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function InvestmentDetailDialog({ investment, open, onOpenChange }: InvestmentDetailDialogProps) {
    if (!investment) return null

    // Filter and sort performance history to show only years up to 2026
    const currentYear = 2026
    const performanceData = investment.performanceHistory
        ?.filter(p => p.year <= currentYear)
        .sort((a, b) => a.year - b.year) || []

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-800 text-white">
                <DialogHeader>
                    <DialogTitle>{investment.product.investmentCompany}</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        {investment.product.category}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 items-center gap-4">
                        <div className="text-sm text-slate-400">Status</div>
                        <div>
                            <Badge className={investment.status === 'active' ? "bg-emerald-500/20 text-emerald-500" : ""}>
                                {investment.status}
                            </Badge>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <div className="text-sm text-slate-400">Amount Invested</div>
                        <div className="font-medium">{formatCurrency(investment.amountInvested, investment.currency)}</div>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <div className="text-sm text-slate-400">Expected Yield</div>
                        <div className="text-sm">{investment.expectedYield}</div>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <div className="text-sm text-slate-400">Investment Date</div>
                        <div>{investment.investmentDate}</div>
                    </div>
                    {investment.maturityDate && (
                        <div className="grid grid-cols-2 items-center gap-4">
                            <div className="text-sm text-slate-400">Maturity Date</div>
                            <div>{investment.maturityDate}</div>
                        </div>
                    )}
                    <div className="border-t border-slate-800 pt-4 mt-2">
                        <div className="text-sm text-slate-400 mb-2">Details</div>
                        <p className="text-sm text-slate-300">
                            {investment.detailsOfInvestment}
                        </p>
                    </div>

                    {/* Performance Projection Table */}
                    {performanceData.length > 0 && (
                        <div className="border-t border-slate-800 pt-4 mt-2">
                            <div className="text-sm font-medium text-slate-200 mb-3">Performance Projection in USD</div>
                            <div className="rounded-md border border-slate-800 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-slate-950">
                                        <TableRow className="border-slate-800 hover:bg-transparent">
                                            <TableHead className="text-slate-400">Year</TableHead>
                                            <TableHead className="text-slate-400 text-right">Yield</TableHead>
                                            <TableHead className="text-slate-400 text-right">Principal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {performanceData.map((projection) => (
                                            <TableRow key={projection.id} className="border-slate-800 hover:bg-slate-800/50">
                                                <TableCell className="font-medium text-slate-200">{projection.year}</TableCell>
                                                <TableCell className="text-right text-emerald-400">
                                                    {formatCurrency(projection.yieldAmount, "USD")}
                                                </TableCell>
                                                <TableCell className="text-right text-slate-300">
                                                    {formatCurrency(projection.principalAmount, "USD")}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
