import type { RoleCode, UserStatus, UserType } from '../domain/user.interface'

export type { UserStatus }

export interface CreateAuthSystemUserInput {
    employeeCode: string
    fullName: string
    email: string
    phone?: string
    roleCode: RoleCode
    department: string | null
    status: UserStatus
}

export interface CreatedAuthSystemUserShape {
    id: string
    employeeCode: string
    fullName: string
    email: string
    phone: string
    department: string | null
    status: UserStatus
    lastAccessAt: null
    mustChangePassword: boolean
    roles: Array<{ code: RoleCode; name: UserType }>
    primaryRole: { code: RoleCode; name: UserType } | null
}

export interface CreateAuthSystemUserSuccess {
    user: CreatedAuthSystemUserShape
    temporaryPassword: string
}

export interface CreateAuthSystemUserError {
    error: {
        code: 'DUPLICATED_EMPLOYEE_CODE' | 'DUPLICATED_EMAIL' | 'INVALID_ROLE'
        message: string
    }
}

export type CreateAuthSystemUserResult = CreateAuthSystemUserSuccess | CreateAuthSystemUserError
