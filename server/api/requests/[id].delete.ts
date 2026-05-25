import { deleteDesignRequestById, findDesignRequestById } from '../../repositories/design-requests.repository'

export default defineEventHandler(async (event) => {
  const requestId = String(getRouterParam(event, 'id') ?? '').trim()

  if (!requestId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID de solicitud inválido.',
    })
  }

  const sourceRequest = await findDesignRequestById(requestId)

  if (!sourceRequest) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Solicitud no encontrada.',
    })
  }

  return await deleteDesignRequestById(requestId)
})
