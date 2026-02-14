import { z } from "zod"

// Zod Schema
export const productSchema = z.object({
    id: z.string(),
    category: z.string().min(1),
    investmentCompany: z.string().min(1),
})

// Types
export type Product = z.infer<typeof productSchema>

// Helper functions
export function getProductCategories(products: Product[]): string[] {
    const categories = new Set(products.map(p => p.category))
    return Array.from(categories).sort()
}

export function getProductsByCategory(products: Product[], category: string): Product[] {
    return products.filter(p => p.category === category)
}
