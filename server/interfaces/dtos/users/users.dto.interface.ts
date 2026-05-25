import type { UserStatus, UserType } from '../../domain/user.interface'

export interface CreateUserDto {
    employeeCode?: string
    fullName?: string
    email?: string
    phone?: string
    userType?: UserType
    department?: string
    status?: UserStatus
}

export interface UpdateUserDto {
    employeeCode?: string
    fullName?: string
    email?: string
    phone?: string
    userType?: UserType
    department?: string
    status?: UserStatus
}
