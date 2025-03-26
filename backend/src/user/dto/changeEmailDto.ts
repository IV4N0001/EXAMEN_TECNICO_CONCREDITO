import { IsEmail, IsNotEmpty } from "class-validator"

export class ChangeEmailDto {
    @IsNotEmpty({ message: 'Ingrese una contraseña'})
    @IsEmail()
    newEmail: string
}