import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service'; 
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService, 
    private readonly jwtService: JwtService,
  ) {}

  // --- El Validador ---
  // Este método recibe un username y un password plano
  async validateUser(username: string, pass: string): Promise<any> {
    
    //Busca al usuario en la BD
    const user = await this.usersService.findOneByUsername(username);
    
    // Si el usuario existe, compara las contraseñas
    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password); // bycrypt compara
      
      if (isMatch) {
        // Si coincide, devuelve el usuario (sin el password)
        const { password, ...result } = user;
        return result;
      }
    }
    
    //Si el usuario no existe o la contraseña no coincide, lanza un error
    throw new UnauthorizedException('Invalid credentials');
  }
  async login(user: any) {
    // 'user' es el objeto que nos devolvió LocalStrategy
    // Creamos el "payload" (la info que va dentro del token)
    const payload = { username: user.username, sub: user.id }; // 'sub' es el ID del usuario
    
    // Firmamos el token y lo devolvemos
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}