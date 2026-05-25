import Joi from 'joi'
import type { AuthLoginDto, ChangePasswordDto } from '../../../interfaces/dtos/auth'

export const authLoginDtoSchema = Joi.object<AuthLoginDto>({
    networkUser: Joi.string().trim().optional(),
    password: Joi.string().trim().optional(),
})

export const changePasswordDtoSchema = Joi.object<ChangePasswordDto>({
    currentPassword: Joi.string().trim().optional(),
    newPassword: Joi.string().trim().optional(),
})
