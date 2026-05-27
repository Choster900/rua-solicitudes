import type { RequestPriority } from '../../domain/request.interface'

export interface CreateRequestVersionDto {
    materialType?: string
    materialWeight?: string
    closureType?: string
    fluteType?: string
    fluteDirection?: string
    outerLiner?: string
    innerLiner?: string
    printTechnique?: string
    colorMode?: string
    pantoneReferences?: string
    length?: number
    width?: number
    height?: number
    dimensionUnit?: string
    quantity?: number
    finishingOptions?: string[]
    deliverables?: string[]
    designInstructions?: string
    visualReferences?: string
    requireDieCut?: boolean
    requireMockup?: boolean
}

export interface CreateRequestSampleFileDto {
    base64Content: string
    mimeType: string
    originalName: string
    notes?: string
}

export interface CreateRequestDto {
    clientId: string
    title: string
    brandName?: string
    productName: string
    priority?: RequestPriority
    requiredDate?: string
    version?: CreateRequestVersionDto
    sampleFile?: CreateRequestSampleFileDto
}

export interface AssignDesignerDto {
    designerId: string
    designerName: string
}
