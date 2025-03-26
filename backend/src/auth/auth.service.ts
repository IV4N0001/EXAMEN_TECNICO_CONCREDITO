import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { Response } from 'express'; // Importa el tipo Response de Express

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Credenciales inválidas. Por favor intente de nuevo');
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(token: string, response: Response): Promise<void> {
    if (!token) {
      throw new UnauthorizedException('No hay token disponible');
    }

    // Validar el token
    try {
      const payload = this.jwtService.verify(token);
      console.log('Token válido:', payload); // Depuración
    } catch (err) {
      throw new UnauthorizedException('Token inválido');
    }

    // Invalidar el token (opcional)
    console.log(`Token invalidado: ${token}`);

    // Eliminar la cookie
    response.clearCookie('token', {
      httpOnly: true, // Debe coincidir con cómo se creó la cookie
      secure: process.env.NODE_ENV === 'production', // Debe coincidir con cómo se creó la cookie
      sameSite: 'strict', // Debe coincidir con cómo se creó la cookie
      path: '/', // Debe coincidir con cómo se creó la cookie
    });
  }
}
