export type UserType = 'Administrador' | 'Vendedor' | 'Diseñador' | 'Calidad' | 'Administrativo' | 'Gerencia'
export type UserStatus = 'Activo' | 'Pendiente' | 'Bloqueado'

export interface User {
  id: string
  employeeCode: string
  fullName: string
  email: string
  phone: string
  userType: UserType
  department: string
  status: UserStatus
  lastAccessAt: string | null
}
