import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ingreso } from '../models/ingreso.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class IngresoService {

  private url = `${environment.apiUrl}/planilla/ingresos`;

  constructor(private http: HttpClient) {}

  getByDetalle(idDetalle: number): Observable<Ingreso[]> {
    return this.http.get<any>(`${this.url}/detalle/${idDetalle}`).pipe(map(r => r.data));
  }

  create(idDetalle: number, idTipoIngreso: number, monto: number): Observable<Ingreso> {
    return this.http.post<any>(this.url, {
      idDetallePlanilla: idDetalle,
      idTipoIngreso: idTipoIngreso,
      ingMonto: monto
    }).pipe(map(r => r.data));
  }

  update(id: number, idTipoIngreso: number, monto: number): Observable<Ingreso> {
    return this.http.put<any>(`${this.url}/${id}`, {
      idTipoIngreso: idTipoIngreso,
      ingMonto: monto
    }).pipe(map(r => r.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<any>(`${this.url}/${id}`).pipe(map(r => r.data));
  }
}