import { Component } from '@angular/core';

@Component({
  selector: 'app-puestos-salarios',
  standalone: true,
  imports: [],
  templateUrl: './puestos-salarios.component.html',
  styleUrl: './puestos-salarios.component.css'
})
export class PuestosSalariosComponent {
  puestos = [
    { codigo: 'GG-001',  nombre: 'Gerente General',           unidad: 'Gerencia General',              min: '$3,500.00', max: '$6,000.00', empleados: 1 },
    { codigo: 'RH-001',  nombre: 'Gerente de Recursos Humanos',unidad: 'Gerencia de Recursos Humanos',  min: '$2,500.00', max: '$4,000.00', empleados: 1 },
    { codigo: 'RH-002',  nombre: 'Analista de RRHH',           unidad: 'Área de Selección y Reclutamiento', min: '$800.00', max: '$1,500.00', empleados: 0 },
    { codigo: 'RH-003',  nombre: 'Técnico de Nóminas',         unidad: 'Área de Nóminas y Compensaciones',  min: '$700.00', max: '$1,200.00', empleados: 0 },
    { codigo: 'FIN-001', nombre: 'Gerente Financiero',         unidad: 'Gerencia Financiera',           min: '$2,800.00', max: '$4,500.00', empleados: 0 },
    { codigo: 'FIN-002', nombre: 'Contador General',           unidad: 'Área de Contabilidad',          min: '$1,200.00', max: '$2,500.00', empleados: 1 },
    { codigo: 'FIN-003', nombre: 'Auxiliar de Contabilidad',   unidad: 'Área de Contabilidad',          min: '$500.00',   max: '$900.00',   empleados: 0 },
    { codigo: 'TI-001',  nombre: 'Gerente de TI',              unidad: 'Gerencia de TI',                min: '$2,500.00', max: '$4,000.00', empleados: 1 },
    { codigo: 'TI-002',  nombre: 'Desarrollador de Software',  unidad: 'Área de Desarrollo de Software',min: '$1,000.00', max: '$2,500.00', empleados: 1 },
    { codigo: 'TI-003',  nombre: 'Técnico de Soporte',         unidad: 'Área de Desarrollo de Software',min: '$600.00',   max: '$1,200.00', empleados: 0 },
  ];
}
