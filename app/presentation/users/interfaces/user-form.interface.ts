import type { UserStatus, UserType } from '~/presentation/users/interfaces/user.interface'

export interface UserFormModel {
  employeeCode: string
  fullName: string
  email: string
  phone: string
  userType: UserType | ''
  department: string
  status: UserStatus
}
