import Joi from 'joi'
import type { CreateClientDto, UpdateClientDto } from '../../../interfaces/dtos/clients'

export const createClientDtoSchema = Joi.object<CreateClientDto>({
    code: Joi.string().trim().optional(),
    name: Joi.string().trim().optional(),
    taxId: Joi.string().trim().allow('').optional(),
    segment: Joi.string().trim().optional(),
    contactName: Joi.string().trim().optional(),
    contactEmail: Joi.string().trim().optional(),
    contactPhone: Joi.string().trim().optional(),
    country: Joi.string().trim().optional(),
    department: Joi.string().trim().optional(),
    city: Joi.string().trim().optional(),
    addressLine: Joi.string().trim().optional(),
    addressReference: Joi.string().trim().allow('').optional(),
    website: Joi.string().trim().allow('').optional(),
    googleMapsUrl: Joi.string().trim().allow('').optional(),
    notes: Joi.string().trim().allow('').optional(),
    status: Joi.string().trim().optional(),
})

export const updateClientDtoSchema = Joi.object<UpdateClientDto>({
    code: Joi.string().trim().optional(),
    name: Joi.string().trim().optional(),
    taxId: Joi.string().trim().allow('').optional(),
    segment: Joi.string().trim().optional(),
    contactName: Joi.string().trim().optional(),
    contactEmail: Joi.string().trim().optional(),
    contactPhone: Joi.string().trim().optional(),
    country: Joi.string().trim().optional(),
    department: Joi.string().trim().optional(),
    city: Joi.string().trim().optional(),
    addressLine: Joi.string().trim().optional(),
    addressReference: Joi.string().trim().allow('').optional(),
    website: Joi.string().trim().allow('').optional(),
    googleMapsUrl: Joi.string().trim().allow('').optional(),
    notes: Joi.string().trim().allow('').optional(),
    status: Joi.string().trim().optional(),
})
