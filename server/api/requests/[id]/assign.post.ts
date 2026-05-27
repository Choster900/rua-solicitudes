import {
    findDesignRequestById,
    updateDesignRequest,
} from '../../../repositories/design-requests.repository'
import { findAuthUserById } from '../../../repositories/auth-users.repository'
import { requireRole } from '../../../utils/require-permission.util'

export default defineEventHandler(async (event) => {
    requireRole(event, ['admin', 'disenador_jefe'])

    const requestId = String(getRouterParam(event, 'id') ?? '').trim()
    if (!requestId) {
        throw createError({ statusCode: 400, statusMessage: 'ID de solicitud inválido.' })
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
    if (!designer) {
        throw createError({ statusCode: 400, statusMessage: 'El usuario seleccionado no existe.' })
    }

    const sourceRequest = await findDesignRequestById(requestId)
    if (!sourceRequest) {
        throw createError({ statusCode: 404, statusMessage: 'Solicitud no encontrada.' })
    }

    const assignableStatuses: string[] = [
        'CREATED',
        'PENDING_DESIGN_REVIEW',
        'ASSIGNED_TO_DESIGNER',
        'QUALITY_REJECTED',
    ]
    if (!assignableStatuses.includes(sourceRequest.status)) {
        throw createError({
            statusCode: 409,
            statusMessage: `No se puede asignar una solicitud en estado ${sourceRequest.status}.`,
        })
    }

    return await updateDesignRequest(requestId, { status: 'ASSIGNED_TO_DESIGNER' })
})
