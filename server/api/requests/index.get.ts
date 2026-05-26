import { getAllDesignRequests } from '../../repositories/design-requests.repository'
import { getSessionUser } from '../../utils/auth-session.util'

export default defineEventHandler(async (event) => {
    const sessionUser = getSessionUser(event)
    const allRequests = await getAllDesignRequests()

    // Sin sesión: devuelve todo (caso de hidratación previa al login en algunos flujos)
    if (!sessionUser) {
        return allRequests
    }

    if (sessionUser.userType === 'Diseñador') {
        return allRequests.filter((request) => request.assignedDesignerId === sessionUser.sub)
    }

    if (sessionUser.userType === 'Vendedor') {
        return allRequests.filter((request) => request.createdById === sessionUser.sub)
    }

    // Jefe de diseño, calidad, administrador, gerencia: ven todo
    return allRequests
})
