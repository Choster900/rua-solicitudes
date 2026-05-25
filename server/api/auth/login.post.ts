import { loginWithSystemUser } from '../../services/auth.service'
import { isDatabaseConnectionAvailable } from '../../repositories/database-health.repository'
import { parseAuthLoginDto } from '../dtos/auth'

export default defineEventHandler(async (event) => {
    const body = parseAuthLoginDto(await readBody(event))
    const networkUser = body.networkUser?.trim() ?? ''
    const password = body.password?.trim() ?? ''

    if (!networkUser || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Debes proporcionar usuario y contraseña.',
        })
    }

    const runtimeConfig = useRuntimeConfig(event)
    const isDatabaseConnected = await isDatabaseConnectionAvailable(runtimeConfig.databaseUrl)

    if (!isDatabaseConnected) {
        throw createError({
            statusCode: 503,
            statusMessage:
                'No hay conexión a la base de datos. Verifica la conexión e inténtalo nuevamente.',
        })
    }

    const authResponse = await loginWithSystemUser(
        {
            networkUser,
            password,
        },
        {
            jwtSecret: runtimeConfig.authJwtSecret,
            accessTokenExpiresInSeconds: runtimeConfig.authAccessTokenExpiresInSeconds,
        },
    )

    if (!authResponse) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Credenciales inválidas.',
        })
    }

    return authResponse
})
