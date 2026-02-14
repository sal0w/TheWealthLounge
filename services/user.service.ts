import { User, userSchema } from "@/models/user.model"
import { supabase } from "@/lib/supabase"

export async function getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase.from('users').select('*')
    if (error) throw new Error(`Failed to fetch users: ${error.message}`)
    return data.map(u => userSchema.parse(u))
}

export async function getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single()
    if (error && error.code !== 'PGRST116') throw new Error(`Failed to fetch user: ${error.message}`)
    return data ? userSchema.parse(data) : null
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).single()
    if (error && error.code !== 'PGRST116') throw new Error(`Failed to fetch user: ${error.message}`)
    return data ? userSchema.parse(data) : null
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
        console.error('Authentication error:', error.message)
        return null
    }
    return getUserById(data.user.id)
}

export async function getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    return getUserById(user.id)
}

export async function signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(`Failed to sign out: ${error.message}`)
}
