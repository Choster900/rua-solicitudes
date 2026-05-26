import dayjs from 'dayjs'
import {
    findDesignRequestById,
    updateDesignRequest,
} from '../../../repositories/design-requests.repository'
import { prisma } from '../../../database/prisma'
import { requireSessionUser } from '../../../utils/auth-session.util'

const QUALITY_USER_TYPES = ['Calidad', 'Administrador']

export default defineEventHandler(async (event) => {
    const sessionUser = requireSessionUser(event)

    if (!QUALITY_USER_TYPES.includes(sessionUser.userType)) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Solo el área de calidad puede rechazar solicitudes.',
        })
    }

    const requestId = String(getRouterParam(event, 'id') ?? '').trim()
    if (!requestId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID de solicitud inválido.',
        })
    }

    const body = (await readBody(event)) as {
        rejectionReason?: unknown
        comments?: unknown
    } | null

    const rejectionReason =
        typeof body?.rejectionReason === 'string' ? body.rejectionReason.trim() : ''
    const reviewComments = typeof body?.comments === 'string' ? body.comments.trim() : ''

    if (!rejectionReason) {
        throw createError({
            statusCode: 400,
            statusMessage: 'El motivo de rechazo es obligatorio.',
        })
    }

    const sourceRequest = await findDesignRequestById(requestId)
    if (!sourceRequest) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Solicitud no encontrada.',
        })
    }

    if (sourceRequest.status !== 'IN_QUALITY_REVIEW') {
        throw createError({
            statusCode: 409,
            statusMessage: `Solo se pueden rechazar solicitudes en revisión de calidad.`,
        })
    }

    if (!sourceRequest.assignedDesignerId) {
        throw createError({
            statusCode: 409,
            statusMessage: 'La solicitud no tiene diseñador asignado.',
        })
    }

    const nowIso = dayjs().toISOString()
    const currentVersionNumber = sourceRequest.currentVersion
    const nextVersionNumber = currentVersionNumber + 1
    const designerId = sourceRequest.assignedDesignerId

    await prisma.designRequestVersion.update({
        where: {
            requestId_versionNumber: {
                requestId,
                versionNumber: currentVersionNumber,
            },
        },
        data: {
            reviewStatus: 'REJECTED',
            reviewedById: sessionUser.sub,
            reviewedAt: dayjs(nowIso).toDate(),
            rejectionReason,
            reviewComments: reviewComments || undefined,
        },
    })

    await prisma.designRequestVersion.create({
        data: {
            requestId,
            versionNumber: nextVersionNumber,
            designerId,
            reviewStatus: 'PENDING',
        },
    })

    const updatedRequest = await updateDesignRequest(requestId, {
        status: 'REJECTED',
        currentVersion: nextVersionNumber,
    })

    await prisma.designRequestEvent.create({
        data: {
            requestId,
            eventType: 'QUALITY_REJECTED',
            actorId: sessionUser.sub,
            fromStatus: 'IN_QUALITY_REVIEW',
            toStatus: 'REJECTED',
            metadata: {
                rejectedVersion: currentVersionNumber,
                rejectionReason,
                reviewComments,
            },
        },
    })

    await prisma.designRequestEvent.create({
        data: {
            requestId,
            eventType: 'VERSION_CREATED',
            actorId: sessionUser.sub,
            fromStatus: 'REJECTED',
            toStatus: 'REJECTED',
            metadata: {
                versionNumber: nextVersionNumber,
                designerId,
            },
        },
    })

    return updatedRequest
})
