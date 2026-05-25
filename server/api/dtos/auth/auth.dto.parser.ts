import { validateDto } from '../shared/validate-dto.util'
import { authLoginDtoSchema, changePasswordDtoSchema } from './auth.dto.schema'

export const parseAuthLoginDto = (payload: unknown) => {
    return validateDto(payload, authLoginDtoSchema, 'Debes proporcionar usuario y contraseña.')
}

export const parseChangePasswordDto = (payload: unknown) => {
    return validateDto(
        payload,
        changePasswordDtoSchema,
        'Debes completar la contraseña actual y la nueva contraseña.',
    )
}
