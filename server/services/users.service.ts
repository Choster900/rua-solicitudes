import type {
    CreateAuthSystemUserInput,
    CreateAuthSystemUserResult,
} from '../interfaces/services/users-service.interface'
import {
    addAuthUser,
    findAuthUserByEmail,
    findAuthUserByEmployeeCode,
} from '../repositories/auth-users.repository'
import { ROLE_NAME_BY_CODE, isRoleCode } from '../interfaces/domain/user.interface'
import { generateTemporaryPassword, hashPassword } from '../utils/password.util'

export const createAuthSystemUser = async (
    input: CreateAuthSystemUserInput,
): Promise<CreateAuthSystemUserResult> => {
    if (!isRoleCode(input.roleCode)) {
        return {
            error: {
                code: 'INVALID_ROLE',
                message: `El rol ${input.roleCode} no es válido.`,
            },
        }
    }

    const existingByCode = await findAuthUserByEmployeeCode(input.employeeCode)
    if (existingByCode) {
        return {
            error: {
                code: 'DUPLICATED_EMPLOYEE_CODE',
                message: `Ya existe un usuario con el código ${input.employeeCode}.`,
            },
        }
    }

    const existingByEmail = await findAuthUserByEmail(input.email)
    if (existingByEmail) {
        return {
            error: {
                code: 'DUPLICATED_EMAIL',
                message: `Ya existe un usuario con el correo ${input.email}.`,
            },
        }
    }

    const temporaryPassword = generateTemporaryPassword()
    const passwordHash = await hashPassword(temporaryPassword)

    const savedUser = await addAuthUser({
        employeeCode: input.employeeCode,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone?.trim() ?? '',
        department: input.department,
        status: input.status,
        passwordHash,
        mustChangePassword: true,
        roleCodes: [input.roleCode],
    })

    const primaryRoleSummary = savedUser.roles[0]
        ? { code: savedUser.roles[0].code, name: savedUser.roles[0].name }
        : null

    return {
        user: {
            id: savedUser.id,
            employeeCode: savedUser.employeeCode,
            fullName: savedUser.fullName,
            email: savedUser.email,
            phone: savedUser.phone,
            department: savedUser.department,
            status: savedUser.status,
            lastAccessAt: null,
            mustChangePassword: savedUser.mustChangePassword,
            roles: savedUser.roles.map((role) => ({ code: role.code, name: role.name })),
            primaryRole: primaryRoleSummary,
        },
        temporaryPassword,
    }
}

export const resolveRoleNameByCode = (code: string) => {
    return isRoleCode(code) ? ROLE_NAME_BY_CODE[code] : code
}
