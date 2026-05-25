export const VENDOR_STATUSES = ['Activo', 'Vacaciones', 'Inactivo'] as const
export type VendorStatus = (typeof VENDOR_STATUSES)[number]
