import { createAxiosClient, buildApiBaseUrl, HTTP_TIMEOUT_MS } from '~/infrastructure/http/axios'

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()
  const accessToken = useCookie<string | null>('access_token')
  const requestUrl = import.meta.server ? useRequestURL() : null
  const isHandlingUnauthorized = useState<boolean>('auth-handling-unauthorized', () => false)
  const nuxtApp = useNuxtApp()
  const router = import.meta.client ? useRouter() : null

  const apiClient = createAxiosClient({
    baseURL: buildApiBaseUrl({
      apiUrl: runtimeConfig.public.apiUrl,
      appUrl: runtimeConfig.public.appUrl,
      requestOrigin: requestUrl?.origin,
    }),
    timeout: HTTP_TIMEOUT_MS,
    isDev: import.meta.dev,
    getAuthToken: () => accessToken.value,
    onUnauthorized: () => {
      if (!import.meta.client || !accessToken.value || isHandlingUnauthorized.value) {
        return
      }

      isHandlingUnauthorized.value = true
      accessToken.value = null

      nuxtApp.$appToast.warning('Tu sesión ha caducado. Vuelve a iniciar sesión.')
      void router?.replace('/login?reason=session-expired').finally(() => {
        isHandlingUnauthorized.value = false
      })
    },
  })

  return {
    provide: {
      apiClient,
    },
  }
})
