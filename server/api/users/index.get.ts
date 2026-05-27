import { getAllAuthUsers } from '../../repositories/auth-users.repository'
import { requireRole } from '../../utils/require-permission.util'

export default defineEventHandler(async (event) => {
    requireRole(event, ['admin'])

    const authUsers = await getAllAuthUsers()

    return authUsers.map((user) => {
        const primaryRole = user.roles[0] ?? null
        return {
            id: user.id,
            employeeCode: user.employeeCode,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            department: user.department,
            status: user.status,
            lastAccessAt: user.lastAccessAt,
            roles: user.roles.map((role) => ({ code: role.code, name: role.name })),
            primaryRole: primaryRole ? { code: primaryRole.code, name: primaryRole.name } : null,
            userType: primaryRole?.name ?? null,
        }
    })
})
