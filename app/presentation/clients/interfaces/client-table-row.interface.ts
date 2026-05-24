import type { ClientStatus } from '~/presentation/clients/interfaces/client.interface'

export interface ClientTableRow {
  id: string
  code: string
  name: string
  segment: string
  contactName: string
  contactPhone: string
  location: string
  city: string
  status: ClientStatus
}
