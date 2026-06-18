import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TipoDescuento } from '../models/tipo-descuento.model';

@Injectable({ providedIn: 'root' })
export class TipoDescuentoService {

  private url = 'http://localhost:8080/api/catalogos/tipos-descuento';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TipoDescuento[]> {
    return this.http.get<any>(this.url).pipe(map(r => r.data));
  }

  create(nombre: string): Observable<TipoDescuento> {
    return this.http.post<any>(this.url, { tidNombre: nombre }).pipe(map(r => r.data));
  }

  update(id: number, nombre: string): Observable<TipoDescuento> {
    return this.http.put<any>(`${this.url}/${id}`, { tidNombre: nombre }).pipe(map(r => r.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<any>(`${this.url}/${id}`).pipe(map(r => r.data));
  }
}