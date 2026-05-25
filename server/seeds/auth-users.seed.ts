import type { UserType } from '~/presentation/interfaces/users/user.interface'

export interface AuthSeedUser {
  id: string
  employeeCode: string
  fullName: string
  email: string
  userType: UserType
  department: string
  password: string
  status: 'Activo' | 'Pendiente' | 'Bloqueado'
}

export const authUsersSeed: AuthSeedUser[] = [
  {
    id: 'auth-user-admin-001',
    employeeCode: 'EMP-1001',
    fullName: 'Carlos Ruiz',
    email: 'admin@ruasa.com.sv',
    userType: 'Administrador',
    department: 'Dirección',
    password: '12345678',
    status: 'Activo',
  },
  {
    id: 'auth-user-vendedor-001',
    employeeCode: 'EMP-1002',
    fullName: 'Andrea Martínez',
    email: 'vendedor@ruasa.com.sv',
    userType: 'Vendedor',
    department: 'Comercial',
    password: '12345678',
    status: 'Activo',
  },
  {
    id: 'auth-user-calidad-001',
    employeeCode: 'EMP-1003',
    fullName: 'Elena Córdova',
    email: 'calidad@ruasa.com.sv',
    userType: 'Calidad',
    department: 'Aseguramiento',
    password: '12345678',
    status: 'Activo',
  },
  {
    id: 'auth-user-disenador-001',
    employeeCode: 'EMP-1004',
    fullName: 'Carlos Arévalo',
    email: 'disenador@ruasa.com.sv',
    userType: 'Diseñador',
    department: 'Preprensa',
    password: '12345678',
    status: 'Activo',
  },
]
