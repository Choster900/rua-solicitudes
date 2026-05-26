import type { ClientStatus } from '../../interfaces/domain/client.interface'
import { CLIENT_STATUSES } from '../../interfaces/domain/client.interface'

const allowedStatuses: ClientStatus[] = [...CLIENT_STATUSES]

export const isClientStatus = (value: string): value is ClientStatus => {
    return allowedStatuses.includes(value as ClientStatus)
}

export const generateClientCode = (): string => {
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `CLI-${timestamp}-${random}`
}
