import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista-planillas',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './lista-planillas.component.html',
  styleUrl: './lista-planillas.component.css'
})
export class ListaPlanillasComponent {
  expandida = signal<number | null>(0);

  planillas = [
    {
      titulo: 'Planilla Mayo 2024', fecha: 'Procesada: 2024-05-31',
      estado: 'Pagada', estadoColor: '#22c55e',
      netoTotal: '$11,156.63', costoEmpresa: '$15,600.00',
      empleados: 5, totalBruto: '$14,000.00',
      isssPatronal: '$375.00', afpPatronal: '$1,225.00', isrRetenido: '$1,678.37',
    },
  ];

  toggle(i: number) {
    this.expandida.update(v => v === i ? null : i);
  }
}
