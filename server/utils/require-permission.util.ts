import type { H3Event } from 'h3'
import { verifyJwtToken } from './auth-jwt.util'
import type { SessionTokenPayload } from '../interfaces/api/auth-session.interface'
import type { RoleCode } from '../interfaces/domain/user.interface'

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

const readSession = (event: H3Event): SessionTokenPayload => {
    const bearerToken = getBearerToken(getRequestHeader(event, 'authorization'))

    if (!bearerToken) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthenticated.' })
    }

    try {
        const runtimeConfig = useRuntimeConfig(event)
        return verifyJwtToken<SessionTokenPayload>(bearerToken, {
            secret: runtimeConfig.authJwtSecret,
        })
    } catch {
        throw createError({ statusCode: 401, statusMessage: 'Unauthenticated.' })
    }
}

export const requireSession = (event: H3Event) => {
    return readSession(event)
}

export const requirePermission = (event: H3Event, permissionCode: string) => {
    const session = readSession(event)
    const granted = session.permissionCodes ?? []

    if (!granted.includes(permissionCode)) {
        throw createError({
            statusCode: 403,
            statusMessage: `Permiso requerido: ${permissionCode}.`,
        })
    }

    return session
}

export const requireRole = (event: H3Event, allowedRoles: RoleCode[]) => {
    const session = readSession(event)
    const userRoles = session.roleCodes ?? []
    const hasRole = userRoles.some((code) => allowedRoles.includes(code))

    if (!hasRole) {
        throw createError({
            statusCode: 403,
            statusMessage: `Rol no autorizado. Se requiere uno de: ${allowedRoles.join(', ')}.`,
        })
    }

    return session
}
