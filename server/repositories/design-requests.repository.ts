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

type PrismaDesignRequest = {
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
    createdAt: Date
    designerAssignments?: Array<{ designerId: string; designerName: string }>
}

const toDesignRequestRecord = (source: PrismaDesignRequest): DesignRequestRecord => {
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
        assignedDesigners: (source.designerAssignments ?? []).map((a) => ({
            designerId: a.designerId,
            designerName: a.designerName,
        })),
        createdAt: dayjs(source.createdAt).toISOString(),
    }
}

const withAssignments = { designerAssignments: true } as const

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
        orderBy: { createdAt: 'desc' },
        include: withAssignments,
    })

    return requests.map(toDesignRequestRecord)
}

export const findDesignRequestById = async (requestId: string) => {
    const request = await prisma.designRequest.findUnique({
        where: { id: requestId },
        include: withAssignments,
    })

    return request ? toDesignRequestRecord(request) : null
}

export const findDesignRequestByCode = async (requestCode: string) => {
    const normalizedCode = requestCode.trim()
    const request = await prisma.designRequest.findFirst({
        where: { requestCode: { equals: normalizedCode, mode: 'insensitive' } },
        include: withAssignments,
    })

    return request ? toDesignRequestRecord(request) : null
}

export const createDesignRequest = async (payload: CreateDesignRequestInput) => {
    const createdRequest = await prisma.designRequest.create({
        data: toRequestDataPayload(payload),
        include: withAssignments,
    })

    return toDesignRequestRecord(createdRequest)
}

export const updateDesignRequest = async (requestId: string, payload: UpdateDesignRequestInput) => {
    const updatedRequest = await prisma.designRequest.update({
        where: { id: requestId },
        data: toRequestDataPayload(payload),
        include: withAssignments,
    })

    return toDesignRequestRecord(updatedRequest)
}

export const deleteDesignRequestById = async (requestId: string) => {
    const deletedRequest = await prisma.designRequest.delete({
        where: { id: requestId },
        include: withAssignments,
    })

    return toDesignRequestRecord(deletedRequest)
}

export const addDesignerAssignment = async (
    requestId: string,
    designerId: string,
    designerName: string,
): Promise<DesignRequestRecord> => {
    await prisma.requestDesignerAssignment.create({
        data: { requestId, designerId, designerName },
    })

    await prisma.designRequest.updateMany({
        where: { id: requestId, status: { in: ['PENDING_ASSIGNMENT', 'Borrador'] } },
        data: { status: 'ASSIGNED' },
    })

    const updated = await prisma.designRequest.findUniqueOrThrow({
        where: { id: requestId },
        include: withAssignments,
    })

    return toDesignRequestRecord(updated)
}

export const removeDesignerAssignment = async (
    requestId: string,
    designerId: string,
): Promise<DesignRequestRecord> => {
    await prisma.requestDesignerAssignment.delete({
        where: { requestId_designerId: { requestId, designerId } },
    })

    const remaining = await prisma.requestDesignerAssignment.count({ where: { requestId } })

    if (remaining === 0) {
        await prisma.designRequest.updateMany({
            where: { id: requestId, status: 'ASSIGNED' },
            data: { status: 'PENDING_ASSIGNMENT' },
        })
    }

    const updated = await prisma.designRequest.findUniqueOrThrow({
        where: { id: requestId },
        include: withAssignments,
    })

    return toDesignRequestRecord(updated)
}
