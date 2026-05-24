export type ClientStatus = 'Activo' | 'Prospecto' | 'Inactivo'

export interface Client {
  id: string
  code: string
  name: string
  segment: string
  city: string
  status: ClientStatus
}
