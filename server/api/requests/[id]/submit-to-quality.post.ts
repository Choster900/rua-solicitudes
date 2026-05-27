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

    const allowedStatuses: string[] = ['ASSIGNED_TO_DESIGNER', 'IN_DESIGN', 'QUALITY_REJECTED']
    if (!allowedStatuses.includes(sourceRequest.status)) {
        throw createError({
            statusCode: 409,
            statusMessage: `No se puede enviar a calidad desde el estado ${sourceRequest.status}.`,
        })
    }

    return await updateDesignRequest(requestId, { status: 'SENT_TO_QUALITY' })
})
