import { Component, signal, Signal, WritableSignal } from '@angular/core';

interface NodoArbol {
  tipo: string;
  nombre: string;
  expandido: WritableSignal<boolean>;
  empleados?: number;
  hijos: NodoArbol[];
}

@Component({
  selector: 'app-estructura-organizativa',
  standalone: true,
  imports: [],
  templateUrl: './estructura-organizativa.component.html',
  styleUrl: './estructura-organizativa.component.css'
})
export class EstructuraOrganizativaComponent {
  contadores = [
    { tipo: 'UNIDAD',       count: 1, color: '#1e40af' },
    { tipo: 'DEPARTAMENTO', count: 4, color: '#7c3aed' },
    { tipo: 'ÁREA',         count: 6, color: '#0369a1' },
    { tipo: 'SECCIÓN',      count: 2, color: '#0f766e' },
    { tipo: 'SUBSECCIÓN',   count: 0, color: '#b45309' },
  ];

  arbol: NodoArbol[] = [
    {
      tipo: 'UNIDAD', nombre: 'Gerencia General', empleados: 1, expandido: signal(true),
      hijos: [
        {
          tipo: 'DEPARTAMENTO', nombre: 'Gerencia de Recursos Humanos', expandido: signal(true),
          hijos: [
            { tipo: 'ÁREA', nombre: 'Área de Selección y Reclutamiento', expandido: signal(false), hijos: [] },
            { tipo: 'ÁREA', nombre: 'Área de Nóminas y Compensaciones',  expandido: signal(false), hijos: [] },
          ]
        },
        {
          tipo: 'DEPARTAMENTO', nombre: 'Gerencia Financiera', expandido: signal(true),
          hijos: [
            {
              tipo: 'ÁREA', nombre: 'Área de Contabilidad', expandido: signal(true),
              hijos: [
                { tipo: 'SECCIÓN', nombre: 'Sección de Cuentas por Pagar', expandido: signal(false), hijos: [] },
              ]
            },
            { tipo: 'ÁREA', nombre: 'Área de Tesorería', expandido: signal(false), hijos: [] },
          ]
        },
        {
          tipo: 'DEPARTAMENTO', nombre: 'Gerencia de Operaciones', expandido: signal(false), hijos: []
        },
        {
          tipo: 'DEPARTAMENTO', nombre: 'Gerencia de TI', expandido: signal(true),
          hijos: [
            { tipo: 'ÁREA', nombre: 'Área de Desarrollo de Software', expandido: signal(false), hijos: [] },
          ]
        },
      ]
    }
  ];

  tipoColor(tipo: string): string {
    const map: Record<string, string> = {
      'UNIDAD':       '#1e40af',
      'DEPARTAMENTO': '#7c3aed',
      'ÁREA':         '#0369a1',
      'SECCIÓN':      '#0f766e',
      'SUBSECCIÓN':   '#b45309',
    };
    return map[tipo] ?? '#64748b';
  }
}
