import type { RequestPriority } from '~/presentation/interfaces/requests/request.interface'

export interface SampleFileInput {
    base64Content: string
    mimeType: string
    originalName: string
    notes: string
}

export interface DesignRequestFormModel {
    // Header
    clientId: string
    title: string
    brandName: string
    productName: string
    priority: RequestPriority
    requiredDate: string

    // Version — material
    materialType: string
    materialWeight: string
    fluteType: string
    fluteDirection: string
    closureType: string
    outerLiner: string
    innerLiner: string

    // Version — print
    colorMode: string
    pantoneReferences: string

    // Version — dimensions
    length: string
    width: string
    height: string
    dimensionUnit: string

    // Version — production
    quantity: string
    finishingOptions: string[]
    deliverables: string[]
    designInstructions: string
    requireDieCut: boolean
    requireMockup: boolean

    // Files
    sampleFiles: SampleFileInput[]
}
