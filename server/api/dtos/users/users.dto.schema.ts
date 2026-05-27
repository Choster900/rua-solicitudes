import Joi from 'joi'
import type { CreateUserDto, UpdateUserDto } from '../../../interfaces/dtos/users'
import { ROLE_CODES, USER_STATUSES } from '../../../interfaces/domain/user.interface'

export const createUserDtoSchema = Joi.object<CreateUserDto>({
    employeeCode: Joi.string().trim().optional(),
    fullName: Joi.string().trim().optional(),
    email: Joi.string().trim().optional(),
    phone: Joi.string().trim().allow('').optional(),
    roleCode: Joi.string()
        .trim()
        .valid(...ROLE_CODES)
        .optional(),
    department: Joi.string().trim().optional(),
    status: Joi.string()
        .trim()
        .valid(...USER_STATUSES)
        .optional(),
})

export const updateUserDtoSchema = Joi.object<UpdateUserDto>({
    employeeCode: Joi.string().trim().optional(),
    fullName: Joi.string().trim().optional(),
    email: Joi.string().trim().optional(),
    phone: Joi.string().trim().allow('').optional(),
    roleCode: Joi.string()
        .trim()
        .valid(...ROLE_CODES)
        .optional(),
    department: Joi.string().trim().optional(),
    status: Joi.string()
        .trim()
        .valid(...USER_STATUSES)
        .optional(),
})
