export interface AuthLoginDto {
    networkUser?: string
    password?: string
}

export interface ChangePasswordDto {
    currentPassword?: string
    newPassword?: string
}
