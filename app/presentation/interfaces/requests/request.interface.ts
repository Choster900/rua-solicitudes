export type RequestStatus =
    | 'Borrador'
    | 'PENDING_ASSIGNMENT'
    | 'ASSIGNED'
    | 'IN_QUALITY_REVIEW'
    | 'APPROVED'
    | 'En revisión'
    | 'En diseño'
    | 'Aprobada'
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
    designInstructions: string
    visualReferences: string
    requireDieCut: boolean
    requireMockup: boolean
    attachments: RequestAttachment[]
    assignedDesigners: { designerId: string; designerName: string }[]
    createdAt: string
}
