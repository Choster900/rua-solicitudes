import { parseAssignDesignerDto } from '../../dtos/requests'
import {
    addDesignerAssignment,
    findDesignRequestById,
} from '../../../repositories/design-requests.repository'
import { requireRole } from '../../../utils/require-permission.util'

export default defineEventHandler(async (event) => {
    requireRole(event, ['admin', 'disenador_jefe'])

    const requestId = String(getRouterParam(event, 'id') ?? '').trim()

    if (!requestId) {
        throw createError({ statusCode: 400, statusMessage: 'ID de solicitud inválido.' })
    }

    const body = parseAssignDesignerDto(await readBody(event))

    const request = await findDesignRequestById(requestId)

    if (!request) {
        throw createError({ statusCode: 404, statusMessage: 'Solicitud no encontrada.' })
    }

    const assignableStatuses = new Set(['PENDING_ASSIGNMENT', 'ASSIGNED'])

    if (!assignableStatuses.has(request.status)) {
        throw createError({
            statusCode: 422,
            statusMessage:
                'Solo se pueden asignar diseñadores a solicitudes en estado Pendiente de Asignación o Asignada.',
        })
    }

    const alreadyAssigned = request.assignedDesigners.some((a) => a.designerId === body.designerId)

    if (alreadyAssigned) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Este diseñador ya está asignado a esta solicitud.',
        })
    }

    return await addDesignerAssignment(requestId, body.designerId, body.designerName)
})
