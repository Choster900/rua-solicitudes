import type { ClientStatus } from '../../domain/client.interface'

export interface CreateClientDto {
    code?: string
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
    addressReference?: string
    website?: string
    googleMapsUrl?: string
    notes?: string
    status?: ClientStatus
}

export interface UpdateClientDto {
    code?: string
    name?: string
    taxId?: string
    segment?: string
    contactName?: string
    contactEmail?: string
    contactPhone?: string
    country?: string
    department?: string
    city?: string
    addressLine?: string
    addressReference?: string
    website?: string
    googleMapsUrl?: string
    notes?: string
    status?: ClientStatus
}
