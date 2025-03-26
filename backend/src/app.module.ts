import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { HOST, PASSWORD, USERNAME, DATABASE, PORT } from './config/database.config';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    UserModule, 
    TaskModule,
    AuthModule,
    MailerModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: HOST,
      port: PORT,
      username: USERNAME,
      password: PASSWORD,
      database: DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
