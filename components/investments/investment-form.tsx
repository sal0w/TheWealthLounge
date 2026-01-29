"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { users } from "@/lib/mock-data"
import { Product } from "@/lib/types"
import { products } from "@/lib/mock-data"

const formSchema = z.object({
    userId: z.string().min(1, "User is required"),
    productId: z.string().min(1, "Product is required"),
    amountInvested: z.string().min(1, "Amount is required"), // Handle as string
    currency: z.string().min(1, "Currency is required"),
    investmentDate: z.string(),
    status: z.enum(["active", "matured", "terminated"]),
})

export function InvestmentForm({ onSubmit, initialData }: { onSubmit: (data: any) => void, initialData?: any }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            amountInvested: initialData.amountInvested.toString()
        } : {
            userId: "",
            productId: "",
            amountInvested: "0",
            currency: "USD",
            investmentDate: new Date().toISOString().split('T')[0],
            status: "active",
        },
    })

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit({
            ...values,
            amountInvested: parseFloat(values.amountInvested)
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 text-left">
                <FormField
                    control={form.control}
                    name="userId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Investor</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="bg-slate-800 border-slate-700">
                                        <SelectValue placeholder="Select investor" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                    {users.filter(u => u.role === 'normal_user').map((user) => (
                                        <SelectItem key={user.id} value={user.id}>
                                            {user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="productId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="bg-slate-800 border-slate-700">
                                        <SelectValue placeholder="Select product" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                    {products.map((product) => (
                                        <SelectItem key={product.id} value={product.id}>
                                            {product.investmentCompany} ({product.category})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="amountInvested"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} className="bg-slate-800 border-slate-700" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Currency</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-slate-800 border-slate-700">
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="GBP">GBP</SelectItem>
                                        <SelectItem value="EUR">EUR</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900">
                    {initialData ? 'Update Investment' : 'Create Investment'}
                </Button>
            </form>
        </Form>
    )
}
