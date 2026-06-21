import { Component, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmpleadoService } from '../../../core/services/empleado.service';
import { CreateEmpleadoRequest, EmpleadoResponse, Catalogo } from '../../../core/models/empleado.model';
import { InputMaskDirective } from '../../../shared/directives/input-mask.directive';

@Component({
  selector: 'app-form-empleado',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InputMaskDirective],
  templateUrl: './form-empleado.component.html',
  styleUrl: './form-empleado.component.css'
})
export class FormEmpleadoComponent implements OnInit {
  form!: FormGroup;
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  
  empleadoId: number | null = null;
  isEditing = false;

  // Catálogos
  sexos = signal<Catalogo[]>([]);
  estadosCiviles = signal<Catalogo[]>([]);
  profesiones = signal<Catalogo[]>([]);
  puestos = signal<Catalogo[]>([]);
  unidades = signal<Catalogo[]>([]);
  municipios = signal<Catalogo[]>([]);
  empresas = signal<Catalogo[]>([]);
  empleados = signal<any[]>([]); // Para superior inmediato

  constructor(
    private fb: FormBuilder,
    private empleadoService: EmpleadoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.cargarCatalogos();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.empleadoId = +params['id'];
        this.isEditing = true;
        if (this.empleadoId) {
          this.cargarEmpleado(this.empleadoId);
        }
      }
    });
  }

  cargarCatalogos(): void {
    this.empleadoService.obtenerSexos().subscribe({
      next: (response) => this.sexos.set(response.data),
      error: (error) => console.error('Error cargando sexos:', error)
    });

    this.empleadoService.obtenerEstadosCiviles().subscribe({
      next: (response) => this.estadosCiviles.set(response.data),
      error: (error) => console.error('Error cargando estados civiles:', error)
    });

    this.empleadoService.obtenerProfesiones().subscribe({
      next: (response) => this.profesiones.set(response.data),
      error: (error) => console.error('Error cargando profesiones:', error)
    });

    this.empleadoService.obtenerPuestos().subscribe({
      next: (response) => this.puestos.set(response.data),
      error: (error) => console.error('Error cargando puestos:', error)
    });

    this.empleadoService.obtenerUnidades().subscribe({
      next: (response) => this.unidades.set(response.data),
      error: (error) => console.error('Error cargando unidades:', error)
    });

    this.empleadoService.obtenerMunicipios().subscribe({
      next: (response) => this.municipios.set(response.data),
      error: (error) => console.error('Error cargando municipios:', error)
    });

    this.empleadoService.obtenerEmpresas().subscribe({
      next: (response) => this.empresas.set(response.data),
      error: (error) => console.error('Error cargando empresas:', error)
    });

    this.empleadoService.listarEmpleados().subscribe({
      next: (response) => this.empleados.set(response.data),
      error: (error) => console.error('Error cargando empleados:', error)
    });
  }

  initializeForm(): void {
    this.form = this.fb.group({
      empNombre: ['', [Validators.required]],
      empApellido: ['', [Validators.required]],
      empDui: ['', [Validators.required]],
      empNit: [''],
      empNup: [''],
      empIsss: [''],
      empFechaNacimiento: ['', [this.validarFechaNacimiento]],
      idSexo: [0],
      idEstadoCivil: [0],
      idProfesion: [0],
      idPuesto: [0, [Validators.required]],
      idUnidad: [0, [Validators.required]],
      empFechaIngreso: ['', [Validators.required, this.validarFechaIngreso]],
      empSalarioBase: [0, [Validators.required, this.validarSalarioPositivo]],
      empCorreoInstitucional: ['', [Validators.email]],
      empCorreoPersonal: ['', [Validators.email]],
      idSuperior: [0],
      empRepresentanteLegal: [false],
      empEstado: [true],
      idEmpresa: [0, [Validators.required]],
      idMunicipio: [0, [Validators.required]],
      dirCalle: ['', [Validators.required]],
      dirColonia: ['', [Validators.required]],
      dirReferencia: ['']
    });
  }

  // Validadores personalizados
  validarSalarioPositivo = (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    if (!valor) return null;
    return Number(valor) >= 0 ? null : { salarioNegativo: true };
  };

  validarFechaNacimiento = (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    if (!valor) return null;
    const fecha = new Date(valor);
    const hoy = new Date();
    return fecha <= hoy ? null : { fechaNacimientoFutura: true };
  };

  validarFechaIngreso = (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    if (!valor) return null;
    const fecha = new Date(valor);
    const hoy = new Date();
    return fecha <= hoy ? null : { fechaIngresoFutura: true };
  };

  cargarEmpleado(id: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.empleadoService.obtenerEmpleado(id).subscribe({
      next: (response) => {
        this.mapearDatosAlFormulario(response.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar empleado:', error);
        this.errorMessage.set('Error al cargar los datos del empleado');
        this.isLoading.set(false);
      }
    });
  }

  mapearDatosAlFormulario(datos: EmpleadoResponse): void {
    this.form.patchValue({
      empNombre: datos.emp_nombre,
      empApellido: datos.emp_apellido,
      empDui: datos.emp_dui,
      empNit: datos.emp_nit,
      empNup: datos.emp_nup,
      empIsss: datos.emp_isss,
      empFechaNacimiento: datos.emp_fecha_nacimiento,
      idSexo: datos.id_sexo,
      idEstadoCivil: datos.id_estado_civil,
      idProfesion: datos.id_profesion,
      idPuesto: datos.id_puesto,
      idUnidad: datos.id_unidad,
      empFechaIngreso: datos.emp_fecha_ingreso,
      empSalarioBase: datos.emp_salario_base,
      empCorreoInstitucional: datos.emp_correo_institucional,
      empCorreoPersonal: datos.emp_correo_personal,
      idSuperior: datos.id_superior,
      empRepresentanteLegal: datos.emp_representante_legal,
      empEstado: datos.emp_estado,
      idEmpresa: datos.id_empresa,
      idMunicipio: datos.direccion?.id_municipio || 0,
      dirCalle: datos.direccion?.dir_calle || '',
      dirColonia: datos.direccion?.dir_colonia || '',
      dirReferencia: datos.direccion?.dir_referencia || ''
    });
  }

  guardar(): void {
    if (!this.form.valid) {
      this.errorMessage.set('Por favor complete todos los campos requeridos');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const datos: CreateEmpleadoRequest = this.normalizarDatos(this.form.value);
    
    console.log('📤 Datos a enviar:', JSON.stringify(datos, null, 2));

    const peticion = this.isEditing && this.empleadoId
      ? this.empleadoService.actualizarEmpleado(this.empleadoId, datos)
      : this.empleadoService.crearEmpleado(datos);

    peticion.subscribe({
      next: (response) => {
        this.isSaving.set(false);
        this.successMessage.set(
          this.isEditing ? 'Empleado actualizado correctamente' : 'Empleado creado correctamente'
        );
        
        setTimeout(() => {
          this.router.navigate(['/empleados']);
        }, 1500);
      },
      error: (error) => {
        console.error('❌ Error HTTP completo:', error);
        console.error('Estado:', error.status);
        console.error('Mensaje:', error.message);
        console.error('Body:', error.error);
        this.errorMessage.set(`Error al guardar el empleado: ${error.error?.message || error.message}`);
        this.isSaving.set(false);
      }
    });
  }

  normalizarDatos(datos: any): CreateEmpleadoRequest {
    // Limpiar y validar DUI
    let dui = (datos.empDui || '').trim();
    console.log('📤 DUI enviado al backend:', dui);
    
    const resultado = {
      emp_nombre: (datos.empNombre || '')?.trim() || '',
      emp_apellido: (datos.empApellido || '')?.trim() || '',
      emp_dui: dui,
      emp_nit: (datos.empNit || '')?.trim() || '',
      emp_nup: (datos.empNup || '')?.trim() || '',
      emp_isss: (datos.empIsss || '')?.trim() || '',
      emp_fecha_nacimiento: datos.empFechaNacimiento || '',
      emp_fecha_ingreso: datos.empFechaIngreso || '',
      emp_salario_base: Number(datos.empSalarioBase) || 0,
      emp_correo_personal: (datos.empCorreoPersonal || '')?.trim() || '',
      emp_correo_institucional: (datos.empCorreoInstitucional || '')?.trim() || '',
      emp_representante_legal: Boolean(datos.empRepresentanteLegal),
      emp_estado: Boolean(datos.empEstado),
      id_sexo: Number(datos.idSexo) || 0,
      id_estado_civil: Number(datos.idEstadoCivil) || 0,
      id_profesion: Number(datos.idProfesion) || 0,
      id_puesto: Number(datos.idPuesto) || 0,
      id_unidad: Number(datos.idUnidad) || 0,
      id_superior: (Number(datos.idSuperior) || 0) > 0 ? Number(datos.idSuperior) : null,
      id_empresa: Number(datos.idEmpresa) || 0,
      direccion: {
        dir_calle: (datos.dirCalle || '')?.trim() || '',
        dir_colonia: (datos.dirColonia || '')?.trim() || '',
        dir_referencia: (datos.dirReferencia || '')?.trim() || '',
        id_municipio: Number(datos.idMunicipio) || 0
      }
    } as any;
    
    console.log('📤 JSON enviado:', JSON.stringify(resultado, null, 2));
    return resultado;
  }

  volver(): void {
    this.router.navigate(['/empleados']);
  }
}
