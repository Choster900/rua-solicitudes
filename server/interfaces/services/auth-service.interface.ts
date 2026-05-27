import type { RoleCode, UserType } from '../domain/user.interface'

export interface AuthLoginInput {
    networkUser: string
    password: string
}

export interface SessionRoleSummary {
    code: RoleCode
    name: UserType
}

export interface LoginTokenPayload extends Record<string, unknown> {
    sub: string
    email: string
    fullName: string
    employeeCode: string
    department: string
    primaryRole: RoleCode | null
    roleCodes: RoleCode[]
    permissionCodes: string[]
    mustChangePassword: boolean
}

export interface AuthLoginResponse {
    accessToken: string
    refreshToken: string | null
    expiresInSeconds: number
    tokenType: 'Bearer'
    mustChangePassword: boolean
    user: {
        id: string
        employeeCode: string
        fullName: string
        email: string
        department: string
        primaryRole: SessionRoleSummary | null
        roles: SessionRoleSummary[]
        permissions: string[]
    }
}

export interface ChangePasswordInput {
    userId: string
    currentPassword: string
    newPassword: string
}

export interface ChangePasswordResponse {
    accessToken: string
    refreshToken: string | null
    expiresInSeconds: number
    tokenType: 'Bearer'
}
