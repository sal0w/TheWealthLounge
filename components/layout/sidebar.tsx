"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    CreditCard,
    LayoutDashboard,
    Settings,
    Users,
    LineChart,
    LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

export function Sidebar() {
    const pathname = usePathname()
    const { user, logout } = useAuth()

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
            color: "text-sky-500",
        },
        {
            label: "Investments",
            icon: LineChart,
            href: "/investments",
            color: "text-violet-500",
        },
        {
            label: "Users",
            icon: Users,
            href: "/users",
            color: "text-pink-700",
            roles: ["super_user"]
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/settings",
            color: "text-gray-500",
        },
    ]

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 border-r border-slate-800 text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative h-8 w-8 mr-4">
                        <CreditCard className="h-8 w-8 text-amber-500" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 text-transparent bg-clip-text">
                        WealthLounge
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => {
                        if (route.roles && user && !route.roles.includes(user.role)) {
                            return null
                        }

                        return (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                    pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                                )}
                            >
                                <div className="flex items-center flex-1">
                                    <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                    {route.label}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
            <div className="px-3 py-2">
                <div className="flex items-center p-3 mb-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{user?.name}</span>
                        <span className="text-xs text-zinc-400 capitalize">{user?.role.replace('_', ' ')}</span>
                    </div>
                </div>
                <Button
                    onClick={logout}
                    variant="ghost"
                    className="w-full justify-start text-zinc-400 hover:text-red-400 hover:bg-red-900/10"
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
