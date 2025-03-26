import { Body, Controller, Get, Post, UseGuards, Request, Patch, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUserDto';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDto } from './dto/changePasswordDto';
import { RequestPasswordResetDto, ResetPasswordDto } from './dto/resetPasswordDto';
import { ChangeEmailDto } from './dto/changeEmailDto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}
    
    @Post()
    createUser(@Body() newUser: CreateUserDto) {
        return this.userService.createUser(newUser)
    }

    @Patch('changePassword')
    @UseGuards(AuthGuard('jwt')) // Proteger la ruta con JWT
    async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req) {
        const username = req.user.username; // Obtener el nombre de usuario del token JWT
        return this.userService.changePassword(username, changePasswordDto.newPassword);
    }

    @Patch('changeEmail')
    @UseGuards(AuthGuard('jwt')) // Proteger la ruta con JWT
    async changeEmail(@Body() changeEmailDto: ChangeEmailDto, @Req() req) {
        const username = req.user.username; // Obtener el nombre de usuario del token JWT
        return this.userService.changeEmail(username, changeEmailDto.newEmail);
    }

    @Post('requestPasswordReset')
    async requestPasswordReset(@Body() body: RequestPasswordResetDto) {
        return this.userService.requestPasswordReset(body.email);
    }

    @Post('resetPassword')
    async resetPassword(@Body() body: ResetPasswordDto) {
        return this.userService.resetPassword(body.token, body.newPassword);
    }
}
