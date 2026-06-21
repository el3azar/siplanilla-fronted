import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetallePlanillaService } from '../../core/services/detalle-planilla.service';
import { DescuentoService } from '../../core/services/descuento.service';
import { IngresoService } from '../../core/services/ingreso.service';
import { DetallePlanilla } from '../../core/models/detalle-planilla.model';
import { Descuento } from '../../core/models/descuento.model';
import { Ingreso } from '../../core/models/ingreso.model';

@Component({
  selector: 'app-boletas-pago',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boletas-pago.component.html',
  styleUrl: './boletas-pago.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoletasPagoComponent implements OnInit {

  detalles: DetallePlanilla[] = [];
  detalleSeleccionado: DetallePlanilla | null = null;
  ingresos: Ingreso[] = [];
  descuentos: Descuento[] = [];
  cargando = false;
  terminoBusqueda = '';

  constructor(
    private detallePlanillaService: DetallePlanillaService,
    private descuentoService: DescuentoService,
    private ingresoService: IngresoService,
    private cdr: ChangeDetectorRef
  ) {}

  private normalizar(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  get detallesFiltrados(): DetallePlanilla[] {
    const termino = this.normalizar(this.terminoBusqueda);
    if (!termino) return this.detalles;
    return this.detalles.filter(d =>
      this.normalizar(d.nombreEmpleado).includes(termino) ||
      this.normalizar(d.periodo).includes(termino)
    );
  }

  onBuscar(valor: string) {
    this.terminoBusqueda = valor;
    this.cdr.markForCheck();
  }

  ngOnInit() {
    this.detallePlanillaService.getAll().subscribe(data => {
      console.log('Detalles recibidos:', data); // ← revisá esto en consola
      this.detalles = data;
      this.cdr.markForCheck();
    });
  }

  estaActivo(detalle: DetallePlanilla): boolean {
    return this.detalleSeleccionado?.idDetallePlanilla === detalle.idDetallePlanilla;
  }

  seleccionarEmpleado(detalle: DetallePlanilla) {
    this.cargando = true;
    this.detalleSeleccionado = detalle;
    this.ingresos = [];
    this.descuentos = [];

    this.ingresoService.getByDetalle(detalle.idDetallePlanilla).subscribe(data => {
      this.ingresos = data;
      this.cdr.markForCheck();
    });

    this.descuentoService.getByDetalle(detalle.idDetallePlanilla).subscribe(data => {
      this.descuentos = data;
      this.cargando = false;
      this.cdr.markForCheck();
      setTimeout(() => {
        document.getElementById('boleta-print')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });
  }

  imprimir() {
    window.print();
  }

  cerrarBoleta() {
    this.detalleSeleccionado = null;
    this.ingresos = [];
    this.descuentos = [];
    this.cdr.markForCheck();
  }

  cerrarModal(event: MouseEvent) {
    // cierra si se hace click en el fondo oscuro, no en el contenido
    if ((event.target as HTMLElement).classList.contains('bol-modal-overlay')) {
      this.cerrarBoleta();
    }
  }
}