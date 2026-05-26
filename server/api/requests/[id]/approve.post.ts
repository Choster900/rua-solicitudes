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
            statusMessage: 'Solo el área de calidad puede aprobar solicitudes.',
        })
    }

    const requestId = String(getRouterParam(event, 'id') ?? '').trim()
    if (!requestId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID de solicitud inválido.',
        })
    }

    const body = (await readBody(event)) as { comments?: unknown } | null
    const reviewComments = typeof body?.comments === 'string' ? body.comments.trim() : ''

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
            statusMessage: `Solo se pueden aprobar solicitudes en revisión de calidad.`,
        })
    }

    const nowIso = dayjs().toISOString()

    const updatedRequest = await updateDesignRequest(requestId, {
        status: 'APPROVED',
        approvedById: sessionUser.sub,
        approvedAt: nowIso,
    })

    await prisma.designRequestVersion.update({
        where: {
            requestId_versionNumber: {
                requestId,
                versionNumber: updatedRequest.currentVersion,
            },
        },
        data: {
            reviewStatus: 'APPROVED',
            reviewedById: sessionUser.sub,
            reviewedAt: dayjs(nowIso).toDate(),
            reviewComments: reviewComments || undefined,
        },
    })

    await prisma.designRequestEvent.create({
        data: {
            requestId,
            eventType: 'QUALITY_APPROVED',
            actorId: sessionUser.sub,
            fromStatus: 'IN_QUALITY_REVIEW',
            toStatus: 'APPROVED',
            metadata: {
                versionNumber: updatedRequest.currentVersion,
                reviewComments,
            },
        },
    })

    return updatedRequest
})
