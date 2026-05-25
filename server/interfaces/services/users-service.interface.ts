import type { UserStatus, UserType } from '../domain/user.interface'

export type { UserStatus }

export interface CreateAuthSystemUserInput {
    employeeCode: string
    fullName: string
    email: string
    phone?: string
    userType: UserType
    department: string
    status: UserStatus
}

export interface CreateAuthSystemUserSuccess {
    user: {
        id: string
        employeeCode: string
        fullName: string
        email: string
        phone: string
        userType: UserType
        department: string
        status: UserStatus
        lastAccessAt: null
        mustChangePassword: boolean
    }
    temporaryPassword: string
}

export interface CreateAuthSystemUserError {
    error: {
        code: 'DUPLICATED_EMPLOYEE_CODE' | 'DUPLICATED_EMAIL'
        message: string
    }
}

export type CreateAuthSystemUserResult = CreateAuthSystemUserSuccess | CreateAuthSystemUserError
