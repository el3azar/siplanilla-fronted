import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetallePlanillaService } from '../../../core/services/detalle-planilla.service';
import { DescuentoService } from '../../../core/services/descuento.service';
import { TipoDescuentoService } from '../../../core/services/tipo-descuento.service';
import { IngresoService } from '../../../core/services/ingreso.service';
import { TipoIngresoService } from '../../../core/services/tipo-ingreso.service';
import { DetallePlanilla } from '../../../core/models/detalle-planilla.model';
import { Descuento } from '../../../core/models/descuento.model';
import { TipoDescuento } from '../../../core/models/tipo-descuento.model';
import { Ingreso } from '../../../core/models/ingreso.model';
import { TipoIngreso } from '../../../core/models/tipo-ingreso.model';

@Component({
  selector: 'app-detalle-planilla',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-planilla.component.html',
  styleUrl: './detalle-planilla.component.css'
})
export class DetallePlanillaComponent implements OnInit {

  private cdr = inject(ChangeDetectorRef);

  detalles: DetallePlanilla[] = [];
  detalleSeleccionado: DetallePlanilla | null = null;
  busqueda = '';  

  // Descuentos
  descuentos: Descuento[] = [];
  tiposDescuento: TipoDescuento[] = [];

  // Ingresos
  ingresos: Ingreso[] = [];
  tiposIngreso: TipoIngreso[] = [];

  // Modal descuento
  mostrarModalDescuento = false;
  idTipoDescuentoInput: number | null = null;
  montoDescuentoInput: number | null = null;
  errorDescuento = '';
  modoEdicionDescuento = false;
  idEditarDescuento: number | null = null;

  // Modal ingreso
  mostrarModalIngreso = false;
  idTipoIngresoInput: number | null = null;
  montoIngresoInput: number | null = null;
  errorIngreso = '';
  modoEdicionIngreso = false;
  idEditarIngreso: number | null = null;

  // Confirm eliminar
  mostrarConfirm = false;
  idEliminar: number | null = null;
  tipoEliminar: 'descuento' | 'ingreso' | null = null;

  mensajeExito = '';

  constructor(
    private detallePlanillaService: DetallePlanillaService,
    private descuentoService: DescuentoService,
    private tipoDescuentoService: TipoDescuentoService,
    private ingresoService: IngresoService,
    private tipoIngresoService: TipoIngresoService
  ) {}

  ngOnInit() {
    this.cargarDetalles();
    this.cargarTiposDescuento();
    this.cargarTiposIngreso();
  }

  // ← NUEVO
  detallesFiltrados(): DetallePlanilla[] {
    if (!this.busqueda.trim()) return this.detalles;
    const texto = this.busqueda.toLowerCase();
    return this.detalles.filter(d =>
      d.nombreEmpleado?.toLowerCase().includes(texto)
    );
  }

  cargarDetalles() {
    this.detallePlanillaService.getAll().subscribe(data => {
      this.detalles = data;
      if (this.detalleSeleccionado) {
        this.detalleSeleccionado = data.find(
          d => d.idDetallePlanilla === this.detalleSeleccionado!.idDetallePlanilla
        ) ?? null;
      }
      this.cdr.markForCheck();
    });
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

  seleccionarEmpleado(detalle: DetallePlanilla) {
    this.detalleSeleccionado = detalle;
    this.cargarDescuentos(detalle.idDetallePlanilla);
    this.cargarIngresos(detalle.idDetallePlanilla);
  }

  cargarDescuentos(idDetalle: number) {
    this.descuentoService.getByDetalle(idDetalle).subscribe(data => {
      this.descuentos = data;
      this.cdr.markForCheck();
    });
  }

  cargarIngresos(idDetalle: number) {
    this.ingresoService.getByDetalle(idDetalle).subscribe(data => {
      this.ingresos = data;
      this.cdr.markForCheck();
    });
  }

  mostrarMensaje(texto: string) {
    this.mensajeExito = texto;
    setTimeout(() => {
      this.mensajeExito = '';
      this.cdr.markForCheck();
    }, 3000);
  }

  // ── MODAL DESCUENTO ──────────────────────────────
  abrirModalDescuento() {
    this.idTipoDescuentoInput = null;
    this.montoDescuentoInput = null;
    this.errorDescuento = '';
    this.modoEdicionDescuento = false;
    this.idEditarDescuento = null;
    this.mostrarModalDescuento = true;
  }

  abrirModalEditarDescuento(d: Descuento) {
    this.modoEdicionDescuento = true;
    this.idEditarDescuento = d.idDescuento;
    this.idTipoDescuentoInput = d.idTipoDescuento;
    this.montoDescuentoInput = d.desMonto;
    this.errorDescuento = '';
    this.mostrarModalDescuento = true;
  }

  cerrarModalDescuento() {
    this.mostrarModalDescuento = false;
    this.idTipoDescuentoInput = null;
    this.montoDescuentoInput = null;
    this.errorDescuento = '';
    this.modoEdicionDescuento = false;
    this.idEditarDescuento = null;
  }

  guardarDescuento() {
    if (!this.idTipoDescuentoInput || !this.montoDescuentoInput || this.montoDescuentoInput <= 0) {
      this.errorDescuento = 'Seleccioná un tipo y un monto mayor a 0.';
      return;
    }
    if (!this.detalleSeleccionado) return;

    if (this.modoEdicionDescuento && this.idEditarDescuento) {
      this.descuentoService.update(this.idEditarDescuento, this.idTipoDescuentoInput, this.montoDescuentoInput).subscribe({
        next: () => {
          this.cerrarModalDescuento();
          this.cargarDescuentos(this.detalleSeleccionado!.idDetallePlanilla);
          this.cargarDetalles();
          this.mostrarMensaje('Descuento actualizado');
        },
        error: () => { this.errorDescuento = 'Error al actualizar'; this.cdr.markForCheck(); }
      });
    } else {
      this.descuentoService.create(this.detalleSeleccionado.idDetallePlanilla, this.idTipoDescuentoInput, this.montoDescuentoInput).subscribe({
        next: () => {
          this.cerrarModalDescuento();
          this.cargarDescuentos(this.detalleSeleccionado!.idDetallePlanilla);
          this.cargarDetalles();
          this.mostrarMensaje('Descuento agregado');
        },
        error: () => { this.errorDescuento = 'Ese descuento ya existe'; this.cdr.markForCheck(); }
      });
    }
  }

  // ── MODAL INGRESO ────────────────────────────────
  abrirModalIngreso() {
    this.idTipoIngresoInput = null;
    this.montoIngresoInput = null;
    this.errorIngreso = '';
    this.modoEdicionIngreso = false;
    this.idEditarIngreso = null;
    this.mostrarModalIngreso = true;
  }

  abrirModalEditarIngreso(i: Ingreso) {
    this.modoEdicionIngreso = true;
    this.idEditarIngreso = i.idIngreso;
    this.idTipoIngresoInput = i.idTipoIngreso;
    this.montoIngresoInput = i.ingMonto;
    this.errorIngreso = '';
    this.mostrarModalIngreso = true;
  }

  cerrarModalIngreso() {
    this.mostrarModalIngreso = false;
    this.idTipoIngresoInput = null;
    this.montoIngresoInput = null;
    this.errorIngreso = '';
    this.modoEdicionIngreso = false;
    this.idEditarIngreso = null;
  }

  guardarIngreso() {
    if (!this.idTipoIngresoInput || !this.montoIngresoInput || this.montoIngresoInput <= 0) {
      this.errorIngreso = 'Seleccioná un tipo y un monto mayor a 0.';
      return;
    }
    if (!this.detalleSeleccionado) return;

    if (this.modoEdicionIngreso && this.idEditarIngreso) {
      this.ingresoService.update(this.idEditarIngreso, this.idTipoIngresoInput, this.montoIngresoInput).subscribe({
        next: () => {
          this.cerrarModalIngreso();
          this.cargarIngresos(this.detalleSeleccionado!.idDetallePlanilla);
          this.cargarDetalles();
          this.mostrarMensaje('Ingreso actualizado');
        },
        error: () => { this.errorIngreso = 'Error al actualizar'; this.cdr.markForCheck(); }
      });
    } else {
      this.ingresoService.create(this.detalleSeleccionado.idDetallePlanilla, this.idTipoIngresoInput, this.montoIngresoInput).subscribe({
        next: () => {
          this.cerrarModalIngreso();
          this.cargarIngresos(this.detalleSeleccionado!.idDetallePlanilla);
          this.cargarDetalles();
          this.mostrarMensaje('Ingreso agregado');
        },
        error: () => { this.errorIngreso = 'Ese ingreso ya existe'; this.cdr.markForCheck(); }
      });
    }
  }

  // ── ELIMINAR ─────────────────────────────────────
  confirmarEliminar(id: number, tipo: 'descuento' | 'ingreso') {
    this.idEliminar = id;
    this.tipoEliminar = tipo;
    this.mostrarConfirm = true;
  }

  cancelarEliminar() {
    this.idEliminar = null;
    this.tipoEliminar = null;
    this.mostrarConfirm = false;
  }

  ejecutarEliminar() {
    if (this.idEliminar === null) return;

    if (this.tipoEliminar === 'descuento') {
      this.descuentoService.delete(this.idEliminar).subscribe({
        next: () => {
          this.cancelarEliminar();
          this.cargarDescuentos(this.detalleSeleccionado!.idDetallePlanilla);
          this.cargarDetalles();
          this.mostrarMensaje('Descuento eliminado');
        }
      });
    } else {
      this.ingresoService.delete(this.idEliminar).subscribe({
        next: () => {
          this.cancelarEliminar();
          this.cargarIngresos(this.detalleSeleccionado!.idDetallePlanilla);
          this.cargarDetalles();
          this.mostrarMensaje('Ingreso eliminado');
        }
      });
    }
  }
}