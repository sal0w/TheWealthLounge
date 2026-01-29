"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { User, UserRole } from "./types"
import { users } from "./mock-data"
import { useRouter } from "next/navigation"

interface AuthContextType {
    user: User | null
    login: (email: string) => Promise<void>
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check local storage for persisted session
        const storedUser = localStorage.getItem("investment-portfolio-user")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setIsLoading(false)
    }, [])

    const login = async (email: string) => {
        setIsLoading(true)
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        const foundUser = users.find(u => u.email === email)

        if (foundUser) {
            setUser(foundUser)
            localStorage.setItem("investment-portfolio-user", JSON.stringify(foundUser))
            router.push("/dashboard")
        } else {
            throw new Error("User not found")
        }
        setIsLoading(false)
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("investment-portfolio-user")
        router.push("/login")
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
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
