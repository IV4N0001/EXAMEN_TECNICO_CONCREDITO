import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/createUserDto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>, 
        private mailerService: MailerService
    ) {}

    async createUser(user: CreateUserDto) {
        const userFound = await this.userRepository.findOne({where: { username: user.username}})
        const emailFound = await this.userRepository.findOne({where: { email: user.email}})

        if(userFound) {
            throw new HttpException('Este nombre de usuario ya existe', HttpStatus.CONFLICT);
        } 

        if(emailFound) {
            throw new HttpException('Este correo electrónico ya se encuentra registrado', HttpStatus.CONFLICT);

        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(user.password, salt);

        user.password = hashedPassword;
        const newUser = this.userRepository.create(user);
        this.userRepository.save(newUser);

        return {'message': 'Usuario creado con exito!'}
    }

    public async findByUsername(username: string) {
        const name = await this.userRepository.findOne({ where: { username } });
        
        if(!name) {
            throw new HttpException(`Usuario ${username} no encontrado`, HttpStatus.NOT_FOUND);
        }

        return name;
    }

    async changePassword(username: string, newPassword: string) {
        const user = await this.userRepository.findOne({ where: { username } });

        if (!user) {
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }

        // Comparar la nueva contraseña con la actual
        const isSamePassword = await bcrypt.compare(newPassword, user.password);

        if (isSamePassword) {
            throw new HttpException('La nueva contraseña no puede ser igual a la actual', HttpStatus.BAD_REQUEST);
        }

        // Hashear la nueva contraseña
        const salt = await bcrypt.genSalt();
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // Actualizar la contraseña
        user.password = hashedNewPassword;
        await this.userRepository.save(user);

        return { 'message': 'Contraseña cambiada con éxito!' };
    }

    async changeEmail(username: string, newEmail: string) {
        
        // Buscar usuario actual
        const user = await this.userRepository.findOne({ where: { username } });
        if (!user) {
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }
    
        // Verificar si el nuevo email es igual al actual
        if (user.email === newEmail) {
            throw new HttpException('El nuevo email debe ser diferente al actual', HttpStatus.BAD_REQUEST);
        }
    
        // Verificar si el nuevo email ya está en uso por otro usuario
        const emailExists = await this.userRepository.findOne({ 
            where: { email: newEmail },
            select: ['id'] // Solo necesitamos saber si existe
        });
    
        if (emailExists && emailExists.id !== user.id) {
            throw new HttpException('Este email ya está registrado por otro usuario', HttpStatus.CONFLICT);
        }
    
        // Actualizar el email
        user.email = newEmail;
        await this.userRepository.save(user);
    
        return { message: 'Correo electrónico cambiado con éxito!' };
    }

    async requestPasswordReset(email: string) {
        const user = await this.userRepository.findOne({ where: { email } });

        // Por seguridad, no revelamos si el email existe o no
        if (!user) {
            return { message: 'Se ha enviado un token de recuperación a tu correo electronico' };
        }

        // Generar token y fecha de expiración (1 hora)
        const token = uuidv4();
        const expires = new Date();
        expires.setHours(expires.getHours() + 1);

        user.restorePasswordToken = token;
        user.restorePasswordTokenExpires = expires;
        await this.userRepository.save(user);

        // Enviar email
        await this.mailerService.sendPasswordResetEmail(
            user.email, 
            user.username, 
            token
        );

        return { message: 'Se ha enviado un token de recuperación a tu correo electronico' };
    }

    async resetPassword(token: string, newPassword: string) {
        const user = await this.userRepository.findOne({ 
            where: { restorePasswordToken: token },
        });

        // Validar token
        if (!user || !user.restorePasswordTokenExpires || user.restorePasswordTokenExpires < new Date()) {
            throw new HttpException('Token inválido o expirado', HttpStatus.BAD_REQUEST);
        }

        // Validar que la nueva contraseña no sea igual a la actual
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            throw new HttpException('La nueva contraseña no puede ser igual a la actual', HttpStatus.BAD_REQUEST);
        }

        // Hashear la nueva contraseña
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Actualizar usuario (limpiar token y actualizar password)
        user.password = hashedPassword;
        user.restorePasswordToken = null;
        user.restorePasswordTokenExpires = null;
        await this.userRepository.save(user);

        return { message: 'Contraseña cambiada con éxito' };
    }
}
