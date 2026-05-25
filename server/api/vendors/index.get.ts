import { getAllVendors } from '../../repositories/vendors.repository'

export default defineEventHandler(async () => {
  return await getAllVendors()
})
