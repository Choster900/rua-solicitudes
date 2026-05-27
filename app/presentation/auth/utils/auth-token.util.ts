interface AuthTokenPayload {
    exp?: number
    mustChangePassword?: boolean
    [key: string]: unknown
}

const decodeBase64Url = (input: string) => {
    const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
    const padded = `${normalized}${'='.repeat((4 - (normalized.length % 4)) % 4)}`

    return atob(padded)
}

export const parseAuthTokenPayload = (token: string): AuthTokenPayload | null => {
    try {
        const segments = token.split('.')

        if (segments.length !== 3) {
            return null
        }

        const [, payloadSegment] = segments as [string, string, string]
        const payload = JSON.parse(decodeBase64Url(payloadSegment)) as AuthTokenPayload
        return payload
    } catch {
        return null
    }
}

export const isAuthTokenExpired = (token: string) => {
    const payload = parseAuthTokenPayload(token)

    if (!payload || typeof payload.exp !== 'number') {
        return true
    }

    const currentTimestamp = Math.floor(Date.now() / 1000)
    return payload.exp <= currentTimestamp
}

export const isAuthTokenPasswordChangeRequired = (token: string) => {
    const payload = parseAuthTokenPayload(token)

    if (!payload) {
        return false
    }

    return payload.mustChangePassword === true
}

export const getAuthTokenProfile = (token: string) => {
    const payload = parseAuthTokenPayload(token)

    if (!payload) {
        return null
    }

    return {
        fullName: (payload.fullName as string | undefined) ?? '',
        employeeCode: (payload.employeeCode as string | undefined) ?? '',
        email: (payload.email as string | undefined) ?? '',
        department: (payload.department as string | undefined) ?? '',
        primaryRole: (payload.primaryRole as string | null | undefined) ?? null,
    }
}

export const getAuthTokenUserId = (token: string): string | null => {
    const payload = parseAuthTokenPayload(token)
    if (!payload || typeof payload.sub !== 'string') {
        return null
    }
    return payload.sub
}

export const getAuthTokenRoleCodes = (token: string): string[] => {
    const payload = parseAuthTokenPayload(token)

    if (!payload || !Array.isArray(payload.roleCodes)) {
        return []
    }

    return payload.roleCodes as string[]
}

export const authTokenHasRole = (token: string, roleCode: string): boolean => {
    return getAuthTokenRoleCodes(token).includes(roleCode)
}
