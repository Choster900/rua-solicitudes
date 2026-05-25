import { isDatabaseConnectionAvailable } from '../../repositories/database-health.repository'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const connected = await isDatabaseConnectionAvailable(runtimeConfig.databaseUrl)

  return {
    connected,
  }
})
