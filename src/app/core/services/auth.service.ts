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
        if (response.data && response.data.access_token) {
          this.setToken(response.data.access_token);
        }
        if (response.data && response.data.user) {
          this.setUser(response.data.user);
          this.currentUserSubject.next(response.data.user);
        }
        this.isAuthenticatedSubject.next(true);
      }),
      catchError((error) => {
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

  /**
   * Verificar estado de la cuenta antes de login
   * GET /v1/auth/verificar-estado/{username}
   */
  verificarEstado(username: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/verificar-estado/${username}`);
  }

  logout(): void {
    this.removeToken();
    this.removeUser();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  // --- Helpers de rol ---

  hasRole(role: string): boolean {
    return this.getCurrentUser()?.roles?.includes(role) ?? false;
  }

  getRoles(): string[] {
    return this.getCurrentUser()?.roles ?? [];
  }

  getIdEmpleado(): number | null {
    return this.getCurrentUser()?.id_empleado ?? null;
  }

  isAdmin(): boolean {
    return this.hasRole('Administrador');
  }

  isRRHH(): boolean {
    return this.hasRole('RRHH');
  }

  isEmpleado(): boolean {
    return this.hasRole('Empleado');
  }

  // --- Token y sesión ---

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

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  isBlocked(): boolean {
    return false;
  }

  private loadUserFromStorage(): void {
    const user = this.getUserFromStorage();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  // --- Desbloqueo ---

  solicitarDesbloqueo(username: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/solicitar-desbloqueo`, { username });
  }

  confirmarDesbloqueo(token: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/confirmar-desbloqueo`, { token });
  }
}
