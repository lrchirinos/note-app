import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { Router } from '@angular/router'; 
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  loginForm: FormGroup;
  signupForm: FormGroup;

  //Un booleano simple para alternar entre los dos formularios
  isLoginMode = true;

  // Una variable para mostrar mensajes de error
  errorMessage: string | null = null;

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  //Una función para alternar el modo
  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = null; // Limpia errores antiguos
  }

  //Función para el formulario de "Sign In" (Iniciar Sesión)
  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.errorMessage = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        // ¡ÉXITO! Navega a la página principal de la app
        this.router.navigate(['/']); 
      },
      error: (err) => {
        // ¡FALLÓ! Muestra un error
        console.error(err);
        this.errorMessage = 'Invalid username or password. Please try again.';
      }
    });
  }

  //Función para el formulario de "Sign Up" (Registrarse)
  onSignup(): void {
    if (this.signupForm.invalid) {
      return;
    }
    this.errorMessage = null;

    this.authService.signup(this.signupForm.value).subscribe({
      next: () => {
        // ¡ÉXITO! Cambia al modo de login para que puedan iniciar sesión
        alert('Registration successful! Please log in.');
        this.toggleMode(); 
      },
      error: (err) => {
        // ¡FALLÓ! (Usualmente significa 'el usuario ya existe')
        console.error(err);
        this.errorMessage = 'The username already exists. Please choose another one.';
      }
    });
  }
}