import { createHmac, timingSafeEqual } from 'node:crypto'

interface JwtHeader {
  alg: 'HS256'
  typ: 'JWT'
}

export interface JwtPayloadBase {
  iat: number
  exp: number
  [key: string]: unknown
}

const toBase64Url = (value: string) => {
  return Buffer.from(value, 'utf8')
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

const fromBase64Url = (value: string) => {
  const normalizedValue = value
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  const paddingLength = (4 - (normalizedValue.length % 4)) % 4
  const paddedValue = `${normalizedValue}${'='.repeat(paddingLength)}`

  return Buffer.from(paddedValue, 'base64').toString('utf8')
}

const signSegment = (data: string, secret: string) => {
  return createHmac('sha256', secret)
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

export const createJwtToken = (
  payload: Record<string, unknown>,
  options: {
    secret: string
    expiresInSeconds: number
  },
) => {
  const nowSeconds = Math.floor(Date.now() / 1000)
  const header: JwtHeader = {
    alg: 'HS256',
    typ: 'JWT',
  }
  const normalizedPayload: JwtPayloadBase = {
    ...payload,
    iat: nowSeconds,
    exp: nowSeconds + options.expiresInSeconds,
  }
  const encodedHeader = toBase64Url(JSON.stringify(header))
  const encodedPayload = toBase64Url(JSON.stringify(normalizedPayload))
  const signature = signSegment(`${encodedHeader}.${encodedPayload}`, options.secret)

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

export const verifyJwtToken = <TPayload extends JwtPayloadBase = JwtPayloadBase>(
  token: string,
  options: {
    secret: string
  },
): TPayload => {
  const parts = token.split('.')

  if (parts.length !== 3) {
    throw new Error('Malformed token')
  }

  const [encodedHeader, encodedPayload, providedSignature] = parts as [string, string, string]
  const expectedSignature = signSegment(`${encodedHeader}.${encodedPayload}`, options.secret)

  const providedBuffer = Buffer.from(providedSignature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (
    providedBuffer.length !== expectedBuffer.length
    || !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    throw new Error('Invalid signature')
  }

  const payloadJson = fromBase64Url(encodedPayload)
  const parsedPayload = JSON.parse(payloadJson) as TPayload

  if (typeof parsedPayload.exp !== 'number') {
    throw new Error('Invalid exp')
  }

  const nowSeconds = Math.floor(Date.now() / 1000)

  if (parsedPayload.exp <= nowSeconds) {
    throw new Error('Token expired')
  }

  return parsedPayload
}
