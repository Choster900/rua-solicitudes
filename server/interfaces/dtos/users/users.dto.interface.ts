import type { RoleCode, UserStatus } from '../../domain/user.interface'

export interface CreateUserDto {
    employeeCode?: string
    fullName?: string
    email?: string
    phone?: string
    roleCode?: RoleCode
    department?: string
    status?: UserStatus
}

export interface UpdateUserDto {
    employeeCode?: string
    fullName?: string
    email?: string
    phone?: string
    roleCode?: RoleCode
    department?: string
    status?: UserStatus
}
