import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DetallePlanilla } from '../models/detalle-planilla.model';

@Injectable({ providedIn: 'root' })
export class DetallePlanillaService {

  private url = 'http://localhost:8080/api/planilla/detalle';

  constructor(private http: HttpClient) {}

  getAll(): Observable<DetallePlanilla[]> {
    return this.http.get<any>(this.url).pipe(map(r => r.data));
  }

  getById(id: number): Observable<DetallePlanilla> {
    return this.http.get<any>(`${this.url}/${id}`).pipe(map(r => r.data));
  }
}