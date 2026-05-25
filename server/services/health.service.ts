import dayjs from 'dayjs'
import type { HealthResponse } from '../interfaces/services/health-service.interface'

export function createHealthResponse(appName: string): HealthResponse {
  return {
    status: 'ok',
    service: 'nuxt-nitro-api',
    appName,
    timestamp: dayjs().toISOString(),
    uptime: process.uptime(),
  }
}
