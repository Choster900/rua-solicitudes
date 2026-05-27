import dayjs from 'dayjs'
import type {
    AuthUserRecord,
    AuthUserRoleAssignment,
} from '../interfaces/repositories/auth-users-repository.interface'
import type { RoleCode, UserType } from '../interfaces/domain/user.interface'
import { isRoleCode } from '../interfaces/domain/user.interface'
import { prisma } from '../database/prisma'

const authUserInclude = {
    userRoles: {
        include: {
            role: true,
        },
    },
} as const

type PrismaAuthUserWithRoles = {
    id: string
    employeeCode: string
    fullName: string
    email: string
    phone: string
    department: string
    status: string
    passwordHash: string
    mustChangePassword: boolean
    lastAccessAt: Date | null
    createdAt: Date
    updatedAt: Date
    userRoles: Array<{
        roleId: string
        role: {
            id: string
            code: string
            name: string
        }
    }>
}

const toRoleAssignments = (
    userRoles: PrismaAuthUserWithRoles['userRoles'],
): AuthUserRoleAssignment[] => {
    return userRoles
        .filter((entry) => isRoleCode(entry.role.code))
        .map((entry) => ({
            roleId: entry.role.id,
            code: entry.role.code as RoleCode,
            name: entry.role.name as UserType,
        }))
}

const toAuthUserRecord = (source: PrismaAuthUserWithRoles): AuthUserRecord => {
    return {
        id: source.id,
        employeeCode: source.employeeCode,
        fullName: source.fullName,
        email: source.email,
        phone: source.phone,
        department: source.department,
        status: source.status as AuthUserRecord['status'],
        passwordHash: source.passwordHash,
        mustChangePassword: source.mustChangePassword,
        lastAccessAt: source.lastAccessAt ? dayjs(source.lastAccessAt).toISOString() : null,
        createdAt: dayjs(source.createdAt).toISOString(),
        updatedAt: dayjs(source.updatedAt).toISOString(),
        roles: toRoleAssignments(source.userRoles),
    }
}

export const getAllAuthUsers = async () => {
    const authUsers = await prisma.authUser.findMany({
        orderBy: { createdAt: 'desc' },
        include: authUserInclude,
    })

    return authUsers.map(toAuthUserRecord)
}

export const findAuthUserById = async (userId: string) => {
    const authUser = await prisma.authUser.findUnique({
        where: { id: userId },
        include: authUserInclude,
    })

    return authUser ? toAuthUserRecord(authUser) : null
}

export const findAuthUserByNetworkUser = async (networkUser: string) => {
    const normalizedValue = networkUser.trim().toLowerCase()
    const authUser = await prisma.authUser.findFirst({
        where: {
            OR: [
                { email: { equals: normalizedValue, mode: 'insensitive' } },
                { employeeCode: { equals: normalizedValue, mode: 'insensitive' } },
            ],
        },
        include: authUserInclude,
    })

    return authUser ? toAuthUserRecord(authUser) : null
}

export const findAuthUserByEmployeeCode = async (employeeCode: string) => {
    const normalizedValue = employeeCode.trim()
    const authUser = await prisma.authUser.findFirst({
        where: {
            employeeCode: { equals: normalizedValue, mode: 'insensitive' },
        },
        include: authUserInclude,
    })

    return authUser ? toAuthUserRecord(authUser) : null
}

export const findAuthUserByEmail = async (email: string) => {
    const normalizedValue = email.trim().toLowerCase()
    const authUser = await prisma.authUser.findFirst({
        where: {
            email: { equals: normalizedValue, mode: 'insensitive' },
        },
        include: authUserInclude,
    })

    return authUser ? toAuthUserRecord(authUser) : null
}

export interface AddAuthUserInput {
    id?: string
    employeeCode: string
    fullName: string
    email: string
    phone: string
    department: string
    status: AuthUserRecord['status']
    passwordHash: string
    mustChangePassword: boolean
    roleCodes: RoleCode[]
}

export const addAuthUser = async (payload: AddAuthUserInput) => {
    const roles = await prisma.role.findMany({
        where: { code: { in: payload.roleCodes } },
    })

    const createdAuthUser = await prisma.authUser.create({
        data: {
            ...(payload.id ? { id: payload.id } : {}),
            employeeCode: payload.employeeCode,
            fullName: payload.fullName,
            email: payload.email,
            phone: payload.phone,
            department: payload.department,
            status: payload.status,
            passwordHash: payload.passwordHash,
            mustChangePassword: payload.mustChangePassword,
            userRoles: {
                create: roles.map((role) => ({ roleId: role.id })),
            },
        },
        include: authUserInclude,
    })

    return toAuthUserRecord(createdAuthUser)
}

export interface UpdateAuthUserPatch {
    employeeCode?: string
    fullName?: string
    email?: string
    phone?: string
    department?: string
    status?: AuthUserRecord['status']
    passwordHash?: string
    mustChangePassword?: boolean
    lastAccessAt?: string | null
    roleCodes?: RoleCode[]
}

export const updateAuthUser = async (userId: string, patch: UpdateAuthUserPatch) => {
    const currentUser = await findAuthUserById(userId)

    if (!currentUser) {
        return null
    }

    await prisma.authUser.update({
        where: { id: userId },
        data: {
            ...(patch.employeeCode !== undefined ? { employeeCode: patch.employeeCode } : {}),
            ...(patch.fullName !== undefined ? { fullName: patch.fullName } : {}),
            ...(patch.email !== undefined ? { email: patch.email } : {}),
            ...(patch.phone !== undefined ? { phone: patch.phone } : {}),
            ...(patch.department !== undefined ? { department: patch.department } : {}),
            ...(patch.status !== undefined ? { status: patch.status } : {}),
            ...(patch.passwordHash !== undefined ? { passwordHash: patch.passwordHash } : {}),
            ...(patch.mustChangePassword !== undefined
                ? { mustChangePassword: patch.mustChangePassword }
                : {}),
            ...(patch.lastAccessAt !== undefined
                ? { lastAccessAt: patch.lastAccessAt ? dayjs(patch.lastAccessAt).toDate() : null }
                : {}),
        },
    })

    if (patch.roleCodes) {
        await replaceUserRoles(userId, patch.roleCodes)
    }

    return findAuthUserById(userId)
}

export const replaceUserRoles = async (userId: string, roleCodes: RoleCode[]) => {
    const roles = await prisma.role.findMany({
        where: { code: { in: roleCodes } },
    })

    await prisma.$transaction([
        prisma.userRole.deleteMany({ where: { userId } }),
        prisma.userRole.createMany({
            data: roles.map((role) => ({ userId, roleId: role.id })),
            skipDuplicates: true,
        }),
    ])
}

export const deleteAuthUserById = async (userId: string) => {
    const existingUser = await findAuthUserById(userId)

    if (!existingUser) {
        return null
    }

    await prisma.authUser.delete({ where: { id: userId } })

    return existingUser
}
