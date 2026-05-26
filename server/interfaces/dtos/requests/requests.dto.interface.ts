import type {
    RequestAttachment,
    RequestPriority,
    RequestStatus,
} from '../../domain/request.interface'

export interface CreateRequestDto {
    requestCode?: string
    clientName?: string
    brandName?: string
    productName?: string
    requestedBy?: string
    vendorName?: string
    materialType?: string
    materialWeight?: string
    fluteDirection?: string
    outerLiner?: string
    innerLiner?: string
    printTechnique?: string
    colorMode?: string
    pantoneReferences?: string
    finishingOptions?: string[]
    deliverables?: string[]
    dimensions?: string
    quantity?: number
    requiredDate?: string
    priority?: RequestPriority
    status?: RequestStatus
    designInstructions?: string
    visualReferences?: string
    requireArt?: boolean
    requireDieCut?: boolean
    requireMockup?: boolean
    attachments?: RequestAttachment[]
}

export interface UpdateRequestDto {
    requestCode?: string
    clientName?: string
    brandName?: string
    productName?: string
    requestedBy?: string
    vendorName?: string
    materialType?: string
    materialWeight?: string
    fluteDirection?: string
    outerLiner?: string
    innerLiner?: string
    printTechnique?: string
    colorMode?: string
    pantoneReferences?: string
    finishingOptions?: string[]
    deliverables?: string[]
    dimensions?: string
    quantity?: number
    requiredDate?: string
    priority?: RequestPriority
    status?: RequestStatus
    designInstructions?: string
    visualReferences?: string
    requireArt?: boolean
    requireDieCut?: boolean
    requireMockup?: boolean
    attachments?: RequestAttachment[]
}
