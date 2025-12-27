import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'username' });
  }

  //Passport llamará a este método automáticamente
  // con el 'username' y 'password' que vengan en el Body del request
  async validate(username: string, password: string): Promise<any> {
    //Llama a nuestro "Validador"
    const user = await this.authService.validateUser(username, password);
    
    if (!user) {
      throw new UnauthorizedException();
    }
    return user; //Devuelve el usuario si la validación fue exitosa
  }
}