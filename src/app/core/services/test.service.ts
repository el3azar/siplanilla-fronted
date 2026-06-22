import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  constructor(private http: HttpClient) { }

  testBackend() {
    console.log('Intentando conectar a http://localhost:8080...');
    return this.http.get('http://localhost:8080/api/v1/empleados', {
      responseType: 'text'
    }).subscribe({
      next: (data) => {
        console.log('✅ Backend respondió:', data);
      },
      error: (error) => {
        console.error('❌ Error de conexión:', error);
        console.error('Status:', error.status);
        console.error('Tipo de error:', error.type);
      }
    });
  }
}
