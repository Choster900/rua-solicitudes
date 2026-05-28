import {
    isAuthTokenExpired,
    isAuthTokenPasswordChangeRequired,
    authTokenHasRole,
    getAuthTokenRoleCodes,
} from '~/presentation/auth/utils/auth-token.util'

const PUBLIC_PATHS = new Set(['/', '/login', '/landing', '/auth/change-password'])

const getRoleHomePath = (roleCodes: string[]): string => {
    if (roleCodes.includes('vendedor')) return '/solicitudes'
    if (roleCodes.includes('disenador_jefe')) return '/requests/design'
    if (roleCodes.includes('disenador')) return '/requests/design'
    if (roleCodes.includes('calidad')) return '/requests/quality'
    return '/dashboard'
}

export default defineNuxtRouteMiddleware((to) => {
    if (!import.meta.client) {
        return
    }

    const accessToken = useCookie<string | null>('access_token')
    let tokenValue = accessToken.value
    const isPublicPath = PUBLIC_PATHS.has(to.path)

    // Limpiar tokens inválidos (expirados o con formato incorrecto sin roleCodes)
    if (tokenValue) {
        const roleCodes = getAuthTokenRoleCodes(tokenValue)
        if (isAuthTokenExpired(tokenValue) || roleCodes.length === 0) {
            accessToken.value = null
            tokenValue = null
            if (!isPublicPath) {
                return navigateTo('/login?reason=session-expired')
            }
        }
    }

    const requiresPasswordChange = tokenValue
        ? isAuthTokenPasswordChangeRequired(tokenValue)
        : false

    if (!tokenValue && !isPublicPath) {
        return navigateTo('/login')
    }

    if (tokenValue && requiresPasswordChange && to.path !== '/auth/change-password') {
        return navigateTo('/auth/change-password')
    }

    if (tokenValue && !requiresPasswordChange && to.path === '/auth/change-password') {
        return navigateTo('/dashboard')
    }

    // Redirect root / login to role home
    if (
        tokenValue &&
        !isAuthTokenExpired(tokenValue) &&
        (to.path === '/' || to.path === '/login')
    ) {
        const roleCodes = getAuthTokenRoleCodes(tokenValue)
        return navigateTo(getRoleHomePath(roleCodes))
    }

    // Roles con acceso exclusivo a una sola ruta
    const EXCLUSIVE_ROLE_PATHS: Record<string, string> = {
        calidad: '/requests/quality',
    }
    if (tokenValue) {
        const roleCodes = getAuthTokenRoleCodes(tokenValue)
        for (const [role, exclusivePath] of Object.entries(EXCLUSIVE_ROLE_PATHS)) {
            if (roleCodes.includes(role) && to.path !== exclusivePath) {
                return navigateTo(exclusivePath)
            }
        }
    }

    // Route-level role guard (meta.allowedRoles or meta.requiresRole)
    if (tokenValue) {
        const allowedRoles = to.meta?.allowedRoles as string[] | undefined
        const requiredRole = to.meta?.requiresRole as string | undefined

        if (allowedRoles && allowedRoles.length > 0) {
            const hasAccess = allowedRoles.some((role) => authTokenHasRole(tokenValue!, role))
            if (!hasAccess) {
                const roleCodes = getAuthTokenRoleCodes(tokenValue)
                const homePath = getRoleHomePath(roleCodes)
                // Evitar loop si ya estamos en el destino
                if (homePath !== to.path) {
                    return navigateTo(homePath)
                }
            }
        } else if (requiredRole) {
            if (!authTokenHasRole(tokenValue, requiredRole)) {
                const roleCodes = getAuthTokenRoleCodes(tokenValue)
                const homePath = getRoleHomePath(roleCodes)
                if (homePath !== to.path) {
                    return navigateTo(homePath)
                }
            }
        }
    }
})
