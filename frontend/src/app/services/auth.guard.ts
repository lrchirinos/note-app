import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    take(1), // valor actual
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true; // ¡Sí puede pasar!
      }

      // No está logueado, redirigir a /login
      router.navigate(['/login']);
      return false; // ¡No puede pasar!
    })
  );
};