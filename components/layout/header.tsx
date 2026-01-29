"use client"

import { useAuth } from "@/lib/auth-context"
import { usePathname } from "next/navigation"

export function Header() {
    const { user } = useAuth()
    const pathname = usePathname()

    const getTitle = () => {
        switch (pathname) {
            case "/dashboard": return "Overview"
            case "/investments": return "Investment Portfolio"
            case "/users": return "User Management"
            default: return "Dashboard"
        }
    }

    return (
        <header className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">{getTitle()}</h2>
                <p className="text-slate-400 mt-1">
                    Welcome back, <span className="text-amber-500 font-medium">{user?.name}</span>
                </p>
            </div>
            <div className="flex items-center gap-4">
                {/* Placeholder for future elements like notifications or search */}
            </div>
        </header>
    )
}
