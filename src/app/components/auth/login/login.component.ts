import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @ViewChild('username') usernameInput!: ElementRef;
  @ViewChild('password') passwordInput!: ElementRef;

  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  isAccountBlocked = signal(false);
  userNotFound = signal(false);
  verificandoUsername = signal(false);
  usernameVerificado = signal(false);

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  /**
   * Verificar estado del usuario cuando termina de escribir el username
   */
  onUsernameBlur(): void {
    const username = this.usernameInput.nativeElement.value.trim();

    if (!username) {
      this.usernameVerificado.set(false);
      this.userNotFound.set(false);
      this.isAccountBlocked.set(false);
      this.errorMessage.set(null);
      return;
    }

    this.verificandoUsername.set(true);
    this.errorMessage.set(null);

    this.authService.verificarEstado(username).subscribe({
      next: (response) => {
        this.verificandoUsername.set(false);

        if (response.success && response.data) {
          const userData = response.data;

          if (!userData.existe) {
            this.userNotFound.set(true);
            this.isAccountBlocked.set(false);
            this.usernameVerificado.set(false);
            this.errorMessage.set(' Usuario no encontrado');
          } else if (userData.bloqueado) {
            this.isAccountBlocked.set(true);
            this.userNotFound.set(false);
            this.usernameVerificado.set(true);
            this.errorMessage.set(' Cuenta bloqueada. Solicita un desbloqueo.');
          } else {
            // Usuario existe y no está bloqueado
            this.isAccountBlocked.set(false);
            this.userNotFound.set(false);
            this.usernameVerificado.set(true);
            this.errorMessage.set(null);
          }
        }
      },
      error: (error) => {
        this.verificandoUsername.set(false);
        // El endpoint aún no está disponible — no bloquear el login
        console.warn('verificarEstado no disponible:', error);
      }
    });
  }

  onLogin(): void {
    const username = this.usernameInput.nativeElement.value;
    const password = this.passwordInput.nativeElement.value;

    // Si está bloqueado o no encontrado, no permitir login
    if (this.isAccountBlocked() || this.userNotFound()) {
      this.errorMessage.set('No puedes iniciar sesión. ' +
        (this.isAccountBlocked() ? 'La cuenta está bloqueada.' : 'El usuario no existe.'));
      return;
    }

    // Validación básica
    if (!username.trim() || !password.trim()) {
      this.errorMessage.set('Por favor complete todos los campos');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Llamar al servicio de autenticación
    this.authService.login({ username, password }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.isAccountBlocked.set(false);
        const destino = this.authService.isEmpleado() ? '/boletas-pago' : '/empleados';
        this.router.navigate([destino]);
      },
      error: (error) => {
        this.isLoading.set(false);

        // Después de error de login, verificar el estado de la cuenta nuevamente
        // Porque el backend pudo haberlo bloqueado en este o anteriores intentos
        this.authService.verificarEstado(username).subscribe({
          next: (response) => {
            if (response.success && response.data) {
              const userData = response.data;

              if (userData.bloqueado) {
                // Backend lo bloqueó después de los intentos fallidos
                this.errorMessage.set(' Cuenta bloqueada. Solicita un desbloqueo.');
                this.isAccountBlocked.set(true);
              } else {
                // Está desbloqueado, así que es error de credenciales
                this.errorMessage.set(' Credenciales inválidas');
                this.isAccountBlocked.set(false);
              }
            }
          },
          error: () => {
            // Si falla la verificación, mostrar error genérico
            this.errorMessage.set(error.message || 'Error al iniciar sesión');
            this.isAccountBlocked.set(false);
          }
        });

        console.error('Error en login:', error);
      }
    });
  }
}
