import {
    createClient,
    findClientByCode,
    findClientByTaxId,
} from '../../repositories/clients.repository'
import { parseCreateClientDto } from '../dtos/clients'
import { generateClientCode } from './clients.utils'

export default defineEventHandler(async (event) => {
    const body = parseCreateClientDto(await readBody(event))
    const code = body.code?.trim().toUpperCase() || generateClientCode()
    const name = body.name?.trim() ?? ''
    const taxId = body.taxId?.trim() || null
    const contactName = body.contactName?.trim() || null
    const contactEmail = body.contactEmail?.trim().toLowerCase() || null
    const contactPhone = body.contactPhone?.trim() || null
    const country = body.country?.trim() || null
    const department = body.department?.trim() || null
    const city = body.city?.trim() || null
    const addressLine = body.addressLine?.trim() || null
    const addressReference = body.addressReference?.trim() ?? ''
    const notes = body.notes?.trim() ?? ''

    if (!name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'El nombre del cliente es requerido.',
        })
    }

    const duplicatedClient = await findClientByCode(code)
    if (duplicatedClient) {
        throw createError({
            statusCode: 409,
            statusMessage: `Ya existe un cliente con el código ${code}.`,
        })
    }

    if (taxId) {
        const duplicatedTaxId = await findClientByTaxId(taxId)
        if (duplicatedTaxId) {
            throw createError({
                statusCode: 409,
                statusMessage: `Ya existe un cliente con el NIT/Documento Fiscal ${taxId}.`,
            })
        }
    }

    return await createClient({
        code,
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
        isActive: true,
    })
})
