import Joi from 'joi'
import type { CreateClientDto, UpdateClientDto } from '../../../interfaces/dtos/clients'
import { CLIENT_STATUSES } from '../../../interfaces/domain/client.interface'

const requiredText = Joi.string().trim().min(1).required()
const optionalText = Joi.string().trim().min(1).optional()
const optionalEmptyText = Joi.string().trim().allow('').optional()
const optionalEmail = Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .optional()
const requiredEmail = Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
const optionalHttpUrl = Joi.string()
    .trim()
    .allow('')
    .pattern(/^https?:\/\//)
    .optional()
const requiredStatus = Joi.string()
    .trim()
    .valid(...CLIENT_STATUSES)
    .required()
const optionalStatus = Joi.string()
    .trim()
    .valid(...CLIENT_STATUSES)
    .optional()

export const createClientDtoSchema = Joi.object<CreateClientDto>({
    code: optionalText,
    name: requiredText,
    taxId: requiredText,
    segment: requiredText,
    contactName: requiredText,
    contactEmail: requiredEmail,
    contactPhone: requiredText,
    country: requiredText,
    department: requiredText,
    city: requiredText,
    addressLine: requiredText,
    addressReference: optionalEmptyText,
    website: optionalHttpUrl,
    googleMapsUrl: optionalHttpUrl,
    notes: optionalEmptyText,
    status: optionalStatus,
})

export const updateClientDtoSchema = Joi.object<UpdateClientDto>({
    code: optionalText,
    name: optionalText,
    taxId: optionalText,
    segment: optionalText,
    contactName: optionalText,
    contactEmail: optionalEmail,
    contactPhone: optionalText,
    country: optionalText,
    department: optionalText,
    city: optionalText,
    addressLine: optionalText,
    addressReference: optionalEmptyText,
    website: optionalHttpUrl,
    googleMapsUrl: optionalHttpUrl,
    notes: optionalEmptyText,
    status: optionalStatus,
})
