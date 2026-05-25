import { isAuthTokenExpired, isAuthTokenPasswordChangeRequired } from '~/presentation/auth/utils/auth-token.util'

const PUBLIC_PATHS = new Set([
  '/',
  '/login',
  '/landing',
  '/auth/change-password',
])

export default defineNuxtRouteMiddleware((to) => {
  if (!import.meta.client) {
    return
  }

  const accessToken = useCookie<string | null>('access_token')
  let tokenValue = accessToken.value
  const isPublicPath = PUBLIC_PATHS.has(to.path)

  if (tokenValue && isAuthTokenExpired(tokenValue)) {
    accessToken.value = null
    tokenValue = null

    if (!isPublicPath) {
      return navigateTo('/login?reason=session-expired')
    }
  }

  const requiresPasswordChange = tokenValue ? isAuthTokenPasswordChangeRequired(tokenValue) : false

  if (!tokenValue && !isPublicPath) {
    return navigateTo('/login')
  }

  if (tokenValue && requiresPasswordChange && to.path !== '/auth/change-password') {
    return navigateTo('/auth/change-password')
  }

  if (tokenValue && !requiresPasswordChange && to.path === '/auth/change-password') {
    return navigateTo('/dashboard')
  }

  if (tokenValue && !isAuthTokenExpired(tokenValue) && (to.path === '/' || to.path === '/login')) {
    return navigateTo('/dashboard')
  }
})
