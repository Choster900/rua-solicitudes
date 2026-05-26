import dayjs from 'dayjs'
import {
    findDesignRequestById,
    updateDesignRequest,
} from '../../../repositories/design-requests.repository'
import { prisma } from '../../../database/prisma'
import { requireSessionUser } from '../../../utils/auth-session.util'
import { isDesignLeadUserType } from '../../../interfaces/domain/user.interface'

export default defineEventHandler(async (event) => {
    const sessionUser = requireSessionUser(event)

    const requestId = String(getRouterParam(event, 'id') ?? '').trim()
    if (!requestId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID de solicitud inválido.',
        })
    }

    const body = (await readBody(event)) as { notes?: unknown } | null
    const designerNotes = typeof body?.notes === 'string' ? body.notes.trim() : ''

    const sourceRequest = await findDesignRequestById(requestId)
    if (!sourceRequest) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Solicitud no encontrada.',
        })
    }

    const isAssignedDesigner = sourceRequest.assignedDesignerId === sessionUser.sub
    const isLead = isDesignLeadUserType(sessionUser.userType)

    if (!isAssignedDesigner && !isLead) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Solo el diseñador asignado puede enviar a calidad.',
        })
    }

    const allowedFromStatuses = ['ASSIGNED', 'IN_DESIGN', 'REJECTED']
    if (!allowedFromStatuses.includes(sourceRequest.status)) {
        throw createError({
            statusCode: 409,
            statusMessage: `No se puede enviar a calidad desde el estado ${sourceRequest.status}.`,
        })
    }

    const nowIso = dayjs().toISOString()
    const previousStatus = sourceRequest.status

    const updatedRequest = await updateDesignRequest(requestId, {
        status: 'IN_QUALITY_REVIEW',
    })

    await prisma.designRequestVersion.update({
        where: {
            requestId_versionNumber: {
                requestId,
                versionNumber: updatedRequest.currentVersion,
            },
        },
        data: {
            submittedAt: dayjs(nowIso).toDate(),
            designerNotes: designerNotes || undefined,
            reviewStatus: 'PENDING',
        },
    })

    await prisma.designRequestEvent.create({
        data: {
            requestId,
            eventType: 'ART_SUBMITTED',
            actorId: sessionUser.sub,
            fromStatus: previousStatus,
            toStatus: 'IN_QUALITY_REVIEW',
            metadata: {
                versionNumber: updatedRequest.currentVersion,
                designerNotes,
            },
        },
    })

    return updatedRequest
})
