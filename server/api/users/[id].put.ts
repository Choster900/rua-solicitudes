import {
    findAuthUserByEmail,
    findAuthUserByEmployeeCode,
    findAuthUserById,
    updateAuthUser,
} from '../../repositories/auth-users.repository'
import type { UserStatus } from '../../interfaces/services/users-service.interface'
import { USER_STATUSES, isRoleCode, type RoleCode } from '../../interfaces/domain/user.interface'
import { parseUpdateUserDto } from '../dtos/users'
import { requireRole } from '../../utils/require-permission.util'

const allowedStatuses: UserStatus[] = [...USER_STATUSES]

const isUserStatus = (value: string): value is UserStatus => {
    return allowedStatuses.includes(value as UserStatus)
}

export default defineEventHandler(async (event) => {
    requireRole(event, ['admin'])

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
    const rawRoleCode = body.roleCode?.trim()
    const department = body.department?.trim() ?? sourceUser.department
    const status = body.status ?? sourceUser.status

    if (!employeeCode || !fullName || !email || !department) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Debes completar los campos requeridos para actualizar el usuario.',
        })
    }

    let nextRoleCodes: RoleCode[] | undefined
    if (rawRoleCode !== undefined) {
        if (!isRoleCode(rawRoleCode)) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Rol no válido.',
            })
        }
        nextRoleCodes = [rawRoleCode]
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

    const updatedUser = await updateAuthUser(userId, {
        employeeCode,
        fullName,
        email,
        phone,
        department,
        status,
        ...(nextRoleCodes ? { roleCodes: nextRoleCodes } : {}),
    })

    if (!updatedUser) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Usuario no encontrado.',
        })
    }

    const primaryRole = updatedUser.roles[0] ?? null

    return {
        id: updatedUser.id,
        employeeCode: updatedUser.employeeCode,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        department: updatedUser.department,
        status: updatedUser.status,
        lastAccessAt: updatedUser.lastAccessAt,
        roles: updatedUser.roles.map((role) => ({ code: role.code, name: role.name })),
        primaryRole: primaryRole ? { code: primaryRole.code, name: primaryRole.name } : null,
        userType: primaryRole?.name ?? null,
    }
})
