import dayjs from 'dayjs'
import type { RequestPriority } from '../../interfaces/domain/request.interface'
import { REQUEST_PRIORITIES } from '../../interfaces/domain/request.interface'
import {
    createDesignRequest,
    findDesignRequestByCode,
    getAllDesignRequests,
} from '../../repositories/design-requests.repository'
import { parseCreateRequestDto } from '../dtos/requests'
import { getSessionUser } from '../../utils/auth-session.util'

const allowedPriorities: RequestPriority[] = [...REQUEST_PRIORITIES]

const toRequestCode = (sequence: number) => {
    const year = dayjs().year()
    const paddedSequence = sequence.toString().padStart(3, '0')

    return `SOL-${year}-${paddedSequence}`
}

const getNextRequestCode = async () => {
    const allRequests = await getAllDesignRequests()
    const year = dayjs().year()
    const prefix = `SOL-${year}-`
    const yearSequences = allRequests
        .map((request) => request.requestCode)
        .filter((code) => code.startsWith(prefix))
        .map((code) => Number.parseInt(code.slice(prefix.length), 10))
        .filter((value) => Number.isFinite(value))

    const maxSequence = yearSequences.length ? Math.max(...yearSequences) : 0
    return toRequestCode(maxSequence + 1)
}

export default defineEventHandler(async (event) => {
    const body = parseCreateRequestDto(await readBody(event))
    const sessionUser = getSessionUser(event)
    const requestCode = body.requestCode?.trim().toUpperCase() || (await getNextRequestCode())

    const clientName = body.clientName?.trim() ?? ''
    const brandName = body.brandName?.trim() ?? ''
    const productName = body.productName?.trim() ?? ''
    const requestedBy = body.requestedBy?.trim() ?? ''
    const vendorName = body.vendorName?.trim() ?? ''
    const materialType = body.materialType?.trim() ?? ''
    const materialWeight = body.materialWeight?.trim() ?? ''
    const fluteDirection = body.fluteDirection?.trim() ?? ''
    const outerLiner = body.outerLiner?.trim() ?? ''
    const innerLiner = body.innerLiner?.trim() ?? ''
    const printTechnique = body.printTechnique?.trim() ?? ''
    const colorMode = body.colorMode?.trim() ?? ''
    const pantoneReferences = body.pantoneReferences?.trim() ?? ''
    const finishingOptions = Array.isArray(body.finishingOptions) ? body.finishingOptions : []
    const deliverables = Array.isArray(body.deliverables) ? body.deliverables : []
    const dimensions = body.dimensions?.trim() ?? ''
    const quantity = Number(body.quantity ?? 0)
    const requiredDate = body.requiredDate?.trim() ?? ''
    const priority = body.priority ?? 'Media'
    const designInstructions = body.designInstructions?.trim() ?? ''
    const visualReferences = body.visualReferences?.trim() ?? ''
    const requireArt = typeof body.requireArt === 'boolean' ? body.requireArt : true
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
        fluteDirection,
        outerLiner,
        innerLiner,
        printTechnique,
        colorMode,
        pantoneReferences,
        finishingOptions,
        deliverables,
        dimensions,
        quantity: Math.floor(quantity),
        requiredDate,
        priority,
        status: 'PENDING_ASSIGNMENT',
        currentVersion: 1,
        createdById: sessionUser?.sub ?? null,
        assignedDesignerId: null,
        assignedById: null,
        assignedAt: null,
        approvedById: null,
        approvedAt: null,
        designInstructions,
        visualReferences,
        requireArt,
        requireDieCut,
        requireMockup,
        attachments,
    })
})
