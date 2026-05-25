import type {
  CreateAuthSystemUserInput,
  CreateAuthSystemUserResult,
} from '../interfaces/services/users-service.interface'
import {
  addAuthUser,
  findAuthUserByEmail,
  findAuthUserByEmployeeCode,
} from '../repositories/auth-users.repository'
import { generateTemporaryPassword } from '../utils/password.util'

export const createAuthSystemUser = (
  input: CreateAuthSystemUserInput,
): Promise<CreateAuthSystemUserResult> => {
  return createAuthSystemUserInDatabase(input)
}

const createAuthSystemUserInDatabase = async (
  input: CreateAuthSystemUserInput,
): Promise<CreateAuthSystemUserResult> => {
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
  const nextId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? `auth-user-${crypto.randomUUID()}`
    : `auth-user-${Date.now()}`

  const savedUser = await addAuthUser({
    id: nextId,
    employeeCode: input.employeeCode,
    fullName: input.fullName,
    email: input.email,
    phone: input.phone?.trim() ?? '',
    userType: input.userType,
    department: input.department,
    status: input.status,
    password: temporaryPassword,
    mustChangePassword: true,
  })

  return {
    user: {
      id: savedUser.id,
      employeeCode: savedUser.employeeCode,
      fullName: savedUser.fullName,
      email: savedUser.email,
      phone: savedUser.phone,
      userType: savedUser.userType,
      department: savedUser.department,
      status: savedUser.status,
      lastAccessAt: null,
      mustChangePassword: savedUser.mustChangePassword,
    },
    temporaryPassword,
  }
}
