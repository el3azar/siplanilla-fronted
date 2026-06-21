import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  console.log('🔐 AuthInterceptor - URL:', req.url);
  console.log('🔐 AuthInterceptor - Token:', token ? '✅ Presente' : '❌ No existe');

  // Si existe un token, agregarlo al header Authorization
  if (token) {
    console.log('🔐 AuthInterceptor - Agregando token al header');
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    console.log('⚠️ AuthInterceptor - No hay token disponible');
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('❌ Error HTTP:', error.status, error.statusText);
      
      // Si la respuesta es 401 (Unauthorized), el token puede estar expirado
      if (error.status === 401) {
        console.warn('⚠️ Token expirado - Limpiando sesión');
        authService.logout();
        router.navigate(['/login']);
      }
      
      return throwError(() => error);
    })
  );
};
