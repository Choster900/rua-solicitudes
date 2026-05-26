import {
    findClientByCode,
    findClientByTaxId,
    findClientById,
    updateClient,
} from '../../repositories/clients.repository'
import { parseUpdateClientDto } from '../dtos/clients'
import { isClientStatus } from './clients.utils'

export default defineEventHandler(async (event) => {
    const clientId = String(getRouterParam(event, 'id') ?? '').trim()
    const body = parseUpdateClientDto(await readBody(event))

    if (!clientId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID de cliente inválido.',
        })
    }

    const sourceClient = await findClientById(clientId)

    if (!sourceClient) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Cliente no encontrado.',
        })
    }

    const code = sourceClient.code
    const name = body.name?.trim() ?? sourceClient.name
    const taxId = body.taxId?.trim() ?? sourceClient.taxId
    const segment = body.segment?.trim() ?? sourceClient.segment
    const contactName = body.contactName?.trim() ?? sourceClient.contactName
    const contactEmail = body.contactEmail?.trim().toLowerCase() ?? sourceClient.contactEmail
    const contactPhone = body.contactPhone?.trim() ?? sourceClient.contactPhone
    const country = body.country?.trim() ?? sourceClient.country
    const department = body.department?.trim() ?? sourceClient.department
    const city = body.city?.trim() ?? sourceClient.city
    const addressLine = body.addressLine?.trim() ?? sourceClient.addressLine
    const addressReference = body.addressReference?.trim() ?? sourceClient.addressReference
    const website = body.website?.trim() ?? sourceClient.website
    const googleMapsUrl = body.googleMapsUrl?.trim() ?? sourceClient.googleMapsUrl
    const notes = body.notes?.trim() ?? sourceClient.notes
    const status = body.status ?? sourceClient.status

    if (
        !code ||
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
            statusMessage: 'Debes completar los campos requeridos para actualizar el cliente.',
        })
    }

    if (!isClientStatus(status)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Estado de cliente no válido.',
        })
    }

    const duplicatedClient = await findClientByCode(code)

    if (duplicatedClient && duplicatedClient.id !== clientId) {
        throw createError({
            statusCode: 409,
            statusMessage: `Ya existe un cliente con el código ${code}.`,
        })
    }

    const duplicatedTaxId = await findClientByTaxId(taxId)

    if (duplicatedTaxId && duplicatedTaxId.id !== clientId) {
        throw createError({
            statusCode: 409,
            statusMessage: `Ya existe un cliente con el NIT/Documento Fiscal ${taxId}.`,
        })
    }

    return await updateClient(clientId, {
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
