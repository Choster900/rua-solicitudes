import { verifyJwtToken } from '../../utils/auth-jwt.util'
import { changeAuthUserPassword } from '../../services/auth.service'
import { parseChangePasswordDto } from '../dtos/auth'
import type { SessionTokenPayload } from '../../interfaces/api/auth-session.interface'

const getBearerToken = (authorizationHeader: string | undefined) => {
    if (!authorizationHeader) {
        return null
    }

    const [scheme, token] = authorizationHeader.split(' ')

    if (scheme?.toLowerCase() !== 'bearer' || !token) {
        return null
    }

    return token.trim()
}

export default defineEventHandler(async (event) => {
    const authorizationHeader = getRequestHeader(event, 'authorization')
    const bearerToken = getBearerToken(authorizationHeader)

    if (!bearerToken) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthenticated.',
        })
    }

    const body = parseChangePasswordDto(await readBody(event))
    const currentPassword = body.currentPassword?.trim() ?? ''
    const newPassword = body.newPassword?.trim() ?? ''

    if (!currentPassword || !newPassword) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Debes completar la contraseña actual y la nueva contraseña.',
        })
    }

    if (newPassword.length < 8) {
        throw createError({
            statusCode: 400,
            statusMessage: 'La nueva contraseña debe tener al menos 8 caracteres.',
        })
    }

    const runtimeConfig = useRuntimeConfig(event)
    let payload: SessionTokenPayload

    try {
        payload = verifyJwtToken<SessionTokenPayload>(bearerToken, {
            secret: runtimeConfig.authJwtSecret,
        })
    } catch {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthenticated.',
        })
    }

    const response = await changeAuthUserPassword(
        {
            userId: payload.sub,
            currentPassword,
            newPassword,
        },
        {
            jwtSecret: runtimeConfig.authJwtSecret,
            accessTokenExpiresInSeconds: runtimeConfig.authAccessTokenExpiresInSeconds,
        },
    )

    if (!response) {
        throw createError({
            statusCode: 400,
            statusMessage: 'No se pudo actualizar la contraseña. Verifica tus credenciales.',
        })
    }

    return response
})
