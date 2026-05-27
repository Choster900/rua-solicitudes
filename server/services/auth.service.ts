import type {
    AuthLoginInput,
    AuthLoginResponse,
    ChangePasswordInput,
    ChangePasswordResponse,
    LoginTokenPayload,
    SessionRoleSummary,
} from '../interfaces/services/auth-service.interface'
import type { AuthUserRecord } from '../interfaces/repositories/auth-users-repository.interface'
import type { RoleCode, UserType } from '../interfaces/domain/user.interface'
import {
    findAuthUserById,
    findAuthUserByNetworkUser,
    updateAuthUser,
} from '../repositories/auth-users.repository'
import { prisma } from '../database/prisma'
import { createJwtToken } from '../utils/auth-jwt.util'
import { hashPassword, verifyPassword } from '../utils/password.util'

const normalizeNetworkUser = (value: string) => value.trim().toLowerCase()

const toRoleSummaries = (authUser: AuthUserRecord): SessionRoleSummary[] => {
    return authUser.roles.map((role) => ({ code: role.code, name: role.name }))
}

const resolvePermissionsForRoles = async (_roleCodes: RoleCode[]): Promise<string[]> => {
    // Permission model removed — permissions are enforced via role codes in requireRole()
    return []
}

const buildSessionContext = async (authUser: AuthUserRecord) => {
    const roleSummaries = toRoleSummaries(authUser)
    const roleCodes = roleSummaries.map((role) => role.code)
    const permissionCodes = await resolvePermissionsForRoles(roleCodes)
    const primaryRole: SessionRoleSummary | null = roleSummaries[0] ?? null

    return { roleSummaries, roleCodes, permissionCodes, primaryRole }
}

export const loginWithSystemUser = async (
    input: AuthLoginInput,
    options: {
        jwtSecret: string
        accessTokenExpiresInSeconds: number
    },
): Promise<AuthLoginResponse | null> => {
    const normalizedNetworkUser = normalizeNetworkUser(input.networkUser)
    const candidatePassword = input.password.trim()

    const authUser = await findAuthUserByNetworkUser(normalizedNetworkUser)

    if (!authUser || authUser.status !== 'ACTIVE') {
        return null
    }

    const isPasswordValid = await verifyPassword(candidatePassword, authUser.passwordHash)
    if (!isPasswordValid) {
        return null
    }

    const { roleSummaries, roleCodes, permissionCodes, primaryRole } =
        await buildSessionContext(authUser)

    const payload: LoginTokenPayload = {
        sub: authUser.id,
        email: authUser.email,
        fullName: authUser.fullName,
        employeeCode: authUser.employeeCode,
        department: authUser.department,
        primaryRole: primaryRole?.code ?? null,
        roleCodes,
        permissionCodes,
        mustChangePassword: authUser.mustChangePassword,
    }

    const accessToken = createJwtToken(payload, {
        secret: options.jwtSecret,
        expiresInSeconds: options.accessTokenExpiresInSeconds,
    })

    return {
        accessToken,
        refreshToken: null,
        expiresInSeconds: options.accessTokenExpiresInSeconds,
        tokenType: 'Bearer',
        mustChangePassword: authUser.mustChangePassword,
        user: {
            id: authUser.id,
            employeeCode: authUser.employeeCode,
            fullName: authUser.fullName,
            email: authUser.email,
            department: authUser.department,
            primaryRole,
            roles: roleSummaries,
            permissions: permissionCodes,
        },
    }
}

export const changeAuthUserPassword = async (
    input: ChangePasswordInput,
    options: {
        jwtSecret: string
        accessTokenExpiresInSeconds: number
    },
): Promise<ChangePasswordResponse | null> => {
    const authUser = await findAuthUserById(input.userId)

    if (!authUser || authUser.status !== 'ACTIVE') {
        return null
    }

    const isCurrentPasswordValid = await verifyPassword(
        input.currentPassword.trim(),
        authUser.passwordHash,
    )
    if (!isCurrentPasswordValid) {
        return null
    }

    const newPasswordHash = await hashPassword(input.newPassword.trim())
    const updatedUser = await updateAuthUser(input.userId, {
        passwordHash: newPasswordHash,
        mustChangePassword: false,
    })

    if (!updatedUser) {
        return null
    }

    const { roleCodes, permissionCodes, primaryRole } = await buildSessionContext(updatedUser)

    const tokenPayload: LoginTokenPayload = {
        sub: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        employeeCode: updatedUser.employeeCode,
        department: updatedUser.department,
        primaryRole: primaryRole?.code ?? null,
        roleCodes,
        permissionCodes,
        mustChangePassword: false,
    }

    const accessToken = createJwtToken(tokenPayload, {
        secret: options.jwtSecret,
        expiresInSeconds: options.accessTokenExpiresInSeconds,
    })

    return {
        accessToken,
        refreshToken: null,
        expiresInSeconds: options.accessTokenExpiresInSeconds,
        tokenType: 'Bearer',
    }
}

export type { UserType }
