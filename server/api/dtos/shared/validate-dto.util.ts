import Joi from 'joi'

const DEFAULT_DTO_ERROR_MESSAGE = 'El payload enviado no tiene un formato válido.'

export const validateDto = <T>(
    payload: unknown,
    schema: Joi.ObjectSchema<T>,
    statusMessage = DEFAULT_DTO_ERROR_MESSAGE,
): T => {
    const result = schema.validate(payload, {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: false,
        convert: true,
    })

    if (result.error) {
        throw createError({
            statusCode: 400,
            statusMessage,
        })
    }

    return result.value
}
