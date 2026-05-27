export const USER_TYPES = [
    'Administrador',
    'Vendedor',
    'Diseñador Jefe',
    'Diseñador',
    'Calidad',
] as const

export type UserType = (typeof USER_TYPES)[number]

export const ROLE_CODES = ['admin', 'vendedor', 'disenador_jefe', 'disenador', 'calidad'] as const

export type RoleCode = (typeof ROLE_CODES)[number]

export const ROLE_CODE_BY_USER_TYPE: Record<UserType, RoleCode> = {
    Administrador: 'admin',
    Vendedor: 'vendedor',
    'Diseñador Jefe': 'disenador_jefe',
    Diseñador: 'disenador',
    Calidad: 'calidad',
}

export const USER_TYPE_BY_ROLE_CODE: Record<RoleCode, UserType> = {
    admin: 'Administrador',
    vendedor: 'Vendedor',
    disenador_jefe: 'Diseñador Jefe',
    disenador: 'Diseñador',
    calidad: 'Calidad',
}

export type UserStatus = 'Activo' | 'Pendiente' | 'Bloqueado'

export interface UserRoleSummary {
    code: RoleCode
    name: UserType
}

export interface User {
    id: string
    employeeCode: string
    fullName: string
    email: string
    phone: string
    userType: UserType
    department: string
    status: UserStatus
    lastAccessAt: string | null
    roles?: UserRoleSummary[]
    primaryRole?: UserRoleSummary | null
}
