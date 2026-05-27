import { verifyJwtToken } from '../../utils/auth-jwt.util'
import type { SessionTokenPayload } from '../../interfaces/api/auth-session.interface'
import { ROLE_NAME_BY_CODE } from '../../interfaces/domain/user.interface'

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

export default defineEventHandler((event) => {
    const authorizationHeader = getRequestHeader(event, 'authorization')
    const bearerToken = getBearerToken(authorizationHeader)

    if (!bearerToken) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthenticated.',
        })
    }

    try {
        const runtimeConfig = useRuntimeConfig(event)
        const payload = verifyJwtToken<SessionTokenPayload>(bearerToken, {
            secret: runtimeConfig.authJwtSecret,
        })

        const roles = (payload.roleCodes ?? []).map((code) => ({
            code,
            name: ROLE_NAME_BY_CODE[code] ?? code,
        }))
        const primaryRole = payload.primaryRole
            ? {
                  code: payload.primaryRole,
                  name: ROLE_NAME_BY_CODE[payload.primaryRole] ?? payload.primaryRole,
              }
            : null

        return {
            id: payload.sub,
            email: payload.email,
            employeeCode: payload.employeeCode,
            roles,
            primaryRole,
            permissions: payload.permissionCodes ?? [],
            userType: primaryRole?.name ?? null,
            mustChangePassword: Boolean(payload.mustChangePassword),
        }
    } catch {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthenticated.',
        })
    }
})
