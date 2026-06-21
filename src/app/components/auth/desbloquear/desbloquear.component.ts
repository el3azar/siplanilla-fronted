import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-desbloquear',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './desbloquear.component.html',
  styleUrl: './desbloquear.component.css'
})
export class DesbloquearComponent implements OnInit {
  token: string = '';
  username: string = '';
  mensaje = signal<string | null>(null);
  exito = signal(false);
  cargando = signal(true);
  mostrarFormularioNuevo = signal(false);
  enviando = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Extraer token de queryParams (?token=xxx)
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (this.token) {
      // Si hay token en la URL, confirmar desbloqueo automáticamente
      this.confirmarDesbloqueo();
    } else {
      // Si no hay token, mostrar formulario para solicitar uno
      this.cargando.set(false);
      this.mostrarFormularioNuevo.set(true);
    }
  }

  confirmarDesbloqueo(): void {
    this.authService.confirmarDesbloqueo(this.token).subscribe({
      next: (response) => {
        if (response.success) {
          this.exito.set(true);
          this.mensaje.set('✅ Tu cuenta ha sido desbloqueada correctamente. Ya puedes iniciar sesión.');
        } else {
          this.exito.set(false);
          this.mensaje.set(`❌ ${response.message}`);
          this.mostrarFormularioNuevo.set(true);
        }
        this.cargando.set(false);
      },
      error: (error) => {
        this.exito.set(false);
        this.mensaje.set(`❌ ${error.error?.message || 'Error al desbloquear la cuenta'}`);
        this.mostrarFormularioNuevo.set(true);
        this.cargando.set(false);
      }
    });
  }

  solicitarNuevoToken(): void {
    if (!this.username.trim()) {
      alert('Por favor ingresa tu nombre de usuario');
      return;
    }

    this.enviando.set(true);
    this.authService.solicitarDesbloqueo(this.username).subscribe({
      next: (response) => {
        if (response.success) {
          this.mensaje.set('✅ Se envió un nuevo enlace de desbloqueo a tu correo. Revisa tu bandeja de entrada.');
          this.mostrarFormularioNuevo.set(false);
          this.username = '';
        } else {
          this.mensaje.set(`❌ ${response.message}`);
        }
        this.enviando.set(false);
      },
      error: (error) => {
        this.mensaje.set(`❌ ${error.error?.message || 'Error al solicitar desbloqueo'}`);
        this.enviando.set(false);
      }
    });
  }

  irALogin(): void {
    this.router.navigate(['/login']);
  }
}
