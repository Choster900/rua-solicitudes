import type { UserStatus } from '../../interfaces/services/users-service.interface'
import { USER_STATUSES, isRoleCode, type RoleCode } from '../../interfaces/domain/user.interface'
import { createAuthSystemUser } from '../../services/users.service'
import { isDatabaseConnectionAvailable } from '../../repositories/database-health.repository'
import { parseCreateUserDto } from '../dtos/users'
import { requireRole } from '../../utils/require-permission.util'

const allowedStatuses: UserStatus[] = [...USER_STATUSES]

const isUserStatus = (value: string): value is UserStatus => {
    return allowedStatuses.includes(value as UserStatus)
}

export default defineEventHandler(async (event) => {
    requireRole(event, ['admin'])

    const body = parseCreateUserDto(await readBody(event))

    const employeeCode = body.employeeCode?.trim().toUpperCase() ?? ''
    const fullName = body.fullName?.trim() ?? ''
    const email = body.email?.trim().toLowerCase() ?? ''
    const rawRoleCode = body.roleCode?.trim() ?? ''
    const department = body.department?.trim() ?? ''
    const rawStatus = body.status?.trim() ?? 'Pendiente'

    if (!employeeCode || !fullName || !email || !rawRoleCode || !department) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Debes completar los campos requeridos para crear el usuario.',
        })
    }

    if (!isRoleCode(rawRoleCode)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Rol no válido.',
        })
    }

    if (!isUserStatus(rawStatus)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Estado de usuario no válido.',
        })
    }

    const runtimeConfig = useRuntimeConfig(event)
    const isDatabaseConnected = await isDatabaseConnectionAvailable(runtimeConfig.databaseUrl)

    if (!isDatabaseConnected) {
        throw createError({
            statusCode: 503,
            statusMessage:
                'No hay conexión a la base de datos. Verifica la conexión e inténtalo nuevamente.',
        })
    }

    const roleCode: RoleCode = rawRoleCode
    const status: UserStatus = rawStatus

    const createUserResult = await createAuthSystemUser({
        employeeCode,
        fullName,
        email,
        phone: body.phone?.trim() ?? '',
        roleCode,
        department,
        status,
    })

    if ('error' in createUserResult) {
        throw createError({
            statusCode: createUserResult.error.code === 'INVALID_ROLE' ? 400 : 409,
            statusMessage: createUserResult.error.message,
        })
    }

    return createUserResult
})
