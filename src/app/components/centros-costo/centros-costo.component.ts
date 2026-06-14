import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-centros-costo',
  standalone: true,
  imports: [],
  templateUrl: './centros-costo.component.html',
  styleUrl: './centros-costo.component.css'
})
export class CentrosCostoComponent {
  anio = signal(2026);

  resumen = [
    { label: 'Presupuesto Total', value: '$0.00', color: '#1e40af', bg: '#eff6ff' },
    { label: 'Ejecutado',         value: '$0.00', color: '#f59e0b', bg: '#fef3c7' },
    { label: 'Disponible',        value: '$0.00', color: '#22c55e', bg: '#f0fdf4' },
  ];

  centros: any[] = [];
}
