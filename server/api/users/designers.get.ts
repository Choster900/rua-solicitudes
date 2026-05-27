import { getAllAuthUsers } from '../../repositories/auth-users.repository'
import { requireRole } from '../../utils/require-permission.util'

export default defineEventHandler(async (event) => {
    requireRole(event, ['admin', 'disenador_jefe'])

    const allUsers = await getAllAuthUsers()

    return allUsers
        .filter((user) => user.roles.some((role) => role.code === 'disenador'))
        .map((user) => ({
            id: user.id,
            fullName: user.fullName,
            employeeCode: user.employeeCode,
        }))
})
