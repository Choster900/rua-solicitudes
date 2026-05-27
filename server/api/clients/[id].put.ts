import {
    findClientByTaxId,
    findClientById,
    updateClient,
} from '../../repositories/clients.repository'
import { parseUpdateClientDto } from '../dtos/clients'

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

    const name = body.name?.trim() ?? sourceClient.name
    const taxId = body.taxId?.trim() ?? sourceClient.taxId
    const contactName = body.contactName?.trim() ?? sourceClient.contactName
    const contactEmail = body.contactEmail?.trim().toLowerCase() ?? sourceClient.contactEmail
    const contactPhone = body.contactPhone?.trim() ?? sourceClient.contactPhone
    const country = body.country?.trim() ?? sourceClient.country
    const department = body.department?.trim() ?? sourceClient.department
    const city = body.city?.trim() ?? sourceClient.city
    const addressLine = body.addressLine?.trim() ?? sourceClient.addressLine
    const addressReference = body.addressReference?.trim() ?? sourceClient.addressReference
    const notes = body.notes?.trim() ?? sourceClient.notes
    const isActive = body.isActive !== undefined ? Boolean(body.isActive) : sourceClient.isActive

    if (!name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'El nombre del cliente es requerido.',
        })
    }

    if (taxId) {
        const duplicatedTaxId = await findClientByTaxId(taxId)
        if (duplicatedTaxId && duplicatedTaxId.id !== clientId) {
            throw createError({
                statusCode: 409,
                statusMessage: `Ya existe un cliente con el NIT/Documento Fiscal ${taxId}.`,
            })
        }
    }

    return await updateClient(clientId, {
        name,
        taxId,
        contactName,
        contactEmail,
        contactPhone,
        country,
        department,
        city,
        addressLine,
        addressReference,
        notes,
        isActive,
    })
})
