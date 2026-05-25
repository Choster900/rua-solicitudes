import type { VendorStatus } from '~/presentation/interfaces/vendors/vendor.interface'

export interface VendorRecord {
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

export type CreateVendorInput = Omit<VendorRecord, 'id'>
export type UpdateVendorInput = Partial<CreateVendorInput>
