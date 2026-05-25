import dayjs from 'dayjs'
import type { RequestPriority, RequestStatus } from '../../interfaces/domain/request.interface'
import { REQUEST_PRIORITIES, REQUEST_STATUSES } from '../../interfaces/domain/request.interface'
import {
    createDesignRequest,
    findDesignRequestByCode,
    getAllDesignRequests,
} from '../../repositories/design-requests.repository'
import { parseCreateRequestDto } from '../dtos/requests'

const allowedPriorities: RequestPriority[] = [...REQUEST_PRIORITIES]
const allowedStatuses: RequestStatus[] = [...REQUEST_STATUSES]

const toRequestCode = (sequence: number) => {
    const year = dayjs().year()
    const paddedSequence = sequence.toString().padStart(3, '0')

    return `SOL-${year}-${paddedSequence}`
}

export default defineEventHandler(async (event) => {
    const body = parseCreateRequestDto(await readBody(event))
    const allRequests = await getAllDesignRequests()
    const fallbackCode = toRequestCode(allRequests.length + 1)
    const requestCode = body.requestCode?.trim().toUpperCase() || fallbackCode

    const clientName = body.clientName?.trim() ?? ''
    const brandName = body.brandName?.trim() ?? ''
    const productName = body.productName?.trim() ?? ''
    const requestedBy = body.requestedBy?.trim() ?? ''
    const vendorName = body.vendorName?.trim() ?? ''
    const materialType = body.materialType?.trim() ?? ''
    const materialWeight = body.materialWeight?.trim() ?? ''
    const printTechnique = body.printTechnique?.trim() ?? ''
    const colorMode = body.colorMode?.trim() ?? ''
    const pantoneReferences = body.pantoneReferences?.trim() ?? ''
    const finishingOptions = Array.isArray(body.finishingOptions) ? body.finishingOptions : []
    const deliverables = Array.isArray(body.deliverables) ? body.deliverables : []
    const dimensions = body.dimensions?.trim() ?? ''
    const quantity = Number(body.quantity ?? 0)
    const requiredDate = body.requiredDate?.trim() ?? ''
    const priority = body.priority ?? 'Media'
    const status = body.status ?? 'Borrador'
    const designInstructions = body.designInstructions?.trim() ?? ''
    const visualReferences = body.visualReferences?.trim() ?? ''
    const requireDieCut = Boolean(body.requireDieCut)
    const requireMockup = Boolean(body.requireMockup)
    const attachments = Array.isArray(body.attachments) ? body.attachments : []

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
            statusMessage: 'Debes completar los campos requeridos para crear la solicitud.',
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

    if (duplicatedRequest) {
        throw createError({
            statusCode: 409,
            statusMessage: `Ya existe una solicitud con el código ${requestCode}.`,
        })
    }

    return await createDesignRequest({
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
    })
})
