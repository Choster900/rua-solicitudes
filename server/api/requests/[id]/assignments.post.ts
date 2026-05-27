import {
    addDesignerAssignment,
    findDesignRequestById,
} from '../../../repositories/design-requests.repository'
import { requireRole } from '../../../utils/require-permission.util'

export default defineEventHandler(async (event) => {
    const sessionUser = requireRole(event, ['admin', 'disenador_jefe'])

    const requestId = String(getRouterParam(event, 'id') ?? '').trim()
    if (!requestId) {
        throw createError({ statusCode: 400, statusMessage: 'ID de solicitud inválido.' })
    }

    const body = (await readBody(event)) as { designerIds?: unknown } | null
    const designerIds = Array.isArray(body?.designerIds)
        ? body.designerIds.filter(
              (id): id is string => typeof id === 'string' && id.trim().length > 0,
          )
        : []

    if (!designerIds.length) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Debes enviar al menos un designerId en el arreglo designerIds.',
        })
    }

    const request = await findDesignRequestById(requestId)
    if (!request) {
        throw createError({ statusCode: 404, statusMessage: 'Solicitud no encontrada.' })
    }

    const assignableStatuses: string[] = [
        'CREATED',
        'PENDING_DESIGN_REVIEW',
        'ASSIGNED_TO_DESIGNER',
    ]
    if (!assignableStatuses.includes(request.status)) {
        throw createError({
            statusCode: 422,
            statusMessage:
                'Solo se pueden asignar diseñadores a solicitudes pendientes o asignadas.',
        })
    }

    const alreadyAssignedIds = new Set(
        request.currentVersion?.assignments.map((a) => a.designerId) ?? [],
    )

    const toAssign = designerIds.filter((id) => !alreadyAssignedIds.has(id))

    if (!toAssign.length) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Todos los diseñadores indicados ya están asignados.',
        })
    }

    const results = await Promise.all(
        toAssign.map((designerId) =>
            addDesignerAssignment(requestId, designerId, '', sessionUser.sub),
        ),
    )

    return { assigned: toAssign.length, skipped: designerIds.length - toAssign.length, results }
})
