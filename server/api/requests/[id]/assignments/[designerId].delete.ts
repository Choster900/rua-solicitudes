import {
    findDesignRequestById,
    removeDesignerAssignment,
} from '../../../../repositories/design-requests.repository'
import { requireRole } from '../../../../utils/require-permission.util'

export default defineEventHandler(async (event) => {
    requireRole(event, ['admin', 'disenador_jefe'])

    const requestId = String(getRouterParam(event, 'id') ?? '').trim()
    const designerId = String(getRouterParam(event, 'designerId') ?? '').trim()

    if (!requestId || !designerId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID de solicitud o diseñador inválido.',
        })
    }

    const request = await findDesignRequestById(requestId)

    if (!request) {
        throw createError({ statusCode: 404, statusMessage: 'Solicitud no encontrada.' })
    }

    const isAssigned = request.assignedDesigners.some((a) => a.designerId === designerId)

    if (!isAssigned) {
        throw createError({ statusCode: 404, statusMessage: 'Esta asignación no existe.' })
    }

    return await removeDesignerAssignment(requestId, designerId)
})
