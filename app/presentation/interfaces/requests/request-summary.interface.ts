import type { RequestStatus, RequestPriority } from './request.interface'

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
    assignedDesigners: { designerId: string; designerName: string; isLead: boolean }[]
    artCompleted: boolean
    mechanicalCompleted: boolean
    dummyCompleted: boolean
}

export type RequestsByStatus = Record<RequestStatus, RequestSummary[]>
