import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface UsuarioResponse {
  id: number;
  username: string;
  email: string;
  estado: boolean;
  bloqueado: boolean;
  roles: string[];
  id_empleado: number;
  nombre_empleado: string;
}

export interface CrearUsuarioRequest {
  username: string;
  email: string;
  password: string;
  id_empleado: number;
  id_rol: number;
}

export interface RolOption {
  idRol: number;
  rolNombre: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/v1/usuarios`;
  private rolesUrl = `${environment.apiUrl}/v1/roles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<UsuarioResponse[]> {
    return this.http.get<any>(this.apiUrl).pipe(map(r => r.data));
  }

  crear(request: CrearUsuarioRequest): Observable<UsuarioResponse> {
    return this.http.post<any>(this.apiUrl, request).pipe(map(r => r.data));
  }

  cambiarEstado(id: number, estado: boolean): Observable<UsuarioResponse> {
    return this.http.put<any>(`${this.apiUrl}/${id}/estado?estado=${estado}`, {}).pipe(map(r => r.data));
  }

  cambiarRol(id: number, idRol: number): Observable<UsuarioResponse> {
    return this.http.put<any>(`${this.apiUrl}/${id}/rol`, { id_rol: idRol }).pipe(map(r => r.data));
  }

  getRoles(): Observable<RolOption[]> {
    return this.http.get<any>(this.rolesUrl).pipe(map(r => r.data));
  }
}
