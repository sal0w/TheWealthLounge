"use client"

import { useAuth } from "@/lib/auth-context"
import { Sidebar } from "@/components/layout/sidebar"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login")
        }
    }, [user, isLoading, router])

    if (isLoading) {
        return <div className="h-full w-full flex items-center justify-center bg-slate-950">Loading...</div>
    }

    if (!user) {
        return null
    }

    return (
        <div className="h-full relative bg-slate-950">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                <Sidebar />
            </div>

            {/* Mobile Header */}
            <div className="md:hidden flex items-center p-4 border-b border-slate-800 bg-slate-900">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden text-white">
                            <Menu />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 bg-slate-900 border-slate-800">
                        <Sidebar />
                    </SheetContent>
                </Sheet>
                <div className="ml-4 font-bold text-amber-500">WealthLounge</div>
            </div>

            <main className="md:pl-72">
                <div className="h-full p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
