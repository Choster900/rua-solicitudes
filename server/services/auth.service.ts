import type {
  AuthLoginInput,
  AuthLoginResponse,
  ChangePasswordInput,
  ChangePasswordResponse,
  LoginTokenPayload,
} from '../interfaces/services/auth-service.interface'
import {
  findAuthUserById,
  findAuthUserByNetworkUser,
  updateAuthUser,
} from '../repositories/auth-users.repository'
import { createJwtToken } from '../utils/auth-jwt.util'

const normalizeNetworkUser = (value: string) => value.trim().toLowerCase()

export const loginWithSeededUsers = (
  input: AuthLoginInput,
  options: {
    jwtSecret: string
    accessTokenExpiresInSeconds: number
  },
): Promise<AuthLoginResponse | null> => {
  return loginWithDatabaseUsers(input, options)
}

const loginWithDatabaseUsers = async (
  input: AuthLoginInput,
  options: {
    jwtSecret: string
    accessTokenExpiresInSeconds: number
  },
): Promise<AuthLoginResponse | null> => {
  const normalizedNetworkUser = normalizeNetworkUser(input.networkUser)
  const normalizedPassword = input.password.trim()

  const authUser = await findAuthUserByNetworkUser(normalizedNetworkUser)

  if (!authUser || authUser.status !== 'Activo' || authUser.password !== normalizedPassword) {
    return null
  }

  const payload: LoginTokenPayload = {
    sub: authUser.id,
    email: authUser.email,
    employeeCode: authUser.employeeCode,
    userType: authUser.userType,
    mustChangePassword: authUser.mustChangePassword,
  }

  const accessToken = createJwtToken(payload, {
    secret: options.jwtSecret,
    expiresInSeconds: options.accessTokenExpiresInSeconds,
  })

  return {
    accessToken,
    refreshToken: null,
    expiresInSeconds: options.accessTokenExpiresInSeconds,
    tokenType: 'Bearer',
    mustChangePassword: authUser.mustChangePassword,
    user: {
      id: authUser.id,
      employeeCode: authUser.employeeCode,
      fullName: authUser.fullName,
      email: authUser.email,
      userType: authUser.userType,
      department: authUser.department,
    },
  }
}

export const changeAuthUserPassword = (
  input: ChangePasswordInput,
  options: {
    jwtSecret: string
    accessTokenExpiresInSeconds: number
  },
): Promise<ChangePasswordResponse | null> => {
  return changeDatabaseUserPassword(input, options)
}

const changeDatabaseUserPassword = async (
  input: ChangePasswordInput,
  options: {
    jwtSecret: string
    accessTokenExpiresInSeconds: number
  },
): Promise<ChangePasswordResponse | null> => {
  const authUser = await findAuthUserById(input.userId)

  if (!authUser || authUser.status !== 'Activo') {
    return null
  }

  if (authUser.password !== input.currentPassword.trim()) {
    return null
  }

  const updatedUser = await updateAuthUser(input.userId, currentUser => ({
    ...currentUser,
    password: input.newPassword.trim(),
    mustChangePassword: false,
  }))

  if (!updatedUser) {
    return null
  }

  const tokenPayload: LoginTokenPayload = {
    sub: updatedUser.id,
    email: updatedUser.email,
    employeeCode: updatedUser.employeeCode,
    userType: updatedUser.userType,
    mustChangePassword: false,
  }

  const accessToken = createJwtToken(tokenPayload, {
    secret: options.jwtSecret,
    expiresInSeconds: options.accessTokenExpiresInSeconds,
  })

  return {
    accessToken,
    refreshToken: null,
    expiresInSeconds: options.accessTokenExpiresInSeconds,
    tokenType: 'Bearer',
  }
}
