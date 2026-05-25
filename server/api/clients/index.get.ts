import { getAllClients } from '../../repositories/clients.repository'

export default defineEventHandler(async () => {
  return await getAllClients()
})
