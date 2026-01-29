"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { columns } from "@/components/investments/columns"
import { DataTable } from "@/components/investments/data-table"
import { useInvestments } from "@/hooks/use-investments"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { InvestmentForm } from "@/components/investments/investment-form"

export default function InvestmentsPage() {
    const { investments, loading, addInvestment } = useInvestments()
    const { user } = useAuth()
    const [showAddModal, setShowAddModal] = useState(false)

    const handleAddInvestment = async (data: any) => {
        // Enrich data with mock fields if needed
        await addInvestment({
            ...data,
            usdEquivalent: data.currency === 'USD' ? data.amountInvested : data.amountInvested * 1.2, // mock conversion
            detailsOfInvestment: "New investment entry",
            expectedYield: "TBD",
            contractPdf: "#"
        })
        setShowAddModal(false)
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <Header />
                {user?.role === 'super_user' && (
                    <Button onClick={() => setShowAddModal(true)} className="bg-amber-500 text-slate-900 hover:bg-amber-600">
                        <Plus className="mr-2 h-4 w-4" /> Add Investment
                    </Button>
                )}
            </div>

            <Card className="bg-slate-900 border-slate-800 pt-6">
                <CardContent>
                    {loading ? (
                        <div className="h-[400px] w-full flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                        </div>
                    ) : (
                        <DataTable columns={columns} data={investments} />
                    )}
                </CardContent>
            </Card>

            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Add New Investment</DialogTitle>
                    </DialogHeader>
                    <InvestmentForm onSubmit={handleAddInvestment} />
                </DialogContent>
            </Dialog>
        </div>
    )
}
