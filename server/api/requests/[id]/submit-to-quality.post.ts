import {
    findDesignRequestById,
    updateDesignRequest,
} from '../../../repositories/design-requests.repository'
import { requireSessionUser } from '../../../utils/auth-session.util'

export default defineEventHandler(async (event) => {
    const sessionUser = requireSessionUser(event)

    const requestId = String(getRouterParam(event, 'id') ?? '').trim()
    if (!requestId) {
        throw createError({ statusCode: 400, statusMessage: 'ID de solicitud inválido.' })
    }

    const sourceRequest = await findDesignRequestById(requestId)
    if (!sourceRequest) {
        throw createError({ statusCode: 404, statusMessage: 'Solicitud no encontrada.' })
    }

    const isAssignedDesigner = sourceRequest.currentVersion?.assignments.some(
        (a) => a.designerId === sessionUser.sub,
    )
    const isLead =
        sessionUser.roleCodes.includes('disenador_jefe') || sessionUser.roleCodes.includes('admin')

    if (!isAssignedDesigner && !isLead) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Solo el diseñador asignado puede enviar a calidad.',
        })
    }

    const blockedStatuses: string[] = [
        'SENT_TO_QUALITY',
        'QUALITY_APPROVED',
        'DELIVERED_TO_SALES',
        'CANCELLED',
    ]
    if (blockedStatuses.includes(sourceRequest.status)) {
        throw createError({
            statusCode: 409,
            statusMessage: `No se puede enviar a calidad desde el estado ${sourceRequest.status}.`,
        })
    }

    const version = sourceRequest.currentVersion
    const checklistComplete =
        version?.artCompleted && version?.mechanicalCompleted && version?.dummyCompleted
    if (!checklistComplete) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Debes completar Arte, Mecánico y Dummie antes de enviar a calidad.',
        })
    }

    return await updateDesignRequest(requestId, { status: 'SENT_TO_QUALITY' })
})
