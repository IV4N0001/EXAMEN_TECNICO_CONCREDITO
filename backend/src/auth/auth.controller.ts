import { Controller, Post, Body, Res, UnauthorizedException, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas. Por favor intente de nuevo');
    }

    const { access_token } = await this.authService.login(user);

    // Configura la cookie con atributos de seguridad
    response.cookie('token', access_token, {
      httpOnly: false, // Accesible desde JavaScript
      secure: process.env.NODE_ENV === 'production', // Solo se envía sobre HTTPS en producción
      sameSite: 'strict', // Protege contra CSRF
      maxAge: 60 * 60 * 1000, // Caduca en 1 hora (60 minutos * 60 segundos * 1000 milisegundos)
    });

    return { "access_token": access_token};
  }

  @UseGuards(AuthGuard('jwt')) // Protege la ruta con JWT
  @Post('logout')
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const token = request.cookies['token']; // Obtener el token de la cookie
    await this.authService.logout(token, response); // Llamar al servicio
    return { message: 'Logout exitoso' };
  }

}