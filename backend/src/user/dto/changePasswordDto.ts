import { IsNotEmpty, IsString } from "class-validator"

export class ChangePasswordDto {
    @IsNotEmpty({ message: 'Ingrese una contraseña'})
    @IsString()
    newPassword: string
}