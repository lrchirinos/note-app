import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service'; // Importamos UsersService

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) { // Inyectamos UsersService
    super({
      // (en el "Header 'Authorization'" como un "Bearer Token")
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //ignora tokens expirados (la librería lo maneja)
      ignoreExpiration: false,
      //Usa la MISMA palabra secreta que pusimos en auth.module.ts
      secretOrKey: '#MI_PALABRA_SECRET@_PARA_EL_RETO#',
    });
  }

  // 4. ¡LA MAGIA!
  // Una vez que Passport verifica el token, nos da el 'payload'
  // (la info que guardamos: { username: 'rolando', sub: 1 })
  async validate(payload: any) {

    // 5. Buscamos al usuario en la BD
    const user = await this.usersService.findOneByUsername(payload.username);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // 6. ¡IMPORTANTE! NestJS "adjuntará" este objeto 'user'
    // al objeto 'Request' (req). Así, nuestros controladores
    // sabrán QUIÉN está haciendo la petición.
    return user;
  }
}