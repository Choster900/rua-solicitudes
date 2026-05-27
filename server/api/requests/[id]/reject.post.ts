import {
    findDesignRequestById,
    updateDesignRequest,
} from '../../../repositories/design-requests.repository'
import { requireSessionUser } from '../../../utils/auth-session.util'

export default defineEventHandler(async (event) => {
    const sessionUser = requireSessionUser(event)

    const isQuality =
        sessionUser.roleCodes.includes('calidad') || sessionUser.roleCodes.includes('admin')
    if (!isQuality) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Solo el área de calidad puede rechazar solicitudes.',
        })
    }

    const requestId = String(getRouterParam(event, 'id') ?? '').trim()
    if (!requestId) {
        throw createError({ statusCode: 400, statusMessage: 'ID de solicitud inválido.' })
    }

    const body = (await readBody(event)) as { rejectionReason?: unknown } | null
    const rejectionReason =
        typeof body?.rejectionReason === 'string' ? body.rejectionReason.trim() : ''

    if (!rejectionReason) {
        throw createError({
            statusCode: 400,
            statusMessage: 'El motivo de rechazo es obligatorio.',
        })
    }

    const sourceRequest = await findDesignRequestById(requestId)
    if (!sourceRequest) {
        throw createError({ statusCode: 404, statusMessage: 'Solicitud no encontrada.' })
    }

    if (sourceRequest.status !== 'SENT_TO_QUALITY') {
        throw createError({
            statusCode: 409,
            statusMessage: 'Solo se pueden rechazar solicitudes en revisión de calidad.',
        })
    }

    const hasDesigner = (sourceRequest.currentVersion?.assignments.length ?? 0) > 0
    if (!hasDesigner) {
        throw createError({
            statusCode: 409,
            statusMessage: 'La solicitud no tiene diseñador asignado.',
        })
    }

    return await updateDesignRequest(requestId, { status: 'QUALITY_REJECTED' })
})
