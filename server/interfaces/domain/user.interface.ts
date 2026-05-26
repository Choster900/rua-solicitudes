export const USER_TYPES = [
    'Administrador',
    'Vendedor',
    'JefeDiseño',
    'Diseñador',
    'Calidad',
    'Administrativo',
    'Gerencia',
] as const

export type UserType = (typeof USER_TYPES)[number]

export const DESIGN_LEAD_USER_TYPES: UserType[] = ['Administrador', 'JefeDiseño']

export const isDesignLeadUserType = (userType: string | null | undefined): userType is UserType => {
    return DESIGN_LEAD_USER_TYPES.includes(userType as UserType)
}

export const USER_STATUSES = ['Activo', 'Pendiente', 'Bloqueado'] as const
export type UserStatus = (typeof USER_STATUSES)[number]
