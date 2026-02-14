import { User, userSchema } from "@/models/user.model"
import { supabase } from "@/lib/supabase"

/**
 * User Service - Supabase Implementation
 * 
 * This service uses Supabase for data access.
 * Database table: 'users'
 */

/**
 * Fetch all users from Supabase
 * 
 * @returns Promise resolving to an array of all users
 */
export async function getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching users:', error)
        throw new Error(`Failed to fetch users: ${error.message}`)
    }

    return data.map(user => userSchema.parse({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
    }))
}

/**
 * Fetch a user by their ID
 * 
 * @param id - The user's unique identifier
 * @returns Promise resolving to the user or null if not found
 */
export async function getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        if (error.code === 'PGRST116') {
            // Not found
            return null
        }
        console.error('Error fetching user:', error)
        throw new Error(`Failed to fetch user: ${error.message}`)
    }

    return userSchema.parse({
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role
    })
}

/**
 * Fetch a user by their email address
 * 
 * @param email - The user's email address
 * @returns Promise resolving to the user or null if not found
 */
export async function getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

    if (error) {
        if (error.code === 'PGRST116') {
            // Not found
            return null
        }
        console.error('Error fetching user by email:', error)
        throw new Error(`Failed to fetch user: ${error.message}`)
    }

    return userSchema.parse({
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role
    })
}

/**
 * Authenticate a user with Supabase Auth
 * 
 * @param email - User's email
 * @param password - User's password
 * @returns Promise resolving to the authenticated user or null if authentication fails
 */
export async function authenticateUser(email: string, password: string): Promise<User | null> {
    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (authError) {
        console.error('Authentication error:', authError)
        return null
    }

    if (!authData.user) {
        return null
    }

    // Fetch user details from users table
    return getUserById(authData.user.id)
}

/**
 * Create a new user in Supabase
 * Note: Use Supabase Auth signup for production
 * 
 * @param email - User's email
 * @param name - User's name
 * @param role - User's role
 * @returns Promise resolving to the created user
 */
export async function createUser(
    email: string,
    name: string,
    role: 'normal_user' | 'super_user' = 'normal_user'
): Promise<User> {
    const { data, error } = await supabase
        .from('users')
        .insert([{ email, name, role }])
        .select()
        .single()

    if (error) {
        console.error('Error creating user:', error)
        throw new Error(`Failed to create user: ${error.message}`)
    }

    return userSchema.parse({
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role
    })
}

/**
 * Get current authenticated user from Supabase Auth
 * 
 * @returns Promise resolving to the current user or null
 */
export async function getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    return getUserById(user.id)
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
        console.error('Error signing out:', error)
        throw new Error(`Failed to sign out: ${error.message}`)
    }
}
