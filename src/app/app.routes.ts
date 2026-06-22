import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RecuperarPasswordComponent } from './components/auth/recuperar-password/recuperar-password.component';
import { DesbloquearComponent } from './components/auth/desbloquear/desbloquear.component';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
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
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'recuperar-password', component: RecuperarPasswordComponent },
  { path: 'desbloquear', component: DesbloquearComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'empleados',
        component: ListaEmpleadosComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Administrador', 'RRHH'] }
      },
      {
        path: 'empleados/nuevo',
        component: FormEmpleadoComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Administrador', 'RRHH'] }
      },
      {
        path: 'empleados/editar/:id',
        component: FormEmpleadoComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Administrador', 'RRHH'] }
      },
      {
        path: 'estructura-organizativa',
        component: EstructuraOrganizativaComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Administrador'] }
      },
      {
        path: 'puestos-salarios',
        component: PuestosSalariosComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Administrador'] }
      },
      {
        path: 'catalogos',
        component: CatalogosComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Administrador'] }
      },
      {
        path: 'planilla',
        component: ListaPlanillasComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Administrador', 'RRHH'] }
      },
      {
        path: 'planilla/:id',
        component: DetallePlanillaComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Administrador', 'RRHH'] }
      },
      {
        path: 'centros-costo',
        component: CentrosCostoComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Administrador'] }
      },
      {
        path: 'boletas-pago',
        component: BoletasPagoComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Administrador', 'RRHH', 'Empleado'] }
      },
      {
        path: 'empresa',
        component: EmpresaComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Administrador'] }
      },
      {
        path: 'administracion/usuarios',
        component: UsuariosComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Administrador'] }
      },
      {
        path: 'administracion/roles',
        component: RolesComponent,
        canActivate: [RoleGuard],
        data: { roles: ['Administrador'] }
      },
    ]
  },
  { path: '**', redirectTo: '/boletas-pago' }
];
