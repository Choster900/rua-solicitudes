import type { UserType } from '~/presentation/interfaces/users/user.interface'

export type AuthUserStatus = 'Activo' | 'Pendiente' | 'Bloqueado'

export interface AuthUserRecord {
  id: string
  employeeCode: string
  fullName: string
  email: string
  phone: string
  userType: UserType
  department: string
  status: AuthUserStatus
  password: string
  mustChangePassword: boolean
  lastAccessAt: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthUsersStoreState {
  users: AuthUserRecord[]
}
