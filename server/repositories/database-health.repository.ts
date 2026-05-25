import net from 'node:net'

const DEFAULT_POSTGRES_PORT = 5432
const CONNECTION_TIMEOUT_MS = 2500

const resolveDatabaseHost = (databaseUrl: string) => {
  try {
    const parsedUrl = new URL(databaseUrl)
    const protocol = parsedUrl.protocol.toLowerCase()

    if (protocol !== 'postgres:' && protocol !== 'postgresql:') {
      return null
    }

    const port = parsedUrl.port ? Number(parsedUrl.port) : DEFAULT_POSTGRES_PORT

    if (!parsedUrl.hostname || Number.isNaN(port)) {
      return null
    }

    return {
      host: parsedUrl.hostname,
      port,
    }
  }
  catch {
    return null
  }
}

export const isDatabaseConnectionAvailable = async (databaseUrl: string): Promise<boolean> => {
  const hostConfig = resolveDatabaseHost(databaseUrl)

  if (!hostConfig) {
    return false
  }

  return await new Promise<boolean>((resolve) => {
    const socket = net.createConnection({
      host: hostConfig.host,
      port: hostConfig.port,
    })

    let settled = false

    const finish = (isConnected: boolean) => {
      if (settled) {
        return
      }

      settled = true
      socket.destroy()
      resolve(isConnected)
    }

    socket.setTimeout(CONNECTION_TIMEOUT_MS)
    socket.once('connect', () => finish(true))
    socket.once('timeout', () => finish(false))
    socket.once('error', () => finish(false))
  })
}
