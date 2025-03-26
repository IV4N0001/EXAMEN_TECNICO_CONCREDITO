import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class CreateUserDto {
    @IsNotEmpty({ message: 'Ingrese un nombre de usuario'})
    @IsString()
    username: string

    @IsNotEmpty({ message: 'Ingrese una contraseña'})
    @IsString()
    password: string

    @IsNotEmpty({ message: 'Ingrese un correo electrónico'})
    @IsEmail({}, { message: 'El email no es válido' })
    email: string
}