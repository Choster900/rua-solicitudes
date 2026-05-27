import {
    createDesignRequest,
    findDesignRequestByCode,
    generateRequestCode,
} from '../../repositories/design-requests.repository'
import { parseCreateRequestDto } from '../dtos/requests'
import { requireSessionUser } from '../../utils/auth-session.util'
import { prisma } from '../../database/prisma'

export default defineEventHandler(async (event) => {
    const sessionUser = requireSessionUser(event)
    const body = parseCreateRequestDto(await readBody(event))

    // Verificar que el cliente existe
    const client = await prisma.client.findUnique({ where: { id: body.clientId } })
    if (!client) {
        throw createError({ statusCode: 404, statusMessage: 'Cliente no encontrado.' })
    }

    // Generar código único
    const code = await generateRequestCode()

    const duplicate = await findDesignRequestByCode(code)
    if (duplicate) {
        throw createError({
            statusCode: 409,
            statusMessage: `Ya existe una solicitud con el código ${code}.`,
        })
    }

    // Calcular sizeBytes del base64 si viene archivo
    const sampleFileInput = body.sampleFile
        ? {
              uploadedById: sessionUser.sub,
              originalName: body.sampleFile.originalName,
              mimeType: body.sampleFile.mimeType,
              base64Content: body.sampleFile.base64Content,
              notes: body.sampleFile.notes ?? '',
              sizeBytes: Math.round((body.sampleFile.base64Content.length * 3) / 4),
          }
        : undefined

    const result = await createDesignRequest({
        code,
        clientId: body.clientId,
        sellerId: sessionUser.sub,
        title: body.title,
        brandName: body.brandName ?? body.productName,
        productName: body.productName,
        priority: body.priority ?? 'MEDIUM',
        requiredDate: body.requiredDate,
        version: body.version,
        sampleFile: sampleFileInput,
    })

    return result
})
