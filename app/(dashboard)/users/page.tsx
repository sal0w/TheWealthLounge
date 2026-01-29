"use client"

import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth-context"
import { users } from "@/lib/mock-data"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Edit, Trash2 } from "lucide-react"

export default function UsersPage() {
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (user && user.role !== 'super_user') {
            router.push('/dashboard')
        }
    }, [user, router])

    if (!user || user.role !== 'super_user') return null

    return (
        <div className="space-y-8">
            <Header />

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-white">User Management</CardTitle>
                    <Button className="bg-amber-500 text-slate-950 hover:bg-amber-600">
                        Add New User
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-400">Name</TableHead>
                                <TableHead className="text-slate-400">Email</TableHead>
                                <TableHead className="text-slate-400">Role</TableHead>
                                <TableHead className="text-right text-slate-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((u) => (
                                <TableRow key={u.id} className="border-slate-800 hover:bg-slate-800/50">
                                    <TableCell className="font-medium text-slate-200">{u.name}</TableCell>
                                    <TableCell className="text-slate-400">{u.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={u.role === 'super_user' ? 'text-amber-500 border-amber-500/20 bg-amber-500/10' : 'text-slate-400 border-slate-700'}>
                                            {u.role === 'super_user' ? 'Administrator' : 'Client'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
