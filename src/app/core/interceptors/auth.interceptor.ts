import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Obtener el token del servicio de autenticación
    const token = this.authService.getToken();

    console.log('🔐 AuthInterceptor - URL:', request.url);
    console.log('🔐 AuthInterceptor - Token:', token ? '✅ Presente' : '❌ No existe');

    // Si existe un token, agregarlo al header Authorization
    if (token) {
      console.log('🔐 AuthInterceptor - Agregando token al header');
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      console.log('⚠️ AuthInterceptor - No hay token disponible');
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error HTTP:', error.status, error.statusText);
        // Si la respuesta es 401 (Unauthorized), el token puede estar expirado
        if (error.status === 401) {
          console.warn('⚠️ Token expirado - Limpiando sesión');
          // Limpiar la sesión
          this.authService.logout();
          // Redirigir al login
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
