import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth') // Ruta base /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // --- Endpoint de Login ---
  // POST /auth/login
  @UseGuards(AuthGuard('local')) //¡Usa el Guardia Local!
  @Post('login')
  async login(@Request() req) {
    //Si llegamos aquí, las credenciales son válidas
    //    gracias al @UseGuards. 'req.user' es el objeto
    //    que devolvió nuestra LocalStrategy.
    
    //Llamamos al servicio para crear el token JWT.
    return this.authService.login(req.user);
  }
}