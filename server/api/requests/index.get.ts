import { getAllDesignRequests } from '../../repositories/design-requests.repository'

export default defineEventHandler(async () => {
  return await getAllDesignRequests()
})
