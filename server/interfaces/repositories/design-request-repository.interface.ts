import type { RequestAttachment, RequestPriority, RequestStatus } from '../domain/request.interface'

export interface DesignRequestRecord {
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
    createdById: string | null
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

export interface CreateDesignRequestInput extends Omit<DesignRequestRecord, 'id' | 'createdAt'> {}
export interface UpdateDesignRequestInput extends Partial<CreateDesignRequestInput> {}
