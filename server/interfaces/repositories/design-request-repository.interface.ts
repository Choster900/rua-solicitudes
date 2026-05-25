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
    createdAt: string
}

export interface CreateDesignRequestInput extends Omit<DesignRequestRecord, 'id' | 'createdAt'> {}
export interface UpdateDesignRequestInput extends Partial<CreateDesignRequestInput> {}
