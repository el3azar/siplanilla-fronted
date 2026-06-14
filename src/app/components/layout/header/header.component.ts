import { Component, inject, signal, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnDestroy {
  private router = inject(Router);

  private readonly routeTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/empleados': 'Empleados',
    '/estructura-organizativa': 'Estructura Organizativa',
    '/puestos-salarios': 'Puestos y Salarios',
    '/catalogos': 'Catálogos',
    '/planilla': 'Planilla Mensual',
    '/centros-costo': 'Centros de Costo',
    '/boletas-pago': 'Boletas de Pago',
    '/empresa': 'Configuración de Empresa',
    '/administracion/usuarios': 'Usuarios',
    '/administracion/roles': 'Roles',
  };

  pageTitle   = signal(this.resolveTitle(this.router.url));
  currentTime = signal(this.formatTime(new Date()));
  currentDate = signal(this.formatDate(new Date()));

  private clockInterval = setInterval(() => {
    const now = new Date();
    this.currentTime.set(this.formatTime(now));
    this.currentDate.set(this.formatDate(now));
  }, 1000);

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(e => this.pageTitle.set(this.resolveTitle((e as NavigationEnd).urlAfterRedirects)));
  }

  ngOnDestroy(): void {
    clearInterval(this.clockInterval);
  }

  private resolveTitle(url: string): string {
    const path = url.split('?')[0];
    for (const [key, title] of Object.entries(this.routeTitles)) {
      if (path === key || path.startsWith(key + '/')) return title;
    }
    return 'SiPlanilla SV';
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('es-SV', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
}
