export interface CreateClientDto {
    code?: string
    name: string
    taxId?: string
    contactName?: string
    contactEmail?: string
    contactPhone?: string
    country?: string
    department?: string
    city?: string
    addressLine?: string
    addressReference?: string
    notes?: string
    isActive?: boolean
}

export interface UpdateClientDto {
    name?: string
    taxId?: string
    contactName?: string
    contactEmail?: string
    contactPhone?: string
    country?: string
    department?: string
    city?: string
    addressLine?: string
    addressReference?: string
    notes?: string
    isActive?: boolean
}
