import { deleteVendorById, findVendorById } from '../../repositories/vendors.repository'

export default defineEventHandler(async (event) => {
  const vendorId = String(getRouterParam(event, 'id') ?? '').trim()

  if (!vendorId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID de vendedor inválido.',
    })
  }

  const sourceVendor = await findVendorById(vendorId)

  if (!sourceVendor) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Vendedor no encontrado.',
    })
  }

  return await deleteVendorById(vendorId)
})
