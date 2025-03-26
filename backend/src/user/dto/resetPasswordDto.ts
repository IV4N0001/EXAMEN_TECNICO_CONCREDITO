// password-reset.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RequestPasswordResetDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class ResetPasswordDto {
    @IsString()
    @IsNotEmpty()
    token: string;

    @IsString()
    newPassword: string;
}