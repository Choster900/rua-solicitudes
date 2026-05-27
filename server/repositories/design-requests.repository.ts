import dayjs from 'dayjs'
import type {
    CreateDesignRequestInput,
    DesignRequestRecord,
    UpdateDesignRequestInput,
} from '../interfaces/repositories/design-request-repository.interface'
import { prisma } from '../database/prisma'

const toStringArray = (value: unknown): string[] => {
    if (!Array.isArray(value)) {
        return []
    }

    return value.filter((item) => typeof item === 'string')
}

const toAttachmentArray = (value: unknown): DesignRequestRecord['attachments'] => {
    if (!Array.isArray(value)) {
        return []
    }

    return value.filter((item): item is DesignRequestRecord['attachments'][number] => {
        if (!item || typeof item !== 'object') {
            return false
        }

        const attachment = item as Record<string, unknown>
        return (
            typeof attachment.id === 'string' &&
            typeof attachment.name === 'string' &&
            typeof attachment.extension === 'string' &&
            typeof attachment.sizeKb === 'number'
        )
    })
}

const toDesignRequestRecord = (source: {
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
    finishingOptions: unknown
    deliverables: unknown
    dimensions: string
    quantity: number
    requiredDate: Date
    priority: string
    status: string
    designInstructions: string
    visualReferences: string
    requireDieCut: boolean
    requireMockup: boolean
    attachments: unknown
    assignedDesignerId: string | null
    assignedDesignerName: string
    createdAt: Date
}): DesignRequestRecord => {
    return {
        id: source.id,
        requestCode: source.requestCode,
        clientName: source.clientName,
        brandName: source.brandName,
        productName: source.productName,
        requestedBy: source.requestedBy,
        vendorName: source.vendorName,
        materialType: source.materialType,
        materialWeight: source.materialWeight,
        printTechnique: source.printTechnique,
        colorMode: source.colorMode,
        pantoneReferences: source.pantoneReferences,
        finishingOptions: toStringArray(source.finishingOptions),
        deliverables: toStringArray(source.deliverables),
        dimensions: source.dimensions,
        quantity: source.quantity,
        requiredDate: dayjs(source.requiredDate).toISOString(),
        priority: source.priority as DesignRequestRecord['priority'],
        status: source.status as DesignRequestRecord['status'],
        designInstructions: source.designInstructions,
        visualReferences: source.visualReferences,
        requireDieCut: source.requireDieCut,
        requireMockup: source.requireMockup,
        attachments: toAttachmentArray(source.attachments),
        assignedDesignerId: source.assignedDesignerId,
        assignedDesignerName: source.assignedDesignerName,
        createdAt: dayjs(source.createdAt).toISOString(),
    }
}

const toRequestDataPayload = (payload: CreateDesignRequestInput | UpdateDesignRequestInput) => {
    return {
        ...payload,
        ...(payload.finishingOptions ? { finishingOptions: payload.finishingOptions } : {}),
        ...(payload.deliverables ? { deliverables: payload.deliverables } : {}),
        ...(payload.attachments ? { attachments: payload.attachments } : {}),
        ...(payload.requiredDate ? { requiredDate: dayjs(payload.requiredDate).toDate() } : {}),
    }
}

export const getAllDesignRequests = async () => {
    const requests = await prisma.designRequest.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    })

    return requests.map(toDesignRequestRecord)
}

export const findDesignRequestById = async (requestId: string) => {
    const request = await prisma.designRequest.findUnique({
        where: {
            id: requestId,
        },
    })

    return request ? toDesignRequestRecord(request) : null
}

export const findDesignRequestByCode = async (requestCode: string) => {
    const normalizedCode = requestCode.trim()
    const request = await prisma.designRequest.findFirst({
        where: {
            requestCode: {
                equals: normalizedCode,
                mode: 'insensitive',
            },
        },
    })

    return request ? toDesignRequestRecord(request) : null
}

export const createDesignRequest = async (payload: CreateDesignRequestInput) => {
    const createdRequest = await prisma.designRequest.create({
        data: toRequestDataPayload(payload),
    })

    return toDesignRequestRecord(createdRequest)
}

export const updateDesignRequest = async (requestId: string, payload: UpdateDesignRequestInput) => {
    const updatedRequest = await prisma.designRequest.update({
        where: {
            id: requestId,
        },
        data: toRequestDataPayload(payload),
    })

    return toDesignRequestRecord(updatedRequest)
}

export const deleteDesignRequestById = async (requestId: string) => {
    const deletedRequest = await prisma.designRequest.delete({
        where: {
            id: requestId,
        },
    })

    return toDesignRequestRecord(deletedRequest)
}
