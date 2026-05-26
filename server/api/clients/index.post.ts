import {
    createClient,
    findClientByCode,
    findClientByTaxId,
} from '../../repositories/clients.repository'
import { parseCreateClientDto } from '../dtos/clients'
import { generateClientCode, isClientStatus } from './clients.utils'

export default defineEventHandler(async (event) => {
    const body = parseCreateClientDto(await readBody(event))
    const code = generateClientCode()
    const name = body.name?.trim() ?? ''
    const taxId = body.taxId?.trim() ?? ''
    const segment = body.segment?.trim() ?? ''
    const contactName = body.contactName?.trim() ?? ''
    const contactEmail = body.contactEmail?.trim().toLowerCase() ?? ''
    const contactPhone = body.contactPhone?.trim() ?? ''
    const country = body.country?.trim() ?? ''
    const department = body.department?.trim() ?? ''
    const city = body.city?.trim() ?? ''
    const addressLine = body.addressLine?.trim() ?? ''
    const addressReference = body.addressReference?.trim() ?? ''
    const website = body.website?.trim() ?? ''
    const googleMapsUrl = body.googleMapsUrl?.trim() ?? ''
    const notes = body.notes?.trim() ?? ''
    const status = body.status ?? 'Prospecto'

    if (
        !name ||
        !taxId ||
        !segment ||
        !contactName ||
        !contactEmail ||
        !contactPhone ||
        !country ||
        !department ||
        !city ||
        !addressLine
    ) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Debes completar los campos requeridos para crear el cliente.',
        })
    }

    if (!isClientStatus(status)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Estado de cliente no válido.',
        })
    }

    const duplicatedClient = await findClientByCode(code)

    if (duplicatedClient) {
        throw createError({
            statusCode: 409,
            statusMessage: `Ya existe un cliente con el código ${code}. Por favor intenta crear el cliente de nuevo.`,
        })
    }

    const duplicatedTaxId = await findClientByTaxId(taxId)

    if (duplicatedTaxId) {
        throw createError({
            statusCode: 409,
            statusMessage: `Ya existe un cliente con el NIT/Documento Fiscal ${taxId}.`,
        })
    }

    return await createClient({
        code,
        name,
        taxId,
        segment,
        contactName,
        contactEmail,
        contactPhone,
        country,
        department,
        city,
        addressLine,
        addressReference,
        website,
        googleMapsUrl,
        notes,
        status,
    })
})
