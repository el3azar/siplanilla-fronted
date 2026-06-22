import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, CreateEmpleadoRequest, EmpleadoResponse, Empleado, Catalogo } from '../models/empleado.model';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private apiUrl = `${environment.apiUrl}/v1/empleados`;
  private catalogoUrl = `${environment.apiUrl}/v1/catalogo`;

  constructor(private http: HttpClient) { }

  /**
   * Obtener lista de todos los empleados
   */
  listarEmpleados(): Observable<ApiResponse<Empleado[]>> {
    return this.http.get<ApiResponse<Empleado[]>>(this.apiUrl);
  }

  /**
   * Obtener un empleado por ID
   */
  obtenerEmpleado(id: number): Observable<ApiResponse<EmpleadoResponse>> {
    return this.http.get<ApiResponse<EmpleadoResponse>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear un nuevo empleado
   */
  crearEmpleado(empleado: CreateEmpleadoRequest): Observable<ApiResponse<EmpleadoResponse>> {
    return this.http.post<ApiResponse<EmpleadoResponse>>(this.apiUrl, empleado);
  }

  /**
   * Actualizar un empleado
   */
  actualizarEmpleado(id: number, empleado: Partial<CreateEmpleadoRequest>): Observable<ApiResponse<EmpleadoResponse>> {
    return this.http.patch<ApiResponse<EmpleadoResponse>>(`${this.apiUrl}/${id}`, empleado);
  }

  /**
   * Desactivar un empleado (cambiar estado a false)
   */
  desactivarEmpleado(id: number): Observable<ApiResponse<EmpleadoResponse>> {
    return this.actualizarEmpleado(id, { emp_estado: false });
  }

  /**
   * Activar un empleado (cambiar estado a true)
   */
  activarEmpleado(id: number): Observable<ApiResponse<EmpleadoResponse>> {
    return this.actualizarEmpleado(id, { emp_estado: true });
  }

  /**
   * Cambiar estado de un empleado (activo/inactivo)
   * @param id ID del empleado
   * @param estado 1 para activo, 0 para inactivo
   */
  cambiarEstadoEmpleado(id: number, estado: 0 | 1): Observable<ApiResponse<EmpleadoResponse>> {
    return this.http.patch<ApiResponse<EmpleadoResponse>>(
      `${this.apiUrl}/${id}/estado`,
      { estado }
    );
  }

  /**
   * Buscar empleados por nombre
   * @param nombre Nombre del empleado a buscar
   */
  buscarEmpleadoPorNombre(nombre: string): Observable<ApiResponse<Empleado[]>> {
    return this.http.get<ApiResponse<Empleado[]>>(
      `${this.apiUrl}/buscar`,
      { params: { nombre } }
    );
  }

  // Catálogos
  obtenerSexos(): Observable<ApiResponse<Catalogo[]>> {
    return this.http.get<ApiResponse<Catalogo[]>>(`${this.catalogoUrl}/sexos`);
  }

  obtenerEstadosCiviles(): Observable<ApiResponse<Catalogo[]>> {
    return this.http.get<ApiResponse<Catalogo[]>>(`${this.catalogoUrl}/estados-civiles`);
  }

  obtenerProfesiones(): Observable<ApiResponse<Catalogo[]>> {
    return this.http.get<ApiResponse<Catalogo[]>>(`${this.catalogoUrl}/profesiones`);
  }

  obtenerPuestos(): Observable<ApiResponse<Catalogo[]>> {
    return this.http.get<ApiResponse<Catalogo[]>>(`${this.catalogoUrl}/puestos`);
  }

  obtenerUnidades(): Observable<ApiResponse<Catalogo[]>> {
    return this.http.get<ApiResponse<Catalogo[]>>(`${this.catalogoUrl}/unidades`);
  }

  obtenerMunicipios(): Observable<ApiResponse<Catalogo[]>> {
    return this.http.get<ApiResponse<Catalogo[]>>(`${this.catalogoUrl}/municipios`);
  }

  obtenerEmpresas(): Observable<ApiResponse<Catalogo[]>> {
    return this.http.get<ApiResponse<Catalogo[]>>(`${this.catalogoUrl}/empresas`);
  }
}
