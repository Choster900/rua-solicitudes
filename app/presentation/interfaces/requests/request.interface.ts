// ─── Status & Priority ────────────────────────────────────────────────────────

export type RequestStatus =
    | 'CREATED'
    | 'PENDING_DESIGN_REVIEW'
    | 'ASSIGNED_TO_DESIGNER'
    | 'IN_DESIGN'
    | 'SENT_TO_QUALITY'
    | 'QUALITY_REJECTED'
    | 'QUALITY_APPROVED'
    | 'DELIVERED_TO_SALES'
    | 'CANCELLED'

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
    CREATED: 'Creada',
    PENDING_DESIGN_REVIEW: 'Pendiente revisión',
    ASSIGNED_TO_DESIGNER: 'Asignada',
    IN_DESIGN: 'En diseño',
    SENT_TO_QUALITY: 'En calidad',
    QUALITY_REJECTED: 'Rechazada calidad',
    QUALITY_APPROVED: 'Aprobada calidad',
    DELIVERED_TO_SALES: 'Entregada',
    CANCELLED: 'Cancelada',
}

export type RequestPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export const REQUEST_PRIORITY_LABELS: Record<RequestPriority, string> = {
    LOW: 'Baja',
    MEDIUM: 'Media',
    HIGH: 'Alta',
    URGENT: 'Urgente',
}

// ─── Attachments / files ──────────────────────────────────────────────────────

export interface RequestAttachment {
    id: string
    name: string
    extension: string
    sizeKb: number
}

export interface RequestSampleFile {
    id: string
    originalName: string
    mimeType: string
    sizeBytes: number
    base64Content: string
    notes: string
    createdAt: string
}

// ─── Flat DTO returned by the API ─────────────────────────────────────────────
// Fields are flattened from DesignRequest + currentVersion for ease of use.

export interface DesignRequest {
    // Request identifiers
    id: string
    code: string
    requestCode: string // alias of code, kept for backward compat

    // Header info
    title: string
    clientId: string
    clientName: string
    sellerId: string
    requestedBy: string // seller fullName
    vendorName: string // seller fullName (alias)

    // Product info
    brandName: string
    productName: string

    // Status & priority
    priority: RequestPriority
    status: RequestStatus

    // Dates
    requiredDate: string | null
    createdAt: string

    // Version technical specs (flattened from currentVersion)
    materialType: string
    materialWeight: string
    closureType: string
    fluteType: string
    fluteDirection: string
    outerLiner: string
    innerLiner: string
    printTechnique: string // alias of closureType
    colorMode: string
    pantoneReferences: string
    dimensions: string // "L x W x H cm" formatted string
    length: number | null
    width: number | null
    height: number | null
    quantity: number
    finishingOptions: string[]
    deliverables: string[]
    designInstructions: string
    visualReferences: string
    requireDieCut: boolean
    requireMockup: boolean

    // Design checklist
    artCompleted: boolean
    mechanicalCompleted: boolean
    dummyCompleted: boolean

    // Relations
    assignedDesigners: { designerId: string; designerName: string }[]
    sampleFiles: RequestSampleFile[]
    attachments: RequestAttachment[] // kept for backward compat
}
