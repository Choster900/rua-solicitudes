export type ClientStatus = 'Activo' | 'Prospecto' | 'Inactivo'

export interface Client {
  id: string
  code: string
  name: string
  taxId: string
  segment: string
  contactName: string
  contactEmail: string
  contactPhone: string
  country: string
  department: string
  city: string
  addressLine: string
  addressReference: string
  website: string
  googleMapsUrl: string
  notes: string
  status: ClientStatus
}
