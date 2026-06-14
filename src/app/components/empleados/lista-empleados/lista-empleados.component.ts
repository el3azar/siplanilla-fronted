import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista-empleados',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './lista-empleados.component.html',
  styleUrl: './lista-empleados.component.css'
})
export class ListaEmpleadosComponent {
  filtro = signal<'todos' | 'activos' | 'inactivos'>('todos');
  busqueda = signal('');

  empleados = [
    { nombre: 'Martínez Herrera Carlos Roberto',  email: 'cmartinez@corporacionempresarial.com.sv',  dui: '01234567-8', nit: '0614-151075-001-5', puesto: 'Gerente General',            unidad: 'Gerencia General',               salario: '$4,500.00', activo: true  },
    { nombre: 'González López María Elena',        email: 'mgonzalez@corporacionempresarial.com.sv', dui: '02345678-9', nit: '0614-220385-002-8', puesto: 'Gerente de Recursos Humanos', unidad: 'Gerencia de Recursos Humanos',   salario: '$3,200.00', activo: true  },
    { nombre: 'Rodríguez Pérez José Antonio',      email: 'jrodriguez@corporacionempresarial.com.sv',dui: '03456789-0', nit: '0614-140790-003-2', puesto: 'Desarrollador de Software',   unidad: 'Área de Desarrollo de Software', salario: '$1,800.00', activo: true  },
    { nombre: 'Flores Gutiérrez Ana Cecilia',      email: 'aflores@corporacionempresarial.com.sv',   dui: '04567890-1', nit: '0614-281192-004-9', puesto: 'Contador General',            unidad: 'Área de Contabilidad',           salario: '$1,500.00', activo: true  },
    { nombre: 'Hernández Sánchez Miguel Ángel',    email: 'mhernandez@corporacionempresarial.com.sv',dui: '05678901-2', nit: '0614-100588-005-3', puesto: 'Gerente de TI',               unidad: 'Gerencia de TI',                 salario: '$3,000.00', activo: true  },
  ];

  get empleadosFiltrados() {
    return this.empleados.filter(e => {
      const matchFiltro = this.filtro() === 'todos' || (this.filtro() === 'activos' ? e.activo : !e.activo);
      const q = this.busqueda().toLowerCase();
      const matchBusqueda = !q || e.nombre.toLowerCase().includes(q) || e.dui.includes(q);
      return matchFiltro && matchBusqueda;
    });
  }

  get activos()   { return this.empleados.filter(e =>  e.activo).length; }
  get inactivos() { return this.empleados.filter(e => !e.activo).length; }
}
