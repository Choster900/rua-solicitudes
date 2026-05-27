import { validateDto } from '../shared/validate-dto.util'
import { assignDesignerDtoSchema, createRequestDtoSchema } from './requests.dto.schema'

export const parseCreateRequestDto = (payload: unknown) => {
    return validateDto(
        payload,
        createRequestDtoSchema,
        'Debes completar los campos requeridos para crear la solicitud.',
    )
}

export const parseAssignDesignerDto = (payload: unknown) => {
    return validateDto(
        payload,
        assignDesignerDtoSchema,
        'Se requieren designerId y designerName para asignar un diseñador.',
    )
}
