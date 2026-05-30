import { requireSessionUser } from '../../../utils/auth-session.util'
import { prisma } from '../../../database/prisma'

const QUALITY_ROLES = ['calidad', 'admin']

export default defineEventHandler(async (event) => {
    const sessionUser = requireSessionUser(event)

    const isQuality = sessionUser.roleCodes.some((r) => QUALITY_ROLES.includes(r))
    if (!isQuality) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Solo el área de calidad puede registrar revisiones.',
        })
    }

    const requestId = String(getRouterParam(event, 'id') ?? '').trim()
    if (!requestId) {
        throw createError({ statusCode: 400, statusMessage: 'ID de solicitud inválido.' })
    }

    const body = (await readBody(event)) as {
        decision?: unknown
        generalObservations?: unknown
        checklist?: unknown
    } | null

    const decision = typeof body?.decision === 'string' ? body.decision.trim().toUpperCase() : ''
    if (decision !== 'APPROVED' && decision !== 'REJECTED') {
        throw createError({
            statusCode: 400,
            statusMessage: 'El campo decision es requerido y debe ser APPROVED o REJECTED.',
        })
    }

    const generalObservations =
        typeof body?.generalObservations === 'string' ? body.generalObservations.trim() : ''

    const checklist = body?.checklist && typeof body.checklist === 'object' ? body.checklist : null

    // ── Cargar solicitud con versión activa y asignaciones ────────────────
    const request = await prisma.designRequest.findUnique({
        where: { id: requestId },
        include: {
            currentVersion: {
                include: {
                    assignments: {
                        where: { status: 'ACTIVE' },
                        select: { designerId: true, assignedById: true, isLeadDesigner: true },
                    },
                },
            },
        },
    })

    if (!request?.currentVersion) {
        throw createError({ statusCode: 404, statusMessage: 'Solicitud no encontrada.' })
    }

    if (request.status !== 'SENT_TO_QUALITY') {
        throw createError({
            statusCode: 409,
            statusMessage: `Solo se pueden revisar solicitudes en estado SENT_TO_QUALITY. Estado actual: ${request.status}.`,
        })
    }

    const currentVersion = request.currentVersion
    const now = new Date()

    // ── APROBACIÓN ────────────────────────────────────────────────────────
    if (decision === 'APPROVED') {
        await prisma.$transaction([
            prisma.qualityReview.create({
                data: {
                    versionId: currentVersion.id,
                    reviewedById: sessionUser.sub,
                    decision: 'APPROVED',
                    generalObservations,
                    checklist: checklist ?? undefined,
                    reviewedAt: now,
                },
            }),
            prisma.designRequestVersion.update({
                where: { id: currentVersion.id },
                data: { status: 'APPROVED', approvedAt: now },
            }),
            prisma.designRequest.update({
                where: { id: requestId },
                data: { status: 'QUALITY_APPROVED' },
            }),
        ])

        return {
            decision: 'APPROVED',
            requestStatus: 'QUALITY_APPROVED',
            versionId: currentVersion.id,
            versionNumber: currentVersion.versionNumber,
            message: 'Solicitud aprobada por calidad.',
        }
    }

    // ── RECHAZO — crear nueva versión y volver a diseño ───────────────────
    const nextVersionNumber = currentVersion.versionNumber + 1

    const result = await prisma.$transaction(async (tx) => {
        // 1. Registrar la revisión de rechazo
        await tx.qualityReview.create({
            data: {
                versionId: currentVersion.id,
                reviewedById: sessionUser.sub,
                decision: 'REJECTED',
                generalObservations,
                checklist: checklist ?? undefined,
                reviewedAt: now,
            },
        })

        // 2. Marcar la versión actual como rechazada
        await tx.designRequestVersion.update({
            where: { id: currentVersion.id },
            data: { status: 'REJECTED', rejectedAt: now },
        })

        // 3. Crear nueva versión con el mismo spec técnico y checklist limpio
        const newVersion = await tx.designRequestVersion.create({
            data: {
                requestId,
                versionNumber: nextVersionNumber,
                basedOnVersionId: currentVersion.id,
                createdById: sessionUser.sub,
                reason: 'QUALITY_REJECTION',
                status: 'IN_DESIGN',
                // Heredar especificaciones técnicas
                materialType: currentVersion.materialType,
                materialWeight: currentVersion.materialWeight,
                closureType: currentVersion.closureType,
                fluteType: currentVersion.fluteType,
                fluteDirection: currentVersion.fluteDirection,
                outerLiner: currentVersion.outerLiner,
                innerLiner: currentVersion.innerLiner,
                printTechnique: currentVersion.printTechnique,
                colorMode: currentVersion.colorMode,
                pantoneReferences: currentVersion.pantoneReferences,
                length: currentVersion.length,
                width: currentVersion.width,
                height: currentVersion.height,
                dimensionUnit: currentVersion.dimensionUnit,
                quantity: currentVersion.quantity,
                finishingOptions: currentVersion.finishingOptions,
                deliverables: currentVersion.deliverables,
                designInstructions: currentVersion.designInstructions,
                visualReferences: currentVersion.visualReferences,
                requireDieCut: currentVersion.requireDieCut,
                requireMockup: currentVersion.requireMockup,
                // Checklist limpio
                artCompleted: false,
                mechanicalCompleted: false,
                dummyCompleted: false,
                artCompletedAt: null,
                mechanicalCompletedAt: null,
                dummyCompletedAt: null,
            },
        })

        // 4. Re-asignar los mismos diseñadores a la nueva versión
        if (currentVersion.assignments.length > 0) {
            await tx.requestDesignerAssignment.createMany({
                data: currentVersion.assignments.map((a) => ({
                    versionId: newVersion.id,
                    designerId: a.designerId,
                    assignedById: a.assignedById,
                    isLeadDesigner: a.isLeadDesigner,
                    status: 'ACTIVE',
                })),
            })
        }

        // 5. Actualizar la solicitud: nueva versión activa, status vuelve a diseño con rechazo
        await tx.designRequest.update({
            where: { id: requestId },
            data: {
                currentVersionId: newVersion.id,
                status: 'QUALITY_REJECTED',
            },
        })

        return newVersion
    })

    return {
        decision: 'REJECTED',
        requestStatus: 'QUALITY_REJECTED',
        previousVersionId: currentVersion.id,
        previousVersionNumber: currentVersion.versionNumber,
        newVersionId: result.id,
        newVersionNumber: result.versionNumber,
        designersNotified: currentVersion.assignments.length,
        message: `Solicitud rechazada. Versión v${nextVersionNumber} creada y enviada de vuelta a los diseñadores asignados.`,
    }
})
