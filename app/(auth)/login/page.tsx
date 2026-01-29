"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { users } from "@/lib/mock-data"
import { CreditCard, Loader2 } from "lucide-react"

export default function LoginPage() {
    const { login } = useAuth()
    const [selectedEmail, setSelectedEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedEmail) return

        setIsLoading(true)
        try {
            await login(selectedEmail)
        } catch (error) {
            console.error(error)
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            <div className="hidden lg:flex flex-col bg-slate-900 text-white p-10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-violet-600/20" />
                <div className="relative z-10 flex items-center text-lg font-medium mb-10">
                    <CreditCard className="mr-2 h-6 w-6 text-amber-500" />
                    WealthLounge
                </div>
                <div className="relative z-10 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;The best investment you can make is in yourself. The more you learn, the more you'll earn.&rdquo;
                        </p>
                        <footer className="text-sm text-slate-400">Warren Buffett</footer>
                    </blockquote>
                </div>
            </div>
            <div className="flex items-center justify-center p-8 bg-slate-950">
                <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-white shadow-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight">Access your Portfolio</CardTitle>
                        <CardDescription className="text-slate-400">
                            Select a demo account to continue
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="role" className="text-slate-200">Select User Role</Label>
                                <div className="grid gap-2">
                                    <Select onValueChange={setSelectedEmail} required>
                                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                            <SelectValue placeholder="Select a user to simulate login" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                            {users.map(user => (
                                                <SelectItem key={user.id} value={user.email} className="focus:bg-slate-700 focus:text-white">
                                                    {user.name} ({user.role === 'super_user' ? 'Admin' : 'User'})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold"
                                disabled={isLoading}
                            >
                                {isLoading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Sign In
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
