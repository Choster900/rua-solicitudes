import type { ClientStatus } from '~/presentation/interfaces/clients/client.interface'
import { findClientByCode, findClientById, updateClient } from '../../repositories/clients.repository'

interface UpdateClientBody {
  code?: string
  name?: string
  taxId?: string
  segment?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  country?: string
  department?: string
  city?: string
  addressLine?: string
  addressReference?: string
  website?: string
  googleMapsUrl?: string
  notes?: string
  status?: ClientStatus
}

const allowedStatuses: ClientStatus[] = ['Activo', 'Prospecto', 'Inactivo']

const isClientStatus = (value: string): value is ClientStatus => {
  return allowedStatuses.includes(value as ClientStatus)
}

export default defineEventHandler(async (event) => {
  const clientId = String(getRouterParam(event, 'id') ?? '').trim()
  const body = await readBody<UpdateClientBody>(event)

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

  const code = body.code?.trim().toUpperCase() ?? sourceClient.code
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

  if (!code || !name || !segment || !contactName || !contactEmail || !contactPhone || !country || !department || !city || !addressLine) {
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
