import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TipoIngreso } from '../models/tipo-ingreso.model';

@Injectable({ providedIn: 'root' })
export class TipoIngresoService {

  private url = 'http://localhost:8080/api/catalogos/tipos-ingreso';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TipoIngreso[]> {
    return this.http.get<any>(this.url).pipe(map(r => r.data));
  }

  create(nombre: string): Observable<TipoIngreso> {
    return this.http.post<any>(this.url, { tigNombre: nombre }).pipe(map(r => r.data));
  }

  update(id: number, nombre: string): Observable<TipoIngreso> {
    return this.http.put<any>(`${this.url}/${id}`, { tigNombre: nombre }).pipe(map(r => r.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<any>(`${this.url}/${id}`).pipe(map(r => r.data));
  }
}
