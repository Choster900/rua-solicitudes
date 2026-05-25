export const USER_TYPES = [
    'Administrador',
    'Vendedor',
    'Diseñador',
    'Calidad',
    'Administrativo',
    'Gerencia',
] as const

export type UserType = (typeof USER_TYPES)[number]

export const USER_STATUSES = ['Activo', 'Pendiente', 'Bloqueado'] as const
export type UserStatus = (typeof USER_STATUSES)[number]
