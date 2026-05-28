import type {
    RequestStatus,
    RequestPriority,
    RequestAttachment,
    RequestSampleFile,
} from './request.interface'

export interface RequestSummary {
    id: string
    code: string
    title: string
    clientId: string
    clientName: string
    clientCode: string
    sellerId: string
    sellerName: string
    brandName: string
    productName: string
    priority: RequestPriority
    status: RequestStatus
    requiredDate: string | null
    createdAt: string
    versionNumber: number
    assignedDesigners: { designerId: string; designerName: string; isLead: boolean }[]
    artCompleted: boolean
    mechanicalCompleted: boolean
    dummyCompleted: boolean
    sampleFiles: RequestSampleFile[]
    attachments: RequestAttachment[]
}

export type RequestsByStatus = Record<RequestStatus, RequestSummary[]>
