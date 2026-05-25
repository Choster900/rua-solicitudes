import type { UserType } from '../../interfaces/domain/user.interface'
import { getAllAuthUsers } from '../../repositories/auth-users.repository'

export default defineEventHandler(async () => {
    const authUsers = await getAllAuthUsers()

    return authUsers.map((user) => {
        return {
            id: user.id,
            employeeCode: user.employeeCode,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            userType: user.userType as UserType,
            department: user.department,
            status: user.status,
            lastAccessAt: user.lastAccessAt,
        }
    })
})
