#!/bin/bash

# Update auth controller to use Supabase

cat > controllers/auth.controller.ts << 'EOF'
"use client"

import { useState, useCallback } from "react"
import { User } from "@/models/user.model"
import { authenticateUser, signOut } from "@/services/user.service"

/**
 * Auth Controller - Business logic layer for authentication
 * Uses Supabase Auth for authentication
 */

export interface AuthState {
    user: User | null
    isLoading: boolean
    error: string | null
}

export interface AuthController extends AuthState {
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
}

/**
 * Authentication controller hook
 */
export function useAuthController(): AuthController {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    /**
     * Login user with email and password using Supabase Auth
     */
    const login = useCallback(async (email: string, password: string) => {
        setIsLoading(true)
        setError(null)

        try {
            const authenticatedUser = await authenticateUser(email, password)

            if (!authenticatedUser) {
                throw new Error("Invalid email or password")
            }

            setUser(authenticatedUser)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Authentication failed"
            setError(errorMessage)
            throw err
        } finally {
            setIsLoading(false)
        }
    }, [])

    /**
     * Logout current user using Supabase Auth
     */
    const logout = useCallback(async () => {
        setError(null)
        try {
            await signOut()
            setUser(null)
        } catch (err) {
            console.error('Logout error:', err)
        }
    }, [])

    return {
        user,
        isLoading,
        error,
        login,
        logout,
    }
}
EOF

echo "✅ Updated auth controller to use Supabase"
