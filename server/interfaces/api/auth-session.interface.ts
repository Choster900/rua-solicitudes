import type { JwtPayloadBase } from '../../utils/auth-jwt.util'
import type { RoleCode } from '../domain/user.interface'

export interface SessionTokenPayload extends JwtPayloadBase {
    sub: string
    email: string
    fullName: string
    employeeCode: string
    department: string
    primaryRole: RoleCode | null
    roleCodes: RoleCode[]
    permissionCodes: string[]
    mustChangePassword?: boolean
}
