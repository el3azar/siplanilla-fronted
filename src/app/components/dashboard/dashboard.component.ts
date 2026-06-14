import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  stats = [
    { label: 'Empleados Activos',    value: '5',           iconColor: '#8b5cf6', bgColor: '#ede9fe',
      icon: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z' },
    { label: 'Unidades Org.',         value: '13',          iconColor: '#8b5cf6', bgColor: '#ede9fe',
      icon: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21' },
    { label: 'Masa Salarial',         value: '$14,000.00',  iconColor: '#22c55e', bgColor: '#dcfce7',
      icon: 'M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' },
    { label: 'Última Planilla Neta',  value: '$11,156.63',  iconColor: '#f59e0b', bgColor: '#fef3c7',
      icon: 'M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z' },
  ];

  presupuestos = [
    { nombre: 'Gerencia General',             pct: 45, ejecutado: 54000,  total: 120000 },
    { nombre: 'Gerencia de Recursos Humanos', pct: 45, ejecutado: 38400,  total: 85000  },
    { nombre: 'Gerencia Financiera',          pct: 38, ejecutado: 36000,  total: 95000  },
    { nombre: 'Gerencia de TI',               pct: 39, ejecutado: 43200,  total: 110000 },
  ];

  ultimaPlanilla = [
    { label: 'Total ISSS Patronal', value: '$375.00',    color: '#1e40af' },
    { label: 'Total AFP Patronal',  value: '$1,225.00',  color: '#8b5cf6' },
    { label: 'Total ISR Retenido',  value: '$1,678.37',  color: '#f59e0b' },
    { label: 'Total Neto a Pagar',  value: '$11,156.63', color: '#22c55e' },
  ];

  empleadosRecientes = [
    { nombre: 'Martínez Herrera Carlos Roberto',  puesto: 'Gerente General',            unidad: 'Gerencia General',               salario: '$4,500.00' },
    { nombre: 'González López María Elena',        puesto: 'Gerente de Recursos Humanos',unidad: 'Gerencia de Recursos Humanos',   salario: '$3,200.00' },
    { nombre: 'Rodríguez Pérez José Antonio',      puesto: 'Desarrollador de Software',  unidad: 'Área de Desarrollo de Software', salario: '$1,800.00' },
    { nombre: 'Flores Gutiérrez Ana Cecilia',      puesto: 'Contador General',           unidad: 'Área de Contabilidad',           salario: '$1,500.00' },
    { nombre: 'Hernández Sánchez Miguel Ángel',    puesto: 'Gerente de TI',              unidad: 'Gerencia de TI',                 salario: '$3,000.00' },
  ];
}
