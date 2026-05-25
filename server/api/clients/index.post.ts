import type { ClientStatus } from '~/presentation/interfaces/clients/client.interface'
import { createClient, findClientByCode } from '../../repositories/clients.repository'

interface CreateClientBody {
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
  const body = await readBody<CreateClientBody>(event)
  const code = body.code?.trim().toUpperCase() ?? ''
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

  if (!code || !name || !segment || !contactName || !contactEmail || !contactPhone || !country || !department || !city || !addressLine) {
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
      statusMessage: `Ya existe un cliente con el código ${code}.`,
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
