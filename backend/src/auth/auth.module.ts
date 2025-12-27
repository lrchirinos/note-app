import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; 
import { PassportModule } from '@nestjs/passport'; 
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule, 
    PassportModule, //como un pasaporte para autenticar al usuario esta es la estrategia
    JwtModule.register({
      secret: '#MI_PALABRA_SECRET@_PARA_EL_RETO#', //¡IMPORTANTE! normalmente no se escribe en el codigo si no en una variable de entorno .env
      signOptions: { expiresIn: '1h' }, //el token expira en 1 hora
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
  ], 
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}