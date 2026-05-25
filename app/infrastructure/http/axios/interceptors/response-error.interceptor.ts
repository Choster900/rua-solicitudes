import type { AxiosError } from 'axios'
import { HTTP_STATUS_UNAUTHORIZED } from '~/presentation/constants/http/http.constants'
import type { HttpClientContext } from '~/presentation/interfaces/shared/http/http-client-context.interface'
import type { HttpClientError } from '~/presentation/interfaces/shared/http/http-client-error.interface'

export function createResponseErrorInterceptor(context: HttpClientContext) {
  return (error: AxiosError) => {
    const normalizedError: HttpClientError = {
      name: 'HttpClientError',
      message: error.response?.statusText || error.message || 'Unexpected HTTP error',
      status: error.response?.status ?? null,
      code: error.code ?? null,
      details: error.response?.data,
      endpoint: error.config?.url,
    }

    if (normalizedError.status === HTTP_STATUS_UNAUTHORIZED) {
      context.onUnauthorized?.()
    }

    return Promise.reject(normalizedError)
  }
}
