#!/bin/bash

# Update auth context to use Supabase session management

cat > lib/auth-context.tsx << 'EOF'
"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { User } from "@/models/user.model"
import { useAuthController } from "@/controllers/auth.controller"
import { PolicyConsentModal } from "@/components/auth/policy-consent-modal"
import { getCurrentUser } from "@/services/user.service"
import { supabase } from "@/lib/supabase"

/**
 * Auth Context - Global authentication state provider
 * Uses Supabase Auth for session management
 */

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const authController = useAuthController()
    const [showPolicyConsent, setShowPolicyConsent] = useState(false)
    const [pendingUser, setPendingUser] = useState<User | null>(null)
    const [isRestored, setIsRestored] = useState(false)

    // Restore session from Supabase on mount
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const user = await getCurrentUser()
                if (user) {
                    // Restore user to auth controller state
                    authController.user = user
                }
            } catch (err) {
                console.error("Failed to restore session:", err)
            }
            setIsRestored(true)
        }
        
        restoreSession()
        
        // Listen to auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                router.push("/login")
            }
        })
        
        return () => {
            subscription.unsubscribe()
        }
    }, [])

    /**
     * Login with routing and policy consent check
     */
    const login = async (email: string, password: string) => {
        await authController.login(email, password)
    }

    /**
     * Logout with routing
     */
    const logout = async () => {
        await authController.logout()
        localStorage.removeItem(`policy-consent-${authController.user?.id}`)
        router.push("/login")
    }

    // Check policy consent and navigate when user changes
    useEffect(() => {
        if (isRestored && authController.user) {
            const policyKey = `policy-consent-${authController.user.id}`
            const hasAcceptedPolicy = localStorage.getItem(policyKey)
            
            if (!hasAcceptedPolicy) {
                setPendingUser(authController.user)
                setShowPolicyConsent(true)
            } else {
                if (window.location.pathname === "/login" || window.location.pathname === "/") {
                    router.push("/dashboard")
                }
            }
        }
    }, [authController.user, router, isRestored])

    /**
     * Handle policy consent acceptance
     */
    const handlePolicyAccept = () => {
        if (pendingUser) {
            const policyKey = `policy-consent-${pendingUser.id}`
            localStorage.setItem(policyKey, new Date().toISOString())
            
            setShowPolicyConsent(false)
            setPendingUser(null)
            
            if (window.location.pathname === "/login" || window.location.pathname === "/") {
                router.push("/dashboard")
            }
        }
    }

    // Show loading state while restoring session
    if (!isRestored) {
        return (
            <AuthContext.Provider
                value={{
                    user: null,
                    login,
                    logout,
                    isLoading: true
                }}
            >
                {children}
            </AuthContext.Provider>
        )
    }

    return (
        <AuthContext.Provider
            value={{
                user: authController.user,
                login,
                logout,
                isLoading: authController.isLoading
            }}
        >
            {children}
            <PolicyConsentModal open={showPolicyConsent} onAccept={handlePolicyAccept} />
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
EOF

echo "✅ Updated auth context to use Supabase session management"
