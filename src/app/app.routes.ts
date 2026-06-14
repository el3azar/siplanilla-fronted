import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RecuperarPasswordComponent } from './components/auth/recuperar-password/recuperar-password.component';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListaEmpleadosComponent } from './components/empleados/lista-empleados/lista-empleados.component';
import { FormEmpleadoComponent } from './components/empleados/form-empleado/form-empleado.component';
import { EstructuraOrganizativaComponent } from './components/estructura-organizativa/estructura-organizativa.component';
import { PuestosSalariosComponent } from './components/puestos-salarios/puestos-salarios.component';
import { CatalogosComponent } from './components/catalogos/catalogos.component';
import { ListaPlanillasComponent } from './components/planilla/lista-planillas/lista-planillas.component';
import { DetallePlanillaComponent } from './components/planilla/detalle-planilla/detalle-planilla.component';
import { CentrosCostoComponent } from './components/centros-costo/centros-costo.component';
import { BoletasPagoComponent } from './components/boletas-pago/boletas-pago.component';
import { EmpresaComponent } from './components/empresa/empresa.component';
import { UsuariosComponent } from './components/administracion/usuarios/usuarios.component';
import { RolesComponent } from './components/administracion/roles/roles.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'recuperar-password', component: RecuperarPasswordComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'empleados', component: ListaEmpleadosComponent },
      { path: 'empleados/nuevo', component: FormEmpleadoComponent },
      { path: 'empleados/editar/:id', component: FormEmpleadoComponent },
      { path: 'estructura-organizativa', component: EstructuraOrganizativaComponent },
      { path: 'puestos-salarios', component: PuestosSalariosComponent },
      { path: 'catalogos', component: CatalogosComponent },
      { path: 'planilla', component: ListaPlanillasComponent },
      { path: 'planilla/:id', component: DetallePlanillaComponent },
      { path: 'centros-costo', component: CentrosCostoComponent },
      { path: 'boletas-pago', component: BoletasPagoComponent },
      { path: 'empresa', component: EmpresaComponent },
      { path: 'administracion/usuarios', component: UsuariosComponent },
      { path: 'administracion/roles', component: RolesComponent },
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
