import Joi from 'joi'
import type { AssignDesignerDto, CreateRequestDto } from '../../../interfaces/dtos/requests'

const versionSchema = Joi.object({
    materialType: Joi.string().trim().allow('').optional(),
    materialWeight: Joi.string().trim().allow('').optional(),
    closureType: Joi.string().trim().allow('').optional(),
    fluteType: Joi.string().trim().allow('').optional(),
    fluteDirection: Joi.string().trim().allow('').optional(),
    outerLiner: Joi.string().trim().allow('').optional(),
    innerLiner: Joi.string().trim().allow('').optional(),
    printTechnique: Joi.string().trim().allow('').optional(),
    colorMode: Joi.string().trim().allow('').optional(),
    pantoneReferences: Joi.string().trim().allow('').optional(),
    length: Joi.number().positive().optional(),
    width: Joi.number().positive().optional(),
    height: Joi.number().positive().optional(),
    dimensionUnit: Joi.string().trim().valid('cm', 'mm', 'in').optional(),
    quantity: Joi.number().integer().min(0).optional(),
    finishingOptions: Joi.array().items(Joi.string().trim()).optional(),
    deliverables: Joi.array().items(Joi.string().trim()).optional(),
    designInstructions: Joi.string().trim().allow('').optional(),
    visualReferences: Joi.string().trim().allow('').optional(),
    requireDieCut: Joi.boolean().optional(),
    requireMockup: Joi.boolean().optional(),
})

const sampleFileSchema = Joi.object({
    base64Content: Joi.string().required(),
    mimeType: Joi.string()
        .valid(
            'image/jpeg',
            'image/png',
            'image/webp',
            'application/pdf',
            'image/vnd.adobe.photoshop',
            'application/illustrator',
        )
        .required(),
    originalName: Joi.string().trim().required(),
    notes: Joi.string().trim().allow('').optional(),
})

export const createRequestDtoSchema = Joi.object<CreateRequestDto>({
    clientId: Joi.string().trim().required(),
    title: Joi.string().trim().required(),
    brandName: Joi.string().trim().allow('').optional(),
    productName: Joi.string().trim().required(),
    priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT').optional(),
    requiredDate: Joi.string().isoDate().optional(),
    version: versionSchema.optional(),
    sampleFiles: Joi.array().items(sampleFileSchema).optional(),
})

export const assignDesignerDtoSchema = Joi.object<AssignDesignerDto>({
    designerId: Joi.string().trim().required(),
    designerName: Joi.string().trim().required(),
})
