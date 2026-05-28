import dayjs from 'dayjs'
import type { Prisma } from '@prisma/client'
import { prisma } from '../database/prisma'

// ─── Code generation ──────────────────────────────────────────────────────────

export const generateRequestCode = async (): Promise<string> => {
    const year = dayjs().year()
    const prefix = `SOL-${year}-`

    const latest = await prisma.designRequest.findFirst({
        where: { code: { startsWith: prefix } },
        orderBy: { code: 'desc' },
        select: { code: true },
    })

    const lastSequence = latest ? Number.parseInt(latest.code.slice(prefix.length), 10) : 0

    const next = Number.isFinite(lastSequence) ? lastSequence + 1 : 1
    return `${prefix}${next.toString().padStart(3, '0')}`
}

// ─── Read ─────────────────────────────────────────────────────────────────────

const withVersionAssignments = {
    include: {
        assignments: {
            select: { designerId: true, designer: { select: { fullName: true } } },
        },
    },
} as const

export const getAllDesignRequests = () =>
    prisma.designRequest.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            client: { select: { id: true, name: true, code: true } },
            seller: { select: { id: true, fullName: true, employeeCode: true } },
            currentVersion: withVersionAssignments,
        },
    })

export const findDesignRequestById = (requestId: string) =>
    prisma.designRequest.findUnique({
        where: { id: requestId },
        include: {
            client: { select: { id: true, name: true, code: true } },
            seller: { select: { id: true, fullName: true, employeeCode: true } },
            currentVersion: {
                include: {
                    assignments: {
                        select: { designerId: true, designer: { select: { fullName: true } } },
                    },
                },
            },
            files: {
                where: { isActive: true },
                orderBy: { createdAt: 'asc' },
            },
        },
    })

export const findDesignRequestByCode = (code: string) =>
    prisma.designRequest.findUnique({ where: { code } })

export const deleteDesignRequestById = (requestId: string) =>
    prisma.designRequest.delete({ where: { id: requestId } })

// ─── Update ───────────────────────────────────────────────────────────────────

export const updateDesignRequest = (
    requestId: string,
    data: Prisma.DesignRequestUncheckedUpdateInput,
) =>
    prisma.designRequest.update({
        where: { id: requestId },
        data,
        include: {
            client: { select: { id: true, name: true, code: true } },
            seller: { select: { id: true, fullName: true, employeeCode: true } },
            currentVersion: true,
        },
    })

// ─── Designer assignments ─────────────────────────────────────────────────────

export const addDesignerAssignment = async (
    requestId: string,
    designerId: string,
    _designerName: string,
    assignedById: string,
) => {
    const request = await prisma.designRequest.findUnique({
        where: { id: requestId },
        select: { currentVersionId: true },
    })

    if (!request?.currentVersionId) {
        throw new Error('La solicitud no tiene versión activa.')
    }

    return prisma.requestDesignerAssignment.create({
        data: {
            versionId: request.currentVersionId,
            designerId,
            assignedById,
        },
    })
}

export const removeDesignerAssignment = async (requestId: string, designerId: string) => {
    const request = await prisma.designRequest.findUnique({
        where: { id: requestId },
        select: { currentVersionId: true },
    })

    if (!request?.currentVersionId) {
        throw new Error('La solicitud no tiene versión activa.')
    }

    return prisma.requestDesignerAssignment.delete({
        where: {
            versionId_designerId: {
                versionId: request.currentVersionId,
                designerId,
            },
        },
    })
}

// ─── Create ───────────────────────────────────────────────────────────────────

interface CreateRequestInput {
    code: string
    clientId: string
    sellerId: string
    title: string
    brandName: string
    productName: string
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    requiredDate?: string
    version?: {
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
    sampleFiles?: {
        uploadedById: string
        originalName: string
        mimeType: string
        sizeBytes: number
        base64Content: string
        notes?: string
    }[]
}

export const createDesignRequest = async (input: CreateRequestInput) => {
    return prisma.$transaction(async (tx) => {
        // 1. Crear la solicitud principal
        const request = await tx.designRequest.create({
            data: {
                code: input.code,
                clientId: input.clientId,
                sellerId: input.sellerId,
                title: input.title,
                brandName: input.brandName,
                productName: input.productName,
                priority: input.priority,
                status: 'CREATED',
                requiredDate: input.requiredDate ? dayjs(input.requiredDate).toDate() : undefined,
            },
        })

        // 2. Crear la versión inicial (v1)
        const version = await tx.designRequestVersion.create({
            data: {
                requestId: request.id,
                versionNumber: 1,
                createdById: input.sellerId,
                reason: 'INITIAL',
                status: 'IN_DESIGN',
                materialType: input.version?.materialType ?? null,
                materialWeight: input.version?.materialWeight ?? null,
                closureType: input.version?.closureType ?? null,
                fluteType: input.version?.fluteType ?? null,
                fluteDirection: input.version?.fluteDirection ?? null,
                outerLiner: input.version?.outerLiner ?? null,
                innerLiner: input.version?.innerLiner ?? null,
                printTechnique: input.version?.printTechnique ?? null,
                colorMode: input.version?.colorMode ?? null,
                pantoneReferences: input.version?.pantoneReferences ?? null,
                length: input.version?.length ?? null,
                width: input.version?.width ?? null,
                height: input.version?.height ?? null,
                dimensionUnit: input.version?.dimensionUnit ?? 'cm',
                quantity: input.version?.quantity ?? null,
                finishingOptions: input.version?.finishingOptions ?? [],
                deliverables: input.version?.deliverables ?? [],
                designInstructions: input.version?.designInstructions ?? '',
                visualReferences: input.version?.visualReferences ?? '',
                requireDieCut: input.version?.requireDieCut ?? false,
                requireMockup: input.version?.requireMockup ?? false,
            },
        })

        // 3. Apuntar currentVersionId a la versión recién creada
        await tx.designRequest.update({
            where: { id: request.id },
            data: { currentVersionId: version.id },
        })

        // 4. Guardar archivos de muestra si vienen
        const savedFiles = input.sampleFiles?.length
            ? await Promise.all(
                  input.sampleFiles.map((file) =>
                      tx.requestFile.create({
                          data: {
                              requestId: request.id,
                              versionId: version.id,
                              uploadedById: file.uploadedById,
                              origin: 'SALES',
                              category: 'SALES_REFERENCE',
                              originalName: file.originalName,
                              mimeType: file.mimeType,
                              sizeBytes: BigInt(file.sizeBytes),
                              base64Content: file.base64Content,
                              notes: file.notes ?? '',
                          },
                      }),
                  ),
              )
            : []

        return {
            ...request,
            currentVersionId: version.id,
            currentVersion: version,
            sampleFiles: savedFiles.map((f) => ({ ...f, sizeBytes: Number(f.sizeBytes) })),
        }
    })
}
