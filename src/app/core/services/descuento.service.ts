import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Descuento } from '../models/descuento.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DescuentoService {

  private url = `${environment.apiUrl}/planilla/descuentos`;

  constructor(private http: HttpClient) {}

  getByDetalle(idDetalle: number): Observable<Descuento[]> {
    return this.http.get<any>(`${this.url}/detalle/${idDetalle}`).pipe(map(r => r.data));
  }

  getTotalByDetalle(idDetalle: number): Observable<number> {
    return this.http.get<any>(`${this.url}/total/${idDetalle}`).pipe(map(r => r.data));
  }

  create(idDetalle: number, idTipoDescuento: number, monto: number): Observable<Descuento> {
    return this.http.post<any>(this.url, {
      idDetallePlanilla: idDetalle,
      idTipoDescuento: idTipoDescuento,
      desMonto: monto
    }).pipe(map(r => r.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<any>(`${this.url}/${id}`).pipe(map(r => r.data));
  }

  update(id: number, idTipoDescuento: number, monto: number): Observable<Descuento> {
  return this.http.put<any>(`${this.url}/${id}`, {
    idTipoDescuento: idTipoDescuento,
    desMonto: monto
  }).pipe(map(r => r.data));
}
}