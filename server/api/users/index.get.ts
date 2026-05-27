import { getAllAuthUsers } from '../../repositories/auth-users.repository'

export default defineEventHandler(async () => {
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
            // Compat field for legacy frontend consumers
            userType: primaryRole?.name ?? null,
        }
    })
})
