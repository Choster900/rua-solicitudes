import Joi from 'joi'
import type { CreateClientDto, UpdateClientDto } from '../../../interfaces/dtos/clients'

const optionalText = Joi.string().trim().min(1).optional().allow(null)
const optionalEmptyText = Joi.string().trim().allow('').optional().allow(null)
const optionalEmail = Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .optional()
    .allow(null)

export const createClientDtoSchema = Joi.object<CreateClientDto>({
    code: optionalText,
    name: Joi.string().trim().min(1).required(),
    taxId: optionalText,
    contactName: optionalText,
    contactEmail: optionalEmail,
    contactPhone: optionalText,
    country: optionalText,
    department: optionalText,
    city: optionalText,
    addressLine: optionalText,
    addressReference: optionalEmptyText,
    notes: optionalEmptyText,
    isActive: Joi.boolean().optional(),
})

export const updateClientDtoSchema = Joi.object<UpdateClientDto>({
    name: optionalText,
    taxId: optionalText,
    contactName: optionalText,
    contactEmail: optionalEmail,
    contactPhone: optionalText,
    country: optionalText,
    department: optionalText,
    city: optionalText,
    addressLine: optionalText,
    addressReference: optionalEmptyText,
    notes: optionalEmptyText,
    isActive: Joi.boolean().optional(),
})
