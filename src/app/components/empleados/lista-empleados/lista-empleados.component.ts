import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmpleadoService } from '../../../core/services/empleado.service';
import { Empleado } from '../../../core/models/empleado.model';

interface EmpleadoDisplay extends Empleado {
  nombre_completo: string;
}

@Component({
  selector: 'app-lista-empleados',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './lista-empleados.component.html',
  styleUrl: './lista-empleados.component.css'
})
export class ListaEmpleadosComponent implements OnInit {
  filtro = signal<'todos' | 'activos' | 'inactivos'>('todos');
  busqueda = signal('');
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);
  mensajeError = signal<string | null>(null);
  empleados = signal<EmpleadoDisplay[]>([]);

  mostrarConfirmacion = false;
  empleadoPendienteId: number | null = null;

  constructor(private empleadoService: EmpleadoService) {}

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.empleadoService.listarEmpleados().subscribe({
      next: (response) => {
        const empleadosData = Array.isArray(response.data) ? response.data : [response.data];
        const empleadosDisplay: EmpleadoDisplay[] = empleadosData.map(e => ({
          ...e,
          nombre_completo: `${e.emp_nombre} ${e.emp_apellido}`
        }));
        this.empleados.set(empleadosDisplay);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error completo al cargar empleados:', error);
        console.error('Status:', error.status);
        console.error('Status text:', error.statusText);
        console.error('URL:', error.url);
        console.error('Error body:', error.error);
        
        let errorMsg = 'Error al cargar la lista de empleados';
        if (error.status === 0) {
          errorMsg = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:8080';
        } else if (error.error?.message) {
          errorMsg = error.error.message;
        }
        
        this.errorMessage.set(errorMsg);
        this.isLoading.set(false);
      }
    });
  }

  get empleadosFiltrados(): EmpleadoDisplay[] {
    return this.empleados().filter(e => {
      const matchFiltro = this.filtro() === 'todos' || (this.filtro() === 'activos' ? e.emp_estado : !e.emp_estado);
      const q = this.busqueda().toLowerCase();
      const matchBusqueda = !q || 
        e.nombre_completo.toLowerCase().includes(q) || 
        e.emp_dui.includes(q);
      return matchFiltro && matchBusqueda;
    });
  }

  get activos(): number {
    return this.empleados().filter(e => e.emp_estado).length;
  }

  get inactivos(): number {
    return this.empleados().filter(e => !e.emp_estado).length;
  }

  pedirConfirmacionDesactivar(id: number, event: Event): void {
    event.preventDefault();
    this.empleadoPendienteId = id;
    this.mostrarConfirmacion = true;
  }

  cancelarConfirmacion(): void {
    this.mostrarConfirmacion = false;
    this.empleadoPendienteId = null;
  }

  confirmarDesactivar(): void {
    if (!this.empleadoPendienteId) return;
    const id = this.empleadoPendienteId;
    this.mostrarConfirmacion = false;
    this.empleadoPendienteId = null;

    this.empleadoService.desactivarEmpleado(id).subscribe({
      next: () => {
        this.cargarEmpleados();
        this.mostrarExito('Empleado desactivado correctamente.');
      },
      error: () => {
        this.mostrarError('Error al desactivar el empleado.');
      }
    });
  }

  activarEmpleado(id: number, event: Event): void {
    event.preventDefault();

    this.empleadoService.activarEmpleado(id).subscribe({
      next: () => {
        this.cargarEmpleados();
        this.mostrarExito('Empleado activado correctamente.');
      },
      error: () => {
        this.mostrarError('Error al activar el empleado.');
      }
    });
  }

  private mostrarExito(msg: string): void {
    this.mensajeExito.set(msg);
    this.mensajeError.set(null);
    setTimeout(() => this.mensajeExito.set(null), 4000);
  }

  private mostrarError(msg: string): void {
    this.mensajeError.set(msg);
    this.mensajeExito.set(null);
    setTimeout(() => this.mensajeError.set(null), 5000);
  }
}
