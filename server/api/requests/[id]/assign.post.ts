import dayjs from 'dayjs'
import { isDesignLeadUserType } from '../../../interfaces/domain/user.interface'
import {
    findDesignRequestById,
    updateDesignRequest,
} from '../../../repositories/design-requests.repository'
import { findAuthUserById } from '../../../repositories/auth-users.repository'
import { prisma } from '../../../database/prisma'
import { requireSessionUser } from '../../../utils/auth-session.util'

export default defineEventHandler(async (event) => {
    const sessionUser = requireSessionUser(event)

    if (!isDesignLeadUserType(sessionUser.userType)) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Solo el jefe de diseño puede asignar solicitudes.',
        })
    }

    const requestId = String(getRouterParam(event, 'id') ?? '').trim()

    if (!requestId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID de solicitud inválido.',
        })
    }

    const body = (await readBody(event)) as { designerId?: unknown } | null
    const designerId = typeof body?.designerId === 'string' ? body.designerId.trim() : ''

    if (!designerId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Debes indicar el diseñador a asignar.',
        })
    }

    const designer = await findAuthUserById(designerId)

    if (!designer || designer.userType !== 'Diseñador') {
        throw createError({
            statusCode: 400,
            statusMessage: 'El usuario seleccionado no es un diseñador válido.',
        })
    }

    const sourceRequest = await findDesignRequestById(requestId)

    if (!sourceRequest) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Solicitud no encontrada.',
        })
    }

    const assignableStatuses = ['PENDING_ASSIGNMENT', 'ASSIGNED', 'REJECTED']
    if (!assignableStatuses.includes(sourceRequest.status)) {
        throw createError({
            statusCode: 409,
            statusMessage: `No se puede asignar una solicitud en estado ${sourceRequest.status}.`,
        })
    }

    const previousStatus = sourceRequest.status
    const previousDesignerId = sourceRequest.assignedDesignerId
    const nowIso = dayjs().toISOString()
    const isReassignment = Boolean(previousDesignerId && previousDesignerId !== designerId)

    const updatedRequest = await updateDesignRequest(requestId, {
        status: 'ASSIGNED',
        assignedDesignerId: designerId,
        assignedById: sessionUser.sub,
        assignedAt: nowIso,
    })

    await prisma.designRequestVersion.upsert({
        where: {
            requestId_versionNumber: {
                requestId,
                versionNumber: updatedRequest.currentVersion,
            },
        },
        create: {
            requestId,
            versionNumber: updatedRequest.currentVersion,
            designerId,
            reviewStatus: 'PENDING',
        },
        update: {
            designerId,
        },
    })

    await prisma.designRequestEvent.create({
        data: {
            requestId,
            eventType: isReassignment ? 'REASSIGNED' : 'ASSIGNED',
            actorId: sessionUser.sub,
            fromStatus: previousStatus,
            toStatus: 'ASSIGNED',
            metadata: {
                designerId,
                designerName: designer.fullName,
                previousDesignerId,
            },
        },
    })

    return updatedRequest
})
