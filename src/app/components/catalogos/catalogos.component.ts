import { Component, signal, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoDescuentoService } from '../../core/services/tipo-descuento.service';
import { TipoIngresoService } from '../../core/services/tipo-ingreso.service';
import { TipoDescuento } from '../../core/models/tipo-descuento.model';
import { TipoIngreso } from '../../core/models/tipo-ingreso.model';

@Component({
  selector: 'app-catalogos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogos.component.html',
  styleUrl: './catalogos.component.css'
})
export class CatalogosComponent implements OnInit {

  private cdr = inject(ChangeDetectorRef);

  tabActivo = signal('tipos-ingreso');

  tabs = [
    { id: 'tipos-ingreso',   label: 'Tipos de Ingreso' },
    { id: 'tipos-descuento', label: 'Tipos de Descuento' },
  ];

  tiposIngreso: TipoIngreso[] = [];
  tiposDescuento: TipoDescuento[] = [];

  mostrarModal = false;
  modoEditar = false;
  idEditando: number | null = null;
  nombreInput = '';
  errorInput = '';

  mostrarConfirm = false;
  idEliminar: number | null = null;

  mensajeExito = '';

  constructor(
    private tipoDescuentoService: TipoDescuentoService,
    private tipoIngresoService: TipoIngresoService
  ) {}

  ngOnInit() {
    this.cargarTiposDescuento();
    this.cargarTiposIngreso();
  }

  cargarTiposDescuento() {
    this.tipoDescuentoService.getAll().subscribe(data => {
      this.tiposDescuento = data;
      this.cdr.markForCheck();
    });
  }

  cargarTiposIngreso() {
    this.tipoIngresoService.getAll().subscribe(data => {
      this.tiposIngreso = data;
      this.cdr.markForCheck();
    });
  }

  get conteoActivo(): number {
    return this.tabActivo() === 'tipos-descuento'
      ? this.tiposDescuento.length
      : this.tiposIngreso.length;
  }

  mostrarMensaje(texto: string) {
    this.mensajeExito = texto;
    setTimeout(() => {
      this.mensajeExito = '';
      this.cdr.markForCheck();
    }, 3000);
  }

  abrirModalCrear() {
    this.modoEditar = false;
    this.nombreInput = '';
    this.errorInput = '';
    this.mostrarModal = true;
  }

  abrirModalEditarDescuento(item: TipoDescuento) {
    this.modoEditar = true;
    this.idEditando = item.idTipoDescuento;
    this.nombreInput = item.tidNombre;
    this.errorInput = '';
    this.mostrarModal = true;
  }

  abrirModalEditarIngreso(item: TipoIngreso) {
    this.modoEditar = true;
    this.idEditando = item.idTipoIngreso;
    this.nombreInput = item.tigNombre;
    this.errorInput = '';
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.nombreInput = '';
    this.errorInput = '';
    this.idEditando = null;
  }

  get tituloModal(): string {
    const accion = this.modoEditar ? 'Editar' : 'Agregar';
    return this.tabActivo() === 'tipos-descuento'
      ? `${accion} Tipo de Descuento`
      : `${accion} Tipo de Ingreso`;
  }

  get placeholderModal(): string {
    return this.tabActivo() === 'tipos-descuento'
      ? 'Nombre del tipo de descuento'
      : 'Nombre del tipo de ingreso';
  }

  guardar() {
    if (!this.nombreInput.trim()) return;

    const nombreNormalizado = this.nombreInput.trim().toLowerCase();

    if (this.tabActivo() === 'tipos-descuento') {
      const duplicado = this.tiposDescuento.some(t =>
        t.tidNombre.toLowerCase() === nombreNormalizado &&
        t.idTipoDescuento !== this.idEditando
      );
      if (duplicado) { this.errorInput = 'Ya existe un tipo de descuento con ese nombre.'; return; }

      if (this.modoEditar && this.idEditando !== null) {
        this.tipoDescuentoService.update(this.idEditando, this.nombreInput.trim()).subscribe({
          next: () => {
            this.cerrarModal();
            this.cargarTiposDescuento();
            this.mostrarMensaje('Tipo de descuento actualizado correctamente');
            this.cdr.markForCheck();
          }
        });
      } else {
        this.tipoDescuentoService.create(this.nombreInput.trim()).subscribe({
          next: () => {
            this.cerrarModal();
            this.cargarTiposDescuento();
            this.mostrarMensaje('Tipo de descuento creado correctamente');
            this.cdr.markForCheck();
          }
        });
      }

    } else {
      const duplicado = this.tiposIngreso.some(t =>
        t.tigNombre.toLowerCase() === nombreNormalizado &&
        t.idTipoIngreso !== this.idEditando
      );
      if (duplicado) { this.errorInput = 'Ya existe un tipo de ingreso con ese nombre.'; return; }

      if (this.modoEditar && this.idEditando !== null) {
        this.tipoIngresoService.update(this.idEditando, this.nombreInput.trim()).subscribe({
          next: () => {
            this.cerrarModal();
            this.cargarTiposIngreso();
            this.mostrarMensaje('Tipo de ingreso actualizado correctamente');
            this.cdr.markForCheck();
          }
        });
      } else {
        this.tipoIngresoService.create(this.nombreInput.trim()).subscribe({
          next: () => {
            this.cerrarModal();
            this.cargarTiposIngreso();
            this.mostrarMensaje('Tipo de ingreso creado correctamente');
            this.cdr.markForCheck();
          }
        });
      }
    }
  }

  confirmarEliminar(id: number) {
    this.idEliminar = id;
    this.mostrarConfirm = true;
  }

  cancelarEliminar() {
    this.idEliminar = null;
    this.mostrarConfirm = false;
  }

  ejecutarEliminar() {
    if (this.idEliminar === null) return;

    if (this.tabActivo() === 'tipos-descuento') {
      this.tipoDescuentoService.delete(this.idEliminar).subscribe({
        next: () => {
          this.cancelarEliminar();
          this.cargarTiposDescuento();
          this.mostrarMensaje('Tipo de descuento eliminado correctamente');
          this.cdr.markForCheck();
        }
      });
    } else {
      this.tipoIngresoService.delete(this.idEliminar).subscribe({
        next: () => {
          this.cancelarEliminar();
          this.cargarTiposIngreso();
          this.mostrarMensaje('Tipo de ingreso eliminado correctamente');
          this.cdr.markForCheck();
        }
      });
    }
  }
}