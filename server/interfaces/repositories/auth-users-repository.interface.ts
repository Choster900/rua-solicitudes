import type { RoleCode, UserType } from '../domain/user.interface'

export type AuthUserStatus = 'Activo' | 'Pendiente' | 'Bloqueado'

export interface AuthUserRoleAssignment {
    roleId: string
    code: RoleCode
    name: UserType
}

export interface AuthUserRecord {
    id: string
    employeeCode: string
    fullName: string
    email: string
    phone: string
    department: string
    status: AuthUserStatus
    passwordHash: string
    mustChangePassword: boolean
    lastAccessAt: string | null
    createdAt: string
    updatedAt: string
    roles: AuthUserRoleAssignment[]
}

export interface AuthUsersStoreState {
    users: AuthUserRecord[]
}
