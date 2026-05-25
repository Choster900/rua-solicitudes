import type { UserType } from '../domain/user.interface'

export interface AuthLoginInput {
    networkUser: string
    password: string
}

export interface LoginTokenPayload extends Record<string, unknown> {
    sub: string
    email: string
    employeeCode: string
    userType: UserType
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
        userType: UserType
        department: string
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
