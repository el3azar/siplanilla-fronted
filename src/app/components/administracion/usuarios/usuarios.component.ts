import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService, UsuarioResponse, RolOption } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsuariosComponent implements OnInit {

  usuarios: UsuarioResponse[] = [];
  roles: RolOption[] = [];
  mostrarFormulario = false;
  guardando = false;
  mensajeExito = '';
  mensajeError = '';

  editandoRolId: number | null = null;
  rolSeleccionado: number | null = null;

  form: FormGroup;

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      id_empleado: [null, Validators.required],
      id_rol: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.usuarioService.getAll().subscribe({
      next: datos => {
        this.usuarios = datos;
        this.cdr.markForCheck();
      },
      error: () => this.mostrarError('No se pudieron cargar los usuarios.')
    });

    this.usuarioService.getRoles().subscribe({
      next: datos => {
        this.roles = datos;
        this.cdr.markForCheck();
      }
    });
  }

  abrirFormulario(): void {
    this.form.reset();
    this.mostrarFormulario = true;
    this.mensajeError = '';
    this.cdr.markForCheck();
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.form.reset();
    this.cdr.markForCheck();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando = true;
    this.mensajeError = '';
    this.usuarioService.crear(this.form.value).subscribe({
      next: nuevo => {
        this.usuarios = [...this.usuarios, nuevo];
        this.guardando = false;
        this.mostrarFormulario = false;
        this.form.reset();
        this.mostrarExito('Usuario creado exitosamente.');
        this.cdr.markForCheck();
      },
      error: err => {
        this.guardando = false;
        const msg = err?.error?.message ?? 'Error al crear el usuario.';
        this.mostrarError(msg);
        this.cdr.markForCheck();
      }
    });
  }

  toggleEstado(usuario: UsuarioResponse): void {
    const nuevoEstado = !usuario.estado;
    this.usuarioService.cambiarEstado(usuario.id, nuevoEstado).subscribe({
      next: actualizado => {
        this.usuarios = this.usuarios.map(u =>
          u.id === actualizado.id ? actualizado : u
        );
        this.mostrarExito(`Usuario ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`);
        this.cdr.markForCheck();
      },
      error: () => this.mostrarError('No se pudo cambiar el estado.')
    });
  }

  iniciarCambioRol(usuario: UsuarioResponse): void {
    this.editandoRolId = usuario.id;
    const rolActual = this.roles.find(r => usuario.roles.includes(r.rolNombre));
    this.rolSeleccionado = rolActual?.idRol ?? null;
    this.cdr.markForCheck();
  }

  cancelarCambioRol(): void {
    this.editandoRolId = null;
    this.rolSeleccionado = null;
    this.cdr.markForCheck();
  }

  confirmarCambioRol(usuario: UsuarioResponse): void {
    if (!this.rolSeleccionado) return;
    this.usuarioService.cambiarRol(usuario.id, this.rolSeleccionado).subscribe({
      next: actualizado => {
        this.usuarios = this.usuarios.map(u =>
          u.id === actualizado.id ? actualizado : u
        );
        this.editandoRolId = null;
        this.rolSeleccionado = null;
        this.mostrarExito('Rol actualizado correctamente.');
        this.cdr.markForCheck();
      },
      error: () => this.mostrarError('No se pudo cambiar el rol.')
    });
  }

  onRolChange(event: Event): void {
    this.rolSeleccionado = Number((event.target as HTMLSelectElement).value);
  }

  campo(nombre: string) {
    return this.form.get(nombre);
  }

  private mostrarExito(msg: string): void {
    this.mensajeExito = msg;
    this.mensajeError = '';
    this.cdr.markForCheck();
    setTimeout(() => { this.mensajeExito = ''; this.cdr.markForCheck(); }, 4000);
  }

  private mostrarError(msg: string): void {
    this.mensajeError = msg;
    this.cdr.markForCheck();
  }
}
