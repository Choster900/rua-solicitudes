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
            statusMessage: 'Solo el área de calidad puede aprobar solicitudes.',
        })
    }

    const requestId = String(getRouterParam(event, 'id') ?? '').trim()
    if (!requestId) {
        throw createError({ statusCode: 400, statusMessage: 'ID de solicitud inválido.' })
    }

    const sourceRequest = await findDesignRequestById(requestId)
    if (!sourceRequest) {
        throw createError({ statusCode: 404, statusMessage: 'Solicitud no encontrada.' })
    }

    if (sourceRequest.status !== 'SENT_TO_QUALITY') {
        throw createError({
            statusCode: 409,
            statusMessage: 'Solo se pueden aprobar solicitudes en revisión de calidad.',
        })
    }

    return await updateDesignRequest(requestId, { status: 'QUALITY_APPROVED' })
})
