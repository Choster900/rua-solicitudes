import { deleteClientById, findClientById } from '../../repositories/clients.repository'

export default defineEventHandler(async (event) => {
  const clientId = String(getRouterParam(event, 'id') ?? '').trim()

  if (!clientId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID de cliente inválido.',
    })
  }

  const sourceClient = await findClientById(clientId)

  if (!sourceClient) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Cliente no encontrado.',
    })
  }

  return await deleteClientById(clientId)
})
