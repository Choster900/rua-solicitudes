export interface HealthResponse {
  status: 'ok'
  service: string
  appName: string
  timestamp: string
  uptime: number
}
