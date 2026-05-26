import type { H3Event } from 'h3'
import { verifyJwtToken } from './auth-jwt.util'
import type { SessionTokenPayload } from '../interfaces/api/auth-session.interface'

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

export const getSessionUser = (event: H3Event): SessionTokenPayload | null => {
    const authorizationHeader = getRequestHeader(event, 'authorization')
    const bearerToken = getBearerToken(authorizationHeader)

    if (!bearerToken) {
        return null
    }

    try {
        const runtimeConfig = useRuntimeConfig(event)
        return verifyJwtToken<SessionTokenPayload>(bearerToken, {
            secret: runtimeConfig.authJwtSecret,
        })
    } catch {
        return null
    }
}

export const requireSessionUser = (event: H3Event): SessionTokenPayload => {
    const sessionUser = getSessionUser(event)

    if (!sessionUser) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthenticated.',
        })
    }

    return sessionUser
}
