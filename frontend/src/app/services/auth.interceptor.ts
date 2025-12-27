import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

// Este es el nuevo estilo de Interceptor (función)
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken(); //Obtenemos el token del localStorage

  if (token) {
    //Clona la petición
    const clonedReq = req.clone({
      //Le añade el "Header" de autorización
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    //Envía la petición clonada (con el token)
    return next(clonedReq);
  }

  //Si no hay token, envía la petición original
  return next(req);
};