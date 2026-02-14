import { Product, productSchema } from "@/models/product.model"
import { supabase } from "@/lib/supabase"

export async function getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase.from('products').select('*')
    if (error) throw new Error(`Failed to fetch products: ${error.message}`)
    return data.map(p => productSchema.parse({ id: p.id, category: p.category, investmentCompany: p.investment_company }))
}

export async function getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
    if (error && error.code !== 'PGRST116') throw new Error(`Failed to fetch product: ${error.message}`)
    return data ? productSchema.parse({ id: data.id, category: data.category, investmentCompany: data.investment_company }) : null
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase.from('products').select('*').eq('category', category)
    if (error) throw new Error(`Failed to fetch products: ${error.message}`)
    return data.map(p => productSchema.parse({ id: p.id, category: p.category, investmentCompany: p.investment_company }))
}
