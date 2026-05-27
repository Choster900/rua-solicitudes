import { deleteAuthUserById } from '../../repositories/auth-users.repository'
import { requireRole } from '../../utils/require-permission.util'

export default defineEventHandler(async (event) => {
    requireRole(event, ['admin'])

    const userId = String(getRouterParam(event, 'id') ?? '').trim()

    if (!userId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID de usuario inválido.',
        })
    }

    const deletedUser = await deleteAuthUserById(userId)

    if (!deletedUser) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Usuario no encontrado.',
        })
    }

    return {
        id: deletedUser.id,
        fullName: deletedUser.fullName,
    }
})
