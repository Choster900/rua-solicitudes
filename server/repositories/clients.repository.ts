import type {
  ClientRecord,
  CreateClientInput,
  UpdateClientInput,
} from '../interfaces/repositories/client-repository.interface'
import { prisma } from '../database/prisma'

const toClientRecord = (source: {
  id: string
  code: string
  name: string
  taxId: string
  segment: string
  contactName: string
  contactEmail: string
  contactPhone: string
  country: string
  department: string
  city: string
  addressLine: string
  addressReference: string
  website: string
  googleMapsUrl: string
  notes: string
  status: string
}): ClientRecord => {
  return {
    id: source.id,
    code: source.code,
    name: source.name,
    taxId: source.taxId,
    segment: source.segment,
    contactName: source.contactName,
    contactEmail: source.contactEmail,
    contactPhone: source.contactPhone,
    country: source.country,
    department: source.department,
    city: source.city,
    addressLine: source.addressLine,
    addressReference: source.addressReference,
    website: source.website,
    googleMapsUrl: source.googleMapsUrl,
    notes: source.notes,
    status: source.status as ClientRecord['status'],
  }
}

export const getAllClients = async () => {
  const clients = await prisma.client.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return clients.map(toClientRecord)
}

export const findClientById = async (clientId: string) => {
  const client = await prisma.client.findUnique({
    where: {
      id: clientId,
    },
  })

  return client ? toClientRecord(client) : null
}

export const findClientByCode = async (clientCode: string) => {
  const normalizedCode = clientCode.trim()
  const client = await prisma.client.findFirst({
    where: {
      code: {
        equals: normalizedCode,
        mode: 'insensitive',
      },
    },
  })

  return client ? toClientRecord(client) : null
}

export const createClient = async (payload: CreateClientInput) => {
  const createdClient = await prisma.client.create({
    data: payload,
  })

  return toClientRecord(createdClient)
}

export const updateClient = async (clientId: string, payload: UpdateClientInput) => {
  const updatedClient = await prisma.client.update({
    where: {
      id: clientId,
    },
    data: payload,
  })

  return toClientRecord(updatedClient)
}

export const deleteClientById = async (clientId: string) => {
  const deletedClient = await prisma.client.delete({
    where: {
      id: clientId,
    },
  })

  return toClientRecord(deletedClient)
}
