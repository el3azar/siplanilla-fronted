import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-boletas-pago',
  standalone: true,
  imports: [],
  templateUrl: './boletas-pago.component.html',
  styleUrl: './boletas-pago.component.css'
})
export class BoletasPagoComponent {
  empleadoSel = signal('martinez');
  periodoSel  = signal('mayo2024');

  empleados = [
    { id: 'martinez', label: 'Martínez Carlos — 01234567-8' },
    { id: 'gonzalez', label: 'González María Elena — 02345678-9' },
    { id: 'rodriguez',label: 'Rodríguez José Antonio — 03456789-0' },
  ];
  periodos = [
    { id: 'mayo2024', label: 'Mayo 2024 — pagada' },
    { id: 'abril2024',label: 'Abril 2024 — pagada' },
  ];

  boleta = {
    empresa: 'Corporación Empresarial S.A. de C.V.',
    direccion: 'Blvd. del Ejército Nacional Km. 5, Zona Industrial, San Salvador',
    nit: '0614-100195-001-5', nic: 'NIC-2024-001234',
    telefono: '2222-3333', correo: 'info@corporacionempresarial.com.sv',
    periodo: 'Mayo 2024',
    repLegal: 'Carlos Roberto Martínez Herrera',
    empleado: {
      nombre: 'Martínez Herrera Carlos Roberto',
      dui: 'DUI: 01234567-8', nit: '0614-151075-001-5',
      isss: '123456789', nup: 'NUP-123456789',
      puesto: 'Gerente General', unidad: 'Gerencia General',
      ingreso: '05/01/2010',
    },
    ingresos:   [{ concepto: 'Salario Base', monto: '$4,500.00' }],
    descuentos: [
      { concepto: 'ISSS Laboral (3%)',        monto: '$30.00'    },
      { concepto: 'AFP – Pensiones (7.25%)',   monto: '$326.25'   },
      { concepto: 'Impuesto sobre la Renta (ISR)', monto: '$775.79' },
    ],
    totalIngresos:   '$4,500.00',
    totalDescuentos: '$1,132.04',
    salarioNeto:     '$3,367.96',
    isssPatronal: '$375.00', afpPatronal: '$382.50', costoTotal: '$4,500.00',
  };
}
