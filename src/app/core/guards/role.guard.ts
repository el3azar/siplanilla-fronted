import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles: string[] = route.data['roles'] ?? [];

    if (allowedRoles.length === 0) return true;

    const hasRole = allowedRoles.some(role => this.authService.hasRole(role));

    if (!hasRole) {
      this.router.navigate(['/boletas-pago']);
      return false;
    }

    return true;
  }
}
