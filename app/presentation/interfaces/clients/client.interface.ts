export interface Client {
    id: string
    code: string
    name: string
    taxId: string | null
    contactName: string | null
    contactEmail: string | null
    contactPhone: string | null
    country: string | null
    department: string | null
    city: string | null
    addressLine: string | null
    addressReference: string
    notes: string
    isActive: boolean
    createdAt: string
}
