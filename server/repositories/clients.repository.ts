import type {
    ClientRecord,
    CreateClientInput,
    UpdateClientInput,
} from '../interfaces/repositories/client-repository.interface'
import dayjs from 'dayjs'
import { prisma } from '../database/prisma'

type PrismaClient = {
    id: string
    code: string
    name: string
    taxId: string | null
    contactName: string | null
    contactEmail: string | null
    contactPhone: string | null
    country: string | null
    department: string | null
    city: string | null
    addressLine: string | null
    addressReference: string
    notes: string
    isActive: boolean
    createdAt: Date
}

const toClientRecord = (source: PrismaClient): ClientRecord => ({
    id: source.id,
    code: source.code,
    name: source.name,
    taxId: source.taxId,
    contactName: source.contactName,
    contactEmail: source.contactEmail,
    contactPhone: source.contactPhone,
    country: source.country,
    department: source.department,
    city: source.city,
    addressLine: source.addressLine,
    addressReference: source.addressReference,
    notes: source.notes,
    isActive: source.isActive,
    createdAt: dayjs(source.createdAt).toISOString(),
})

export const getAllClients = async () => {
    const clients = await prisma.client.findMany({ orderBy: { createdAt: 'desc' } })
    return clients.map(toClientRecord)
}

export const findClientById = async (clientId: string) => {
    const client = await prisma.client.findUnique({ where: { id: clientId } })
    return client ? toClientRecord(client) : null
}

export const findClientByCode = async (clientCode: string) => {
    const client = await prisma.client.findFirst({
        where: { code: { equals: clientCode.trim(), mode: 'insensitive' } },
    })
    return client ? toClientRecord(client) : null
}

export const findClientByTaxId = async (taxId: string) => {
    const client = await prisma.client.findFirst({
        where: { taxId: { equals: taxId.trim(), mode: 'insensitive' } },
    })
    return client ? toClientRecord(client) : null
}

export const createClient = async (payload: CreateClientInput) => {
    const created = await prisma.client.create({ data: payload })
    return toClientRecord(created)
}

export const updateClient = async (clientId: string, payload: UpdateClientInput) => {
    const updated = await prisma.client.update({ where: { id: clientId }, data: payload })
    return toClientRecord(updated)
}

export const deleteClientById = async (clientId: string) => {
    const deleted = await prisma.client.delete({ where: { id: clientId } })
    return toClientRecord(deleted)
}
