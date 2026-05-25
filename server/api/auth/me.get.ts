import type { JwtPayloadBase } from '../../utils/auth-jwt.util'
import { verifyJwtToken } from '../../utils/auth-jwt.util'

interface SessionTokenPayload extends JwtPayloadBase {
  sub: string
  email: string
  employeeCode: string
  userType: string
  mustChangePassword?: boolean
}

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

    return {
      id: payload.sub,
      email: payload.email,
      employeeCode: payload.employeeCode,
      userType: payload.userType,
      mustChangePassword: Boolean(payload.mustChangePassword),
    }
  }
  catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthenticated.',
    })
  }
})
