import { z } from "zod"

// Zod Schema
export const userRoleSchema = z.enum(["normal_user", "super_user"])

export const userSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().min(1),
    role: userRoleSchema,
})

// Types
export type UserRole = z.infer<typeof userRoleSchema>
export type User = z.infer<typeof userSchema>

// Helper functions
export function isNormalUser(user: User): boolean {
    return user.role === "normal_user"
}

export function isSuperUser(user: User): boolean {
    return user.role === "super_user"
}

export function canManageInvestments(user: User): boolean {
    return isSuperUser(user)
}

export function canViewAllUsers(user: User): boolean {
    return isSuperUser(user)
}
