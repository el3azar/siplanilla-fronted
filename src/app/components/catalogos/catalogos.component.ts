import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-catalogos',
  standalone: true,
  imports: [],
  templateUrl: './catalogos.component.html',
  styleUrl: './catalogos.component.css'
})
export class CatalogosComponent {
  tabActivo = signal('estado-civil');

  tabs = [
    { id: 'estado-civil',   label: 'Estado Civil' },
    { id: 'territorios',    label: 'Territorios' },
    { id: 'profesiones',    label: 'Profesiones / Oficios' },
    { id: 'tipos-ingreso',  label: 'Tipos de Ingreso' },
    { id: 'tipos-descuento',label: 'Tipos de Descuento' },
  ];

  datos: Record<string, string[]> = {
    'estado-civil':    ['Soltero/a', 'Casado/a', 'Divorciado/a', 'Viudo/a', 'Unión no matrimonial'],
    'territorios':     ['San Salvador', 'Santa Ana', 'San Miguel', 'La Libertad', 'Sonsonate'],
    'profesiones':     ['Ingeniero en Sistemas', 'Contador Público', 'Licenciado en Administración', 'Técnico en Redes', 'Abogado'],
    'tipos-ingreso':   ['Salario Base', 'Horas Extra', 'Bono de Producción', 'Comisión', 'Aguinaldo'],
    'tipos-descuento': ['ISSS Laboral (3%)', 'AFP Pensiones (7.25%)', 'Impuesto sobre la Renta (ISR)', 'Préstamo Institucional', 'Seguro de Vida'],
  };

  get itemsActivos(): string[] {
    return this.datos[this.tabActivo()] ?? [];
  }
}
