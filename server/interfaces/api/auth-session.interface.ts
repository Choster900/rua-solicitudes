import type { JwtPayloadBase } from '../../utils/auth-jwt.util'

export interface SessionTokenPayload extends JwtPayloadBase {
    sub: string
    email: string
    employeeCode: string
    userType: string
    mustChangePassword?: boolean
}
