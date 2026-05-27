import { getAllDesignRequests } from '../../repositories/design-requests.repository'
import { getSessionUser } from '../../utils/auth-session.util'

export default defineEventHandler(async (event) => {
    const sessionUser = getSessionUser(event)
    const allRequests = await getAllDesignRequests()

    if (!sessionUser) {
        return allRequests
    }

    if (sessionUser.roleCodes.includes('disenador')) {
        return allRequests.filter((request) =>
            request.currentVersion?.assignments.some(
                (a: { designerId: string }) => a.designerId === sessionUser.sub,
            ),
        )
    }

    if (sessionUser.roleCodes.includes('vendedor')) {
        return allRequests.filter((request) => request.sellerId === sessionUser.sub)
    }

    return allRequests
})
