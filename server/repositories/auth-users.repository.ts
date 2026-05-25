import dayjs from 'dayjs'
import type { AuthUserRecord } from '../interfaces/repositories/auth-users-repository.interface'
import { prisma } from '../database/prisma'

const toAuthUserRecord = (source: {
  id: string
  employeeCode: string
  fullName: string
  email: string
  phone: string
  userType: string
  department: string
  status: string
  password: string
  mustChangePassword: boolean
  lastAccessAt: Date | null
  createdAt: Date
  updatedAt: Date
}): AuthUserRecord => {
  return {
    id: source.id,
    employeeCode: source.employeeCode,
    fullName: source.fullName,
    email: source.email,
    phone: source.phone,
    userType: source.userType as AuthUserRecord['userType'],
    department: source.department,
    status: source.status as AuthUserRecord['status'],
    password: source.password,
    mustChangePassword: source.mustChangePassword,
    lastAccessAt: source.lastAccessAt ? dayjs(source.lastAccessAt).toISOString() : null,
    createdAt: dayjs(source.createdAt).toISOString(),
    updatedAt: dayjs(source.updatedAt).toISOString(),
  }
}

export const getAllAuthUsers = async () => {
  const authUsers = await prisma.authUser.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return authUsers.map(toAuthUserRecord)
}

export const findAuthUserById = async (userId: string) => {
  const authUser = await prisma.authUser.findUnique({
    where: {
      id: userId,
    },
  })

  return authUser ? toAuthUserRecord(authUser) : null
}

export const findAuthUserByNetworkUser = async (networkUser: string) => {
  const normalizedValue = networkUser.trim().toLowerCase()
  const authUser = await prisma.authUser.findFirst({
    where: {
      OR: [
        {
          email: {
            equals: normalizedValue,
            mode: 'insensitive',
          },
        },
        {
          employeeCode: {
            equals: normalizedValue,
            mode: 'insensitive',
          },
        },
      ],
    },
  })

  return authUser ? toAuthUserRecord(authUser) : null
}

export const findAuthUserByEmployeeCode = async (employeeCode: string) => {
  const normalizedValue = employeeCode.trim()
  const authUser = await prisma.authUser.findFirst({
    where: {
      employeeCode: {
        equals: normalizedValue,
        mode: 'insensitive',
      },
    },
  })

  return authUser ? toAuthUserRecord(authUser) : null
}

export const findAuthUserByEmail = async (email: string) => {
  const normalizedValue = email.trim().toLowerCase()
  const authUser = await prisma.authUser.findFirst({
    where: {
      email: {
        equals: normalizedValue,
        mode: 'insensitive',
      },
    },
  })

  return authUser ? toAuthUserRecord(authUser) : null
}

export const addAuthUser = async (
  payload: Omit<AuthUserRecord, 'createdAt' | 'updatedAt' | 'lastAccessAt'>,
) => {
  const createdAuthUser = await prisma.authUser.create({
    data: {
      id: payload.id,
      employeeCode: payload.employeeCode,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      userType: payload.userType,
      department: payload.department,
      status: payload.status,
      password: payload.password,
      mustChangePassword: payload.mustChangePassword,
    },
  })

  return toAuthUserRecord(createdAuthUser)
}

export const updateAuthUser = async (
  userId: string,
  updater: (currentUser: AuthUserRecord) => AuthUserRecord,
) => {
  const currentUser = await findAuthUserById(userId)

  if (!currentUser) {
    return null
  }

  const nextUser = updater(currentUser)
  const updatedAuthUser = await prisma.authUser.update({
    where: {
      id: userId,
    },
    data: {
      employeeCode: nextUser.employeeCode,
      fullName: nextUser.fullName,
      email: nextUser.email,
      phone: nextUser.phone,
      userType: nextUser.userType,
      department: nextUser.department,
      status: nextUser.status,
      password: nextUser.password,
      mustChangePassword: nextUser.mustChangePassword,
      lastAccessAt: nextUser.lastAccessAt ? dayjs(nextUser.lastAccessAt).toDate() : null,
    },
  })

  return toAuthUserRecord(updatedAuthUser)
}

export const deleteAuthUserById = async (userId: string) => {
  const existingUser = await findAuthUserById(userId)

  if (!existingUser) {
    return null
  }

  await prisma.authUser.delete({
    where: {
      id: userId,
    },
  })

  return existingUser
}
