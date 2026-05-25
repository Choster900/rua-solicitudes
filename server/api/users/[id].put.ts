import {
    findAuthUserByEmail,
    findAuthUserByEmployeeCode,
    findAuthUserById,
    updateAuthUser,
} from '../../repositories/auth-users.repository'
import type { UserStatus } from '../../interfaces/services/users-service.interface'
import type { UserType } from '../../interfaces/domain/user.interface'
import { USER_STATUSES, USER_TYPES } from '../../interfaces/domain/user.interface'
import { parseUpdateUserDto } from '../dtos/users'

const allowedUserTypes: UserType[] = [...USER_TYPES]
const allowedStatuses: UserStatus[] = [...USER_STATUSES]

const isUserType = (value: string): value is UserType => {
    return allowedUserTypes.includes(value as UserType)
}

const isUserStatus = (value: string): value is UserStatus => {
    return allowedStatuses.includes(value as UserStatus)
}

export default defineEventHandler(async (event) => {
    const userId = String(getRouterParam(event, 'id') ?? '').trim()
    const body = parseUpdateUserDto(await readBody(event))

    if (!userId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID de usuario inválido.',
        })
    }

    const sourceUser = await findAuthUserById(userId)

    if (!sourceUser) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Usuario no encontrado.',
        })
    }

    const employeeCode = body.employeeCode?.trim().toUpperCase() ?? sourceUser.employeeCode
    const fullName = body.fullName?.trim() ?? sourceUser.fullName
    const email = body.email?.trim().toLowerCase() ?? sourceUser.email
    const phone = body.phone?.trim() ?? sourceUser.phone
    const userType = body.userType ?? sourceUser.userType
    const department = body.department?.trim() ?? sourceUser.department
    const status = body.status ?? sourceUser.status

    if (!employeeCode || !fullName || !email || !department) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Debes completar los campos requeridos para actualizar el usuario.',
        })
    }

    if (!isUserType(userType)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Tipo de usuario no válido.',
        })
    }

    if (!isUserStatus(status)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Estado de usuario no válido.',
        })
    }

    const duplicatedByCode = await findAuthUserByEmployeeCode(employeeCode)

    if (duplicatedByCode && duplicatedByCode.id !== userId) {
        throw createError({
            statusCode: 409,
            statusMessage: `Ya existe un usuario con el código ${employeeCode}.`,
        })
    }

    const duplicatedByEmail = await findAuthUserByEmail(email)

    if (duplicatedByEmail && duplicatedByEmail.id !== userId) {
        throw createError({
            statusCode: 409,
            statusMessage: `Ya existe un usuario con el correo ${email}.`,
        })
    }

    const updatedUser = await updateAuthUser(userId, (currentUser) => ({
        ...currentUser,
        employeeCode,
        fullName,
        email,
        phone,
        userType,
        department,
        status,
    }))

    if (!updatedUser) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Usuario no encontrado.',
        })
    }

    return {
        id: updatedUser.id,
        employeeCode: updatedUser.employeeCode,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        userType: updatedUser.userType,
        department: updatedUser.department,
        status: updatedUser.status,
        lastAccessAt: updatedUser.lastAccessAt,
    }
})
