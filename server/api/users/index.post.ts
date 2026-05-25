import type { UserType } from '~/presentation/interfaces/users/user.interface'
import type { UserStatus } from '../../interfaces/services/users-service.interface'
import { createAuthSystemUser } from '../../services/users.service'

interface CreateUserBody {
  employeeCode?: string
  fullName?: string
  email?: string
  phone?: string
  userType?: UserType
  department?: string
  status?: 'Activo' | 'Pendiente' | 'Bloqueado'
}

const allowedUserTypes: UserType[] = [
  'Administrador',
  'Vendedor',
  'Diseñador',
  'Calidad',
  'Administrativo',
  'Gerencia',
]

const allowedStatuses: UserStatus[] = ['Activo', 'Pendiente', 'Bloqueado']

const isUserType = (value: string): value is UserType => {
  return allowedUserTypes.includes(value as UserType)
}

const isUserStatus = (value: string): value is UserStatus => {
  return allowedStatuses.includes(value as UserStatus)
}

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateUserBody>(event)

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
