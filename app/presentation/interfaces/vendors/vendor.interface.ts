export type VendorStatus = 'Activo' | 'Vacaciones' | 'Inactivo'

export interface Vendor {
  id: string
  code: string
  fullName: string
  zone: string
  phone: string
  email: string
  assignedClientCodes: string[]
  monthlySalesUsd: number
  status: VendorStatus
}
