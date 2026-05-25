import type { UserStatus } from '../../interfaces/services/users-service.interface'
import type { UserType } from '../../interfaces/domain/user.interface'
import { USER_STATUSES, USER_TYPES } from '../../interfaces/domain/user.interface'
import { createAuthSystemUser } from '../../services/users.service'
import { isDatabaseConnectionAvailable } from '../../repositories/database-health.repository'
import { parseCreateUserDto } from '../dtos/users'

const allowedUserTypes: UserType[] = [...USER_TYPES]
const allowedStatuses: UserStatus[] = [...USER_STATUSES]

const isUserType = (value: string): value is UserType => {
    return allowedUserTypes.includes(value as UserType)
}

const isUserStatus = (value: string): value is UserStatus => {
    return allowedStatuses.includes(value as UserStatus)
}

export default defineEventHandler(async (event) => {
    const body = parseCreateUserDto(await readBody(event))

    const employeeCode = body.employeeCode?.trim().toUpperCase() ?? ''
    const fullName = body.fullName?.trim() ?? ''
    const email = body.email?.trim().toLowerCase() ?? ''
    const rawUserType = body.userType ?? ''
    const department = body.department?.trim() ?? ''
    const rawStatus = body.status?.trim() ?? 'Pendiente'

    if (!employeeCode || !fullName || !email || !rawUserType || !department) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Debes completar los campos requeridos para crear el usuario.',
        })
    }

    if (!isUserType(rawUserType)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Tipo de usuario no válido.',
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

    const userType: UserType = rawUserType
    const status: UserStatus = rawStatus

    const createUserResult = await createAuthSystemUser({
        employeeCode,
        fullName,
        email,
        phone: body.phone?.trim() ?? '',
        userType,
        department,
        status,
    })

    if ('error' in createUserResult) {
        throw createError({
            statusCode: 409,
            statusMessage: createUserResult.error.message,
        })
    }

    return createUserResult
})
