export interface Direccion {
  dir_calle: string;
  dir_colonia: string;
  dir_referencia: string;
  id_municipio: number;
}

export interface DireccionResponse extends Direccion {
  id_direccion: number;
  municipio_nombre: string;
  id_empleado: number;
}

export interface CreateEmpleadoRequest {
  emp_nombre: string;
  emp_apellido: string;
  emp_fecha_ingreso: string;
  emp_fecha_nacimiento: string;
  emp_dui: string;
  emp_estado: boolean;
  emp_nit: string;
  emp_nup: string;
  emp_isss: string;
  emp_salario_base: number;
  emp_correo_personal: string;
  emp_correo_institucional: string;
  emp_representante_legal: boolean;
  id_sexo: number;
  id_estado_civil: number;
  id_profesion: number;
  id_puesto: number;
  id_empresa: number;
  id_unidad: number;
  id_superior: number | null;
  direccion: Direccion;
}

export interface EmpleadoResponse {
  id_empleado: number;
  emp_nombre: string;
  emp_apellido: string;
  emp_fecha_ingreso: string;
  emp_fecha_nacimiento: string;
  emp_dui: string;
  emp_estado: boolean;
  emp_nit: string;
  emp_nup: string;
  emp_isss: string;
  emp_salario_base: number;
  emp_correo_personal: string;
  emp_correo_institucional: string;
  emp_representante_legal: boolean;
  id_sexo: number;
  id_estado_civil: number;
  id_profesion: number;
  id_puesto: number;
  id_empresa: number;
  id_unidad: number;
  id_superior: number | null;
  direccion: DireccionResponse;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Modelo simplificado para la tabla
export interface Empleado {
  id_empleado: number;
  emp_nombre: string;
  emp_apellido: string;
  emp_dui: string;
  emp_nit: string;
  emp_correo_personal: string;
  emp_correo_institucional: string;
  id_puesto: number;
  id_unidad: number;
  emp_salario_base: number;
  emp_estado: boolean;
}

// Catálogos
export interface Catalogo {
  id: number;
  nombre: string;
}

export interface CatalogoResponse {
  id: number;
  nombre: string;
}
