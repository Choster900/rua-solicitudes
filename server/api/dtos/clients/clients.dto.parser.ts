import { validateDto } from '../shared/validate-dto.util'
import { createClientDtoSchema, updateClientDtoSchema } from './clients.dto.schema'

export const parseCreateClientDto = (payload: unknown) => {
    return validateDto(
        payload,
        createClientDtoSchema,
        'Debes completar los campos requeridos para crear el cliente.',
    )
}

export const parseUpdateClientDto = (payload: unknown) => {
    return validateDto(
        payload,
        updateClientDtoSchema,
        'El payload enviado para actualizar cliente no es válido.',
    )
}
