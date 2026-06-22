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

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  togglePassword(): void { 
    this.showPassword.update(v => !v); 
  }

  onLogin(): void {
    const username = this.usernameInput.nativeElement.value;
    const password = this.passwordInput.nativeElement.value;

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
        const destino = this.authService.isEmpleado() ? '/boletas-pago' : '/empleados';
        this.router.navigate([destino]);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message || 'Error al iniciar sesión');
        console.error('Error en login:', error);
      }
    });
  }
}
