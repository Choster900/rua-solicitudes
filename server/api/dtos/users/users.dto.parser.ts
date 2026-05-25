import { validateDto } from '../shared/validate-dto.util'
import { createUserDtoSchema, updateUserDtoSchema } from './users.dto.schema'

export const parseCreateUserDto = (payload: unknown) => {
    return validateDto(
        payload,
        createUserDtoSchema,
        'Debes completar los campos requeridos para crear el usuario.',
    )
}

export const parseUpdateUserDto = (payload: unknown) => {
    return validateDto(
        payload,
        updateUserDtoSchema,
        'El payload enviado para actualizar usuario no es válido.',
    )
}
