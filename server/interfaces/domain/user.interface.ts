export const ROLE_CODES = ['admin', 'vendedor', 'disenador_jefe', 'disenador', 'calidad'] as const

export type RoleCode = (typeof ROLE_CODES)[number]

export const ROLE_NAME_BY_CODE: Record<RoleCode, string> = {
    admin: 'Administrador',
    vendedor: 'Vendedor',
    disenador_jefe: 'Diseñador Jefe',
    disenador: 'Diseñador',
    calidad: 'Calidad',
}

export const USER_TYPES = Object.values(ROLE_NAME_BY_CODE) as readonly string[]
export type UserType = (typeof ROLE_NAME_BY_CODE)[RoleCode]

export const USER_STATUSES = ['ACTIVE', 'INACTIVE', 'SUSPENDED'] as const
export type UserStatus = (typeof USER_STATUSES)[number]

export const isRoleCode = (value: string): value is RoleCode => {
    return (ROLE_CODES as readonly string[]).includes(value)
}

export const isDesignLeadUserType = (userType: string): boolean => {
    return userType === ROLE_NAME_BY_CODE.disenador_jefe || userType === ROLE_NAME_BY_CODE.admin
}

export const getRoleCodeByName = (name: string): RoleCode | null => {
    const entry = Object.entries(ROLE_NAME_BY_CODE).find(([, label]) => label === name)
    return entry ? (entry[0] as RoleCode) : null
}
