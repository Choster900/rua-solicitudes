export type RequestStatus =
    | 'PENDING_ASSIGNMENT'
    | 'ASSIGNED'
    | 'IN_DESIGN'
    | 'IN_QUALITY_REVIEW'
    | 'APPROVED'
    | 'REJECTED'

export type RequestPriority = 'Alta' | 'Media' | 'Baja'

export interface RequestAttachment {
    id: string
    name: string
    extension: string
    sizeKb: number
}

export interface DesignRequest {
    id: string
    requestCode: string
    clientName: string
    brandName: string
    productName: string
    requestedBy: string
    vendorName: string
    materialType: string
    materialWeight: string
    fluteDirection: string
    outerLiner: string
    innerLiner: string
    printTechnique: string
    colorMode: string
    pantoneReferences: string
    finishingOptions: string[]
    deliverables: string[]
    dimensions: string
    quantity: number
    requiredDate: string
    priority: RequestPriority
    status: RequestStatus
    currentVersion: number
    assignedDesignerId: string | null
    assignedById: string | null
    assignedAt: string | null
    approvedById: string | null
    approvedAt: string | null
    designInstructions: string
    visualReferences: string
    requireArt: boolean
    requireDieCut: boolean
    requireMockup: boolean
    attachments: RequestAttachment[]
    createdAt: string
}

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
    PENDING_ASSIGNMENT: 'Pendiente de asignación',
    ASSIGNED: 'Asignada',
    IN_DESIGN: 'En diseño',
    IN_QUALITY_REVIEW: 'En revisión de calidad',
    APPROVED: 'Aprobada',
    REJECTED: 'Rechazada',
}
