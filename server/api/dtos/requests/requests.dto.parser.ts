import { validateDto } from '../shared/validate-dto.util'
import { createRequestDtoSchema, updateRequestDtoSchema } from './requests.dto.schema'

export const parseCreateRequestDto = (payload: unknown) => {
    return validateDto(
        payload,
        createRequestDtoSchema,
        'Debes completar los campos requeridos para crear la solicitud.',
    )
}

export const parseUpdateRequestDto = (payload: unknown) => {
    return validateDto(
        payload,
        updateRequestDtoSchema,
        'El payload enviado para actualizar solicitud no es válido.',
    )
}
