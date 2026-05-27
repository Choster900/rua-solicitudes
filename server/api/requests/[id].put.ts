import type { RequestPriority, RequestStatus } from '../../interfaces/domain/request.interface'
import { REQUEST_PRIORITIES, REQUEST_STATUSES } from '../../interfaces/domain/request.interface'
import {
    findDesignRequestByCode,
    findDesignRequestById,
    updateDesignRequest,
} from '../../repositories/design-requests.repository'
import { parseUpdateRequestDto } from '../dtos/requests'

const allowedPriorities: RequestPriority[] = [...REQUEST_PRIORITIES]
const allowedStatuses: RequestStatus[] = [...REQUEST_STATUSES]

export default defineEventHandler(async (event) => {
    const requestId = String(getRouterParam(event, 'id') ?? '').trim()
    const body = parseUpdateRequestDto(await readBody(event))

    if (!requestId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID de solicitud inválido.',
        })
    }

    const sourceRequest = await findDesignRequestById(requestId)

    if (!sourceRequest) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Solicitud no encontrada.',
        })
    }

    const requestCode = body.requestCode?.trim().toUpperCase() ?? sourceRequest.requestCode
    const clientName = body.clientName?.trim() ?? sourceRequest.clientName
    const brandName = body.brandName?.trim() ?? sourceRequest.brandName
    const productName = body.productName?.trim() ?? sourceRequest.productName
    const requestedBy = body.requestedBy?.trim() ?? sourceRequest.requestedBy
    const vendorName = body.vendorName?.trim() ?? sourceRequest.vendorName
    const materialType = body.materialType?.trim() ?? sourceRequest.materialType
    const materialWeight = body.materialWeight?.trim() ?? sourceRequest.materialWeight
    const printTechnique = body.printTechnique?.trim() ?? sourceRequest.printTechnique
    const colorMode = body.colorMode?.trim() ?? sourceRequest.colorMode
    const pantoneReferences = body.pantoneReferences?.trim() ?? sourceRequest.pantoneReferences
    const finishingOptions = Array.isArray(body.finishingOptions)
        ? body.finishingOptions
        : sourceRequest.finishingOptions
    const deliverables = Array.isArray(body.deliverables)
        ? body.deliverables
        : sourceRequest.deliverables
    const dimensions = body.dimensions?.trim() ?? sourceRequest.dimensions
    const quantity = Number(body.quantity ?? sourceRequest.quantity)
    const requiredDate = body.requiredDate?.trim() ?? sourceRequest.requiredDate
    const priority = body.priority ?? sourceRequest.priority
    const status = body.status ?? sourceRequest.status
    const designInstructions = body.designInstructions?.trim() ?? sourceRequest.designInstructions
    const visualReferences = body.visualReferences?.trim() ?? sourceRequest.visualReferences
    const requireDieCut =
        typeof body.requireDieCut === 'boolean' ? body.requireDieCut : sourceRequest.requireDieCut
    const requireMockup =
        typeof body.requireMockup === 'boolean' ? body.requireMockup : sourceRequest.requireMockup
    const attachments = Array.isArray(body.attachments)
        ? body.attachments
        : sourceRequest.attachments
    const assignedDesignerId =
        'assignedDesignerId' in body
            ? (body.assignedDesignerId ?? null)
            : sourceRequest.assignedDesignerId
    const assignedDesignerName = body.assignedDesignerName ?? sourceRequest.assignedDesignerName

    if (
        !clientName ||
        !productName ||
        !requestedBy ||
        !vendorName ||
        !materialType ||
        !printTechnique ||
        !colorMode ||
        !dimensions ||
        !requiredDate ||
        !Number.isFinite(quantity) ||
        quantity <= 0
    ) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Debes completar los campos requeridos para actualizar la solicitud.',
        })
    }

    if (!allowedPriorities.includes(priority)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Prioridad no válida.',
        })
    }

    if (!allowedStatuses.includes(status)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Estado no válido.',
        })
    }

    const duplicatedRequest = await findDesignRequestByCode(requestCode)

    if (duplicatedRequest && duplicatedRequest.id !== requestId) {
        throw createError({
            statusCode: 409,
            statusMessage: `Ya existe una solicitud con el código ${requestCode}.`,
        })
    }

    return await updateDesignRequest(requestId, {
        requestCode,
        clientName,
        brandName,
        productName,
        requestedBy,
        vendorName,
        materialType,
        materialWeight,
        printTechnique,
        colorMode,
        pantoneReferences,
        finishingOptions,
        deliverables,
        dimensions,
        quantity: Math.floor(quantity),
        requiredDate,
        priority,
        status,
        designInstructions,
        visualReferences,
        requireDieCut,
        requireMockup,
        attachments,
        assignedDesignerId,
        assignedDesignerName,
    })
})
