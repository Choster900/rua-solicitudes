import type {
  CreateVendorInput,
  UpdateVendorInput,
  VendorRecord,
} from '../interfaces/repositories/vendor-repository.interface'
import { prisma } from '../database/prisma'

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter(item => typeof item === 'string')
}

const toVendorRecord = (source: {
  id: string
  code: string
  fullName: string
  zone: string
  phone: string
  email: string
  assignedClientCodes: unknown
  monthlySalesUsd: number
  status: string
}): VendorRecord => {
  return {
    id: source.id,
    code: source.code,
    fullName: source.fullName,
    zone: source.zone,
    phone: source.phone,
    email: source.email,
    assignedClientCodes: toStringArray(source.assignedClientCodes),
    monthlySalesUsd: source.monthlySalesUsd,
    status: source.status as VendorRecord['status'],
  }
}

export const getAllVendors = async () => {
  const vendors = await prisma.vendor.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return vendors.map(toVendorRecord)
}

export const findVendorById = async (vendorId: string) => {
  const vendor = await prisma.vendor.findUnique({
    where: {
      id: vendorId,
    },
  })

  return vendor ? toVendorRecord(vendor) : null
}

export const findVendorByCode = async (vendorCode: string) => {
  const normalizedCode = vendorCode.trim()
  const vendor = await prisma.vendor.findFirst({
    where: {
      code: {
        equals: normalizedCode,
        mode: 'insensitive',
      },
    },
  })

  return vendor ? toVendorRecord(vendor) : null
}

export const createVendor = async (payload: CreateVendorInput) => {
  const createdVendor = await prisma.vendor.create({
    data: {
      ...payload,
      assignedClientCodes: payload.assignedClientCodes,
    },
  })

  return toVendorRecord(createdVendor)
}

export const updateVendor = async (vendorId: string, payload: UpdateVendorInput) => {
  const updatedVendor = await prisma.vendor.update({
    where: {
      id: vendorId,
    },
    data: {
      ...payload,
      ...(payload.assignedClientCodes ? { assignedClientCodes: payload.assignedClientCodes } : {}),
    },
  })

  return toVendorRecord(updatedVendor)
}

export const deleteVendorById = async (vendorId: string) => {
  const deletedVendor = await prisma.vendor.delete({
    where: {
      id: vendorId,
    },
  })

  return toVendorRecord(deletedVendor)
}
