import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoginRequest, LoginResponse, AuthUser } from '../models/auth.model';
import { environment } from '../../../environments/environment';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/v1/auth`;
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(
    this.getUserFromStorage()
  );
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken()
  );
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        // Extraer token de data.access_token
        if (response.data && response.data.access_token) {
          this.setToken(response.data.access_token);
        }
        // Extraer usuario de data.user
        if (response.data && response.data.user) {
          this.setUser(response.data.user);
          this.currentUserSubject.next(response.data.user);
        }
        this.isAuthenticatedSubject.next(true);
      }),
      catchError((error) => {
        console.error('Error completo en login:', error);
        console.error('Status:', error.status);
        console.error('Status text:', error.statusText);
        console.error('Error body:', error.error);

        let errorMessage = 'Error al iniciar sesión';
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.statusText) {
          errorMessage = error.statusText;
        } else if (error.message) {
          errorMessage = error.message;
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  logout(): void {
    this.removeToken();
    this.removeUser();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Verificar si la cuenta está bloqueada (Solo para referencia, el bloqueo es en backend)
   */
  isBlocked(): boolean {
    // El bloqueo se maneja completamente en el backend
    return false;
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  removeToken(): void {
    sessionStorage.removeItem(this.tokenKey);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  setUser(user: AuthUser): void {
    sessionStorage.setItem(this.userKey, JSON.stringify(user));
  }

  getUserFromStorage(): AuthUser | null {
    const user = sessionStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  removeUser(): void {
    sessionStorage.removeItem(this.userKey);
  }

  private loadUserFromStorage(): void {
    const user = this.getUserFromStorage();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  /**
   * Solicitar desbloqueo - envía correo con enlace
   */
  solicitarDesbloqueo(username: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/solicitar-desbloqueo`,
      { username }
    );
  }

  /**
   * Confirmar desbloqueo - usa token del email
   */
  confirmarDesbloqueo(token: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/confirmar-desbloqueo`,
      { token }
    );
  }
}
