export const CLIENT_STATUSES = ['Activo', 'Prospecto', 'Inactivo'] as const
export type ClientStatus = (typeof CLIENT_STATUSES)[number]
