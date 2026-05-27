import {
    findDesignRequestById,
    updateDesignRequest,
} from '../../repositories/design-requests.repository'
import { requireSessionUser } from '../../utils/auth-session.util'
import { REQUEST_STATUSES, REQUEST_PRIORITIES } from '../../interfaces/domain/request.interface'

export default defineEventHandler(async (event) => {
    requireSessionUser(event)

    const requestId = String(getRouterParam(event, 'id') ?? '').trim()
    if (!requestId) {
        throw createError({ statusCode: 400, statusMessage: 'ID de solicitud inválido.' })
    }

    const sourceRequest = await findDesignRequestById(requestId)
    if (!sourceRequest) {
        throw createError({ statusCode: 404, statusMessage: 'Solicitud no encontrada.' })
    }

    const body = (await readBody(event)) as {
        status?: string
        priority?: string
        title?: string
        brandName?: string
        productName?: string
        requiredDate?: string
    } | null

    const data: Record<string, unknown> = {}

    if (body?.status !== undefined) {
        if (!REQUEST_STATUSES.includes(body.status as never)) {
            throw createError({ statusCode: 400, statusMessage: 'Estado no válido.' })
        }
        data.status = body.status
    }

    if (body?.priority !== undefined) {
        if (!REQUEST_PRIORITIES.includes(body.priority as never)) {
            throw createError({ statusCode: 400, statusMessage: 'Prioridad no válida.' })
        }
        data.priority = body.priority
    }

    if (body?.title) data.title = body.title.trim()
    if (body?.brandName !== undefined) data.brandName = body.brandName.trim()
    if (body?.productName) data.productName = body.productName.trim()
    if (body?.requiredDate) data.requiredDate = new Date(body.requiredDate)

    if (Object.keys(data).length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'No se enviaron campos para actualizar.',
        })
    }

    return await updateDesignRequest(requestId, data)
})
