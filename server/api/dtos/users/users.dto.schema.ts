import Joi from 'joi'
import type { CreateUserDto, UpdateUserDto } from '../../../interfaces/dtos/users'

export const createUserDtoSchema = Joi.object<CreateUserDto>({
    employeeCode: Joi.string().trim().optional(),
    fullName: Joi.string().trim().optional(),
    email: Joi.string().trim().optional(),
    phone: Joi.string().trim().allow('').optional(),
    userType: Joi.string().trim().optional(),
    department: Joi.string().trim().optional(),
    status: Joi.string().trim().optional(),
})

export const updateUserDtoSchema = Joi.object<UpdateUserDto>({
    employeeCode: Joi.string().trim().optional(),
    fullName: Joi.string().trim().optional(),
    email: Joi.string().trim().optional(),
    phone: Joi.string().trim().allow('').optional(),
    userType: Joi.string().trim().optional(),
    department: Joi.string().trim().optional(),
    status: Joi.string().trim().optional(),
})
