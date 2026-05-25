import type { ClientStatus } from '../domain/client.interface'

export interface ClientRecord {
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

export type CreateClientInput = Omit<ClientRecord, 'id'>
export type UpdateClientInput = Partial<CreateClientInput>
